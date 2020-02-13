// pages/hotDetails.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(300)
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
    attachThree: "", //附件3
    image: '',
    qrcodeWidth: qrcodeWidth,// 用于设置wxml里canvas的width和height样式
    imgsrc: '',//二维码路径
    tempFilePath:'',//合成图片的路径
    show: false,//弹框
    attachName:""//附件名称
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
    const z = this
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      image: '',
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(z.data.text, () => {
      // 回调
      setTimeout(() => {
        qrcode.exportImage(function (path) {
          z.setData({
            imgsrc: path
          })
        })
      }, 200)
    })
  },
  getUserInfo(event) {
    console.log(event.detail);
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
          attachOne: res.data.postItem.attachOne.replace("https://nsi.oss-cn-zhangjiakou.aliyuncs.com", "http://nsi-oss.xinxueshuo.cn"),
          attachTwo: res.data.postItem.attachTwo.replace("https://nsi.oss-cn-zhangjiakou.aliyuncs.com", "http://nsi-oss.xinxueshuo.cn"),
          attachThree: res.data.postItem.attachThree.replace("https://nsi.oss-cn-zhangjiakou.aliyuncs.com", "http://nsi-oss.xinxueshuo.cn"),  
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
  renderCode(value) {
    const z = this
    console.log('make handler')
    qrcode.makeCode(value, () => {
      console.log('make')
      qrcode.exportImage(function (path) {
        console.log(path)
        z.setData({
          imgsrc: path
        })
        z.getImg()
      })
    })
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
  one(e) {
    var that = this
    console.log(1111)
    console.log(that.data.attachOne)
    that.setData({
      attachName: e.currentTarget.dataset.name
    })
    console.log(e.currentTarget.dataset.name)
    wx.downloadFile({
      url: that.data.attachOne,
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              var savedFilePath = res.savedFilePath
              console.log(savedFilePath)
              that.renderCode(that.data.attachOne)

            },
            fail(err) {
              console.log(err)
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 下载文件2
  two(e) {
    var that = this
    console.log(2222)
    console.log(that.data.attachTwo)
    that.setData({
      attachName: e.currentTarget.dataset.name
    })
    console.log(e.currentTarget.dataset.name)
    wx.downloadFile({
      url: that.data.attachTwo,
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              var savedFilePath = res.savedFilePath
              console.log(savedFilePath)
              that.renderCode(that.data.attachTwo)

            },
            fail(err) {
              console.log(err)
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 下载文件3
  three(e) {
    var that = this
    console.log(3333)
    console.log(that.data.attachThree)
    that.setData({
      attachName: e.currentTarget.dataset.name
    })
    console.log(e.currentTarget.dataset.name)
    wx.downloadFile({
      url: that.data.attachThree,
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              var savedFilePath = res.savedFilePath
              console.log(savedFilePath)
              that.renderCode(that.data.attachThree)

            },
            fail(err) {
              console.log(err)
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  //合成图片
  getImg() {
    let that = this
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../images/bg-code.png',
        success: function (res) {
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.imgsrc,
        success: function (res) {
          resolve(res);
        },
        fail(error) {
          console.log(error)
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      that.setData({
        show: true
      })
      const ctx = wx.createCanvasContext('shareImg')
      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res[0].path, 0, 0, 350, 300)
      ctx.drawImage(res[1].path, 250 / 2, 110, 100, 100)
      ctx.textAlign = 'center' //文字居中
      ctx.font = 'bold 13px Arial'
      ctx.fillStyle = '#ff6464'
      ctx.fillText("火龙果国际教育论坛", 350/2, 30)
      ctx.fillStyle = '#000'
      ctx.font = 'bold 18px Arial'
      ctx.fillText(that.data.contentDetailTitle.length > 16 ? that.data.contentDetailTitle.substring(1, 16) : that.data.contentDetailTitle, 350 / 2, 60)
      ctx.font = 'bold 17px Arial'
      ctx.fillText(that.data.attachName, 350 / 2, 90)
      ctx.font = 'bold 16px Arial'
      ctx.fillText("请使用保存此图片。用微信扫码", 350 / 2, 240)
      ctx.font = 'bold 16px Arial'
      ctx.fillText("查看附件", 350 / 2, 270)
      ctx.draw(false, setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 350,
          height: 300,
          destWidth: 350,
          destHeight: 300,
          canvasId: 'shareImg',
          success: function (res) {
            console.log(res)
            that.setData({
              tempFilePath:  res.tempFilePath
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }, 300))
    }).catch(reason => {
      console.log(reason)
    });
  },
  // 长按保存
  save: function () {
    let that = this
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
            wx.saveImageToPhotosAlbum({
              filePath: that.data.tempFilePath,
            })
        }
      }
    })
  }
})