// pages/hotDetails.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data: {
    showSkeleton: true,
    id: "",//全局ID
    hotDetails: "",// 一级二级评论数据列表
    getcontentValue:"",//一级评论的内容input
    listidShow:'',//用于来显示二级评论的input
    objectId: "",//二级评论点击获取当前一级评论的id
    objectName: "",//二级评论点击获取当前一级评论的name
    inputValue: '',//二级评论点击获取内容
    contentDetailTitle: "",//标题
    contentDetailContent: "",//详情内容
    contentDetailNickName:'',//名称
    contentDetailAvatar: '',//头像
    contentDetailCreateTime: '',//时间
    followOpenId:'',//帖子用户的openid
    hotList:"",//最热帖子推荐
    follow: '关注',//关注
    isDisabled: false,
    collDisabled: false,
    collection: '收藏',//收藏
    loadingAAA:false,
    hotDetailsNum:'',//一级评论的数量
    attachOne: "",//附件1
    attachTwo: "",//附件2
    attachThree: ""//附件3
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id
    this.contentTitle()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.commentAndSonlist(this.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var goods_id = that.id;//获取产品id
    var goods_title = that.contentDetailTitle;//获取产品标题
    if (res.from === 'button') {
      api.addShareNum({ itemId: goods_id },
        function (res) {
          console.log(res)
        },
        function (err) {
          console.log(err)
        }
      )
      return {
        title: goods_title,
        path: '/pages/hotDetails/hotDetails?id=' + goods_id,
        // imageUrl: goods_img //不设置则默认为当前页面的截图
      }
    }
  },
  // 头部内容
  contentTitle() {
    var that = this
    var params = {
      itemId: that.id
    }
    api.contentDetail(params, // 调用接口，传入参数
      function (res) {
        console.log(res)
        if(res.code==1){
          wx.showToast({
            title: "此贴已删除",
            icon: 'none',
            duration: 1500,
          })
        }
        for (var i = 0; i < res.data.hotList.length;i++){
          res.data.hotList[i].title = time.uncodeUtf16(res.data.hotList[i].title)
          res.data.hotList[i].nickName = time.uncodeUtf16(res.data.hotList[i].nickName)
          if (res.data.hotList[i].postIcon !=""){
            res.data.hotList[i].postIcon = res.data.hotList[i].postIcon + '?x-oss-process=image/resize,m_fill,h_200,w_200'
          }

        }
        that.setData({
          contentDetailContent: time.uncodeUtf16(res.data.postItem.content),
          contentDetailTitle: time.uncodeUtf16(res.data.postItem.title),
          contentDetailNickName: time.uncodeUtf16(res.data.postItem.nickName),
          contentDetailAvatar: res.data.postItem.avatar,
          contentDetailCreateTime: time.formatTimeTwo(res.data.postItem.createTime, "M月D日"),
          followOpenId: res.data.postItem.openId,
          attachOne: res.data.postItem.attachOne,
          attachTwo: res.data.postItem.attachTwo,
          attachThree: res.data.postItem.attachThree,  
          hotList: res.data.hotList,
          showSkeleton: false,
          loadingAAA: true//loading显示隐藏
        })
        that.followCheck(res.data.postItem.openId)
        that.collectCheck(res.data.postItem.itemId)
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 一级二级评论列表
  commentAndSonlist(e) {
    var that = this
    var params ={
      id:e,
      pageNum:"1",
      pageSize: "10"
    }
    api.commentAndSonlist(params, // 调用接口，传入参数
      function (res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
          res.data[i].content = time.uncodeUtf16(res.data[i].content)
          res.data[i].nickname = time.uncodeUtf16(res.data[i].nickname)
        }
        if (res.count > 5){
          that.setData({
            hotDetails: res.data.slice(0, 5),
            hotDetailsNum: res.count
          })
        }else{
          that.setData({
            hotDetails: res.data,
            hotDetailsNum: res.count
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },
  //评论列表一级回答输入框
  getcontentValue: function (e) {
    this.setData({
      getcontentValue: e.detail.value
    })
  },
  //一级评论的内容提交接口
  getcontent(e){
    var that = this
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (that.data.getcontentValue == ""){
        wx.showToast({
          title: "请填写回复内容...",
          icon: 'none',
          duration: 1500,
        })
      } else if (that.data.getcontentValue.length > 140){
        wx.showToast({
          title: "输入框文字不能超过140字...",
          icon: 'none',
          duration: 1500,
        })
      }else{
        api.msg_sec_check({
          content : time.utf16toEntities(that.data.getcontentValue)
          },
          function(res){
            console.log(res)
            if (res.code == 0){
              api.communityCommentinsert(
                {
                  content: time.utf16toEntities(that.data.getcontentValue),
                  wechatId: wx.getStorageSync('openId'),
                  portrait: wx.getStorageSync('wechatPortrait'),
                  nickname: time.utf16toEntities(wx.getStorageSync('nickName')),
                  objectId: that.id
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    wx.showToast({
                      title: "回复成功",
                      icon: 'success',
                      duration: 1500,
                    })
                  }
                  that.setData({
                    getcontentValue: ""
                  })
                },
                function (err) {
                  console.log(err)
                }
              )
            }else{
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
            }
          },
          function(err){
            console.log(res)
          }
        )
        
      }
    }
  },
  //用于获取单条一级评论的ID
  editorShowTwo: function (e) {
    this.objectId = e.currentTarget.dataset.listid
    this.setData({
      listidShow: e.currentTarget.dataset.listid,
      objectName: e.currentTarget.dataset.listname
    })
    console.log(e.currentTarget.dataset.listid)
  },
  //评论列表二级回答输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 二级评论插入
  getcontentTwo(e) {
    var that = this
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (that.data.inputValue == "") {
        wx.showToast({
          title: "请填写回复内容...",
          icon: 'none',
          duration: 1500,
        })
      } else if (that.data.inputValue >140){
        wx.showToast({
          title: "输入框文字不能超过140字...",
          icon: 'none',
          duration: 1500,
        })
      }else {
        api.msg_sec_check({
          content: time.utf16toEntities(that.data.inputValue)
        },
          function (res) {
            console.log(res)
            if (res.code == 0){
              api.communityCommentSon(
                {
                  content: time.utf16toEntities(that.data.inputValue),
                  wechatId: wx.getStorageSync('openId'),
                  portrait: wx.getStorageSync('wechatPortrait'),
                  nickname: time.utf16toEntities(wx.getStorageSync('nickName')),
                  objectId: that.objectId
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    that.setData({
                      listidShow: "000",
                      inputValue: ''
                    })
                    wx.showToast({
                      title: "回复成功",
                      icon: 'success',
                      duration: 1500,
                    })
                  }
                },
                function (err) {
                  console.log(err)
                }
              )
            }else{
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
            }
          },
          function (err) {
            console.log(res)
          }
        )
       
      }
    }
  },
  // 二级评论查看全部评论
  allComments(e){
    console.log(e.currentTarget.dataset.listid)
    wx.navigateTo({
      url: '../hotDetailsTwo/hotDetailsTwo?id=' + e.currentTarget.dataset.listid
    })
  },
  //推荐帖子跳转
  hotDetails: function (e) {
    console.log(e.currentTarget.dataset.detailid)
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.detailid
    })
  },
  //收藏
  collection(e){
    var that = this
    console.log(e.currentTarget.dataset.title)
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (wx.getStorageSync('openId') != that.data.followOpenId){
        if (e.currentTarget.dataset.title == "收藏"){
          api.postItemNum(
            {
              itemId: that.id,
              openId: wx.getStorageSync('openId')
            },
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: "收藏成功",
                  icon: 'success',
                  duration: 1500,
                })
                that.setData({
                  collDisabled: true,
                  collection: "已收藏"
                })
              }
              if (res.code == 1) {
                wx.showToast({
                  title: res.msg,
                  icon: 'loading',
                  duration: 1500,
                })
              }
            },
            function (err) {
              console.log(err)
            }
          )
        }else{
          api.collect_delete(
            {
              itemId: that.id,
              openId: wx.getStorageSync('openId')
            },
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: "取消收藏成功",
                  icon: 'success',
                  duration: 1500,
                })
                that.setData({
                  collection: "收藏"
                })
              }
            },
            function (err) {
              console.log(err)
            }
          )
        }
      } else {
        wx.showToast({
          title: "不能收藏自己",
          icon: 'loading',
          duration: 1500,
        })
      }
    }
  },
  //关注
  follow(e) {
    var that = this
    console.log(e.currentTarget.dataset.openid)
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      if (wx.getStorageSync('openId') != e.currentTarget.dataset.openid){
        if (e.currentTarget.dataset.title == "关注"){
          api.communityFollow(
            {
              followerId: e.currentTarget.dataset.openid,
              openId: wx.getStorageSync('openId')
            },
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: "关注成功",
                  icon: 'success',
                  duration: 1500,
                })
                that.setData({
                  follow: '已关注'
                })
              }
            },
            function (err) {
              console.log(err)
            }
          )
        }else{
          api.cancelFollow(
            {
              followerId: e.currentTarget.dataset.openid,
              wechatId: wx.getStorageSync('openId')
            },
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: "取消关注成功",
                  icon: 'success',
                  duration: 1500,
                })
                that.setData({
                  follow: '关注'
                })
              }
            },
            function (err) {
              console.log(err)
            }
          )
        }
        
      }else{
        wx.showToast({
          title: "不能关注自己",
          icon: 'loading',
          duration: 1500,
        })
      }
    }
  },
  //关注判断
  followCheck(e) {
    var that = this
    if (wx.getStorageSync('openId') != "") {
      api.checkFollow(
        {
          followerId: e,
          wechatId: wx.getStorageSync('openId')
        },
        function (res) {
          console.log(res)
          if(res.code == 1){
            that.setData({
              follow:"已关注"
            })
          }
        },
        function (err) {
          console.log(err)
        }
      )
    }
  },
  //收藏判断
  collectCheck(e) {
    var that = this
    if (wx.getStorageSync('openId') != "") {
      api.find_is_collect(
        {
          itemId : e,
          openId : wx.getStorageSync('openId')
        },
        function (res) {
          console.log(res)
          if (res.code == 1) {
            that.setData({
              collection: "已收藏"
            })
          }
        },
        function (err) {
          console.log(err)
        }
      )
    }
  },
  //查看更多评论 hotDetailsID
  hotDetailsNum(){
    wx.navigateTo({
      url: '../hotDetailsOne/hotDetailsOne?id='+this.id,
    })
  },
  enterHomePage(e) {
    wx.navigateTo({
      url: '../followHomePage/followHomePage?followerid=' + e.currentTarget.dataset.followerid
    })
  },
  // 下载文件1
  one() {
    var that = this
    wx.downloadFile({
      url: that.data.attachOne,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        var index = that.data.attachOne.lastIndexOf("\.");
        that.data.attachOne = that.data.attachOne.substring(index + 1, that.data.attachOne.length);
        console.log(that.data.attachOne)
        wx.openDocument({
          filePath: filePath,
          fileType: String(that.data.attachOne),
          success: function (res) {
            console.log('打开文档成功')
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 下载文件2
  two(e) {
    var that = this
    wx.downloadFile({
      url: that.data.attachTwo,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        var index = that.data.attachTwo.lastIndexOf("\.");
        that.data.attachTwo = that.data.attachTwo.substring(index + 1, that.data.attachTwo.length);
        console.log(that.data.attachTwo)
        wx.openDocument({
          filePath: filePath,
          fileType: String(that.data.attachTwo),
          success: function (res) {
            console.log('打开文档成功')
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 下载文件3
  three(e) {
    var that = this
    wx.downloadFile({
      url: that.data.attachThree,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        var index = that.data.attachThree.lastIndexOf("\.");
        that.data.attachThree = that.data.attachThree.substring(index + 1, that.data.attachThree.length);
        console.log(that.data.attachThree)
        wx.openDocument({
          filePath: filePath,
          fileType: String(that.data.attachThree),
          success: function (res) {
            console.log('打开文档成功')
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
})