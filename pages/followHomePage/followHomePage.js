// pages/followHomePage/followHomePage.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followerid:"",
    userMessage:"",
    pageNum: 1,
    pageSize: 10,
    postList:"",//帖子列表
    commentList:"",//回答列表
    loadMore: true,
    isPostRefresh: false,//判断帖子是否刷新
    isCommentRefresh: false,//判断回答是否刷新
    tabTitle:"",//选择tab标题
    follow: '关注',//关注
    followOpenId:"",
    askList:'',
    loadingAAA: false,
    getcontentValue:'',
    loading: false,
    disabled: false,
    loading1: false,
    disabled1: false,
    listidShow:"",
    inputValue: '',//二级评论点击获取内容
    footactive: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.followerid = options.followerid
    this.getUserInfo()
    this.getComment()
    this.getPost()
    this.communityAskList(options.followerid)
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  // 判断点击tab标签
  onChangeTab(e) {
    var that=this
    that.setData({
      tabTitle:e.detail.title,
      pageNum :1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.tabTitle=="回答"){
      that.data.pageNum++
      that.data.isCommentRefresh = true
      that.getComment()
    }else{
      that.data.pageNum++
      that.data.isPostRefresh = true
      that.getPost()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取基本信息
  getUserInfo(){
    var that=this
    api.personalUserInfo({
      wechatId: that.data.followerid
    },function(res){
      console.log(res)
      res.data.nickname = time.uncodeUtf16(res.data.nickname)
      if (res.data.openId == wx.getStorageSync('openId')){
         that.setData({
           footactive:true
         })
      }
      that.setData({
        userMessage:res.data,
        followOpenId:res.data.openId
      })
      that.followCheck(that.data.followerid)
    })
  },
  // 帖子
  getPost(){
    var that=this
    api.personalPost({
      pageNum:that.data.pageNum,
      pageSize: that.data.pageSize,
      // openId:oCUylv-NVuQdO3RUjuPLvs7hfBQc,
      // isCheck:1,
      openId: that.data.followerid,
    },function(res){
      for (var i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = time.getDateDiff(res.data.list[i].createTime)
        res.data.list[i].content = time.uncodeUtf16(res.data.list[i].content)
        res.data.list[i].nickName = time.uncodeUtf16(res.data.list[i].nickName)
      }
      // 判断是否刷新
      if (that.data.isPostRefresh) {
        that.data.postList = that.data.postList.concat(res.data.list);
        if (res.data.list.length == 0) {
          that.setData({
            loadMore: false
          })
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
      } else {
        that.data.postList = res.data.list
        if (res.data.list.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      }
      that.setData({
        postList: that.data.postList
      })
    })
  },
  // 评论
  getComment(){
    var that=this
    api.personalComment({
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      wechatId: that.data.followerid
    },function(res){
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
        res.data[i].content = time.uncodeUtf16(res.data[i].content)
      }
      // 判断是否刷新
      if (that.data.isCommentRefresh) {
        that.data.commentList = that.data.commentList.concat(res.data);
        if (res.data.length == 0) {
          that.setData({
            loadMore: false
          })
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
      } else {
        that.data.commentList = res.data
        if (res.data.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      }
      that.setData({
        commentList: that.data.commentList
      })
    })
  },
  //跳转帖子详情
  postDetail(e){
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.postid
    })
  },
  //关注判断
  followCheck(e) {
    var that = this
      api.checkFollow(
        {
          followerId: that.data.followerid,
          wechatId: wx.getStorageSync('openId')
        },
        function (res) {
          if(res.msg == '已关注'){
            that.setData({
              follow: "取消关注"
            })
          }else{
            that.setData({
              follow: "关注"
            })
          }
        },
        function (err) {
          console.log(err)
        }
      )
  },
  //提问输入框
  getcontentValue: function (e) {
    this.setData({
      getcontentValue: e.detail.value
    })
  },
  //提问内容提交接口
  getcontent(e) {
    var that = this
    that.setData({
      loading: !that.data.loading,
      disabled: !that.data.disabled
    })
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
      that.setData({
        loading: false,
        disabled: false
      })
    } else {
      if (that.data.getcontentValue == "") {
        wx.showToast({
          title: "请填写提问内容...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading: false,
          disabled: false
        })
      } else if (that.data.getcontentValue.length > 140) {
        wx.showToast({
          title: "输入框文字不能超过100字...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading: false,
          disabled: false
        })
      } else {
        api.msg_sec_check({
          content: time.utf16toEntities(that.data.getcontentValue)
        },
          function (res) {
            console.log(res)
            if (res.code == 0) {
              api.communityAskInsert(
                {
                  messageName: time.utf16toEntities(wx.getStorageSync('nickName')),
                  messagePortrait: wx.getStorageSync('wechatPortrait'),
                  messageWechatId: wx.getStorageSync('openId'),
                  messageContent: time.utf16toEntities(that.data.getcontentValue),
                  objectWechatId: that.data.followOpenId
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    wx.showToast({
                      title: "提问成功",
                      icon: 'success',
                      duration: 1500,
                    })
                  }
                  that.setData({
                    getcontentValue: "",
                    loading: false,
                    disabled: false
                  })
                },
                function (err) {
                  that.setData({
                    getcontentValue: "",
                    loading: false,
                    disabled: false
                  })
                  console.log(err)
                }
              )
            } else if (res.code == 1) {
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
              that.setData({
                loading: false,
                disabled: false
              })
            } else {
              that.setData({
                loading: false,
                disabled: false
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
  //问题列表
  communityAskList(e){
    var that = this 
    api.communityAskList(
      {
        wechatId: e,
        pageNum: 1,
        pageSize:10
      },
      function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
          for (var j = 0; j < res.data[i].AnswerList.length;j++){
            res.data[i].AnswerList[j].createTime = time.getDateDiff(res.data[i].AnswerList[j].createTime)
            res.data[i].AnswerList[j].messageName = time.uncodeUtf16(res.data[i].AnswerList[j].messageName)
            res.data[i].messageName = time.uncodeUtf16(res.data[i].messageName)

          }
        }
        that.setData({
          askList: res.data,
          loadMore: false
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  //用于获取单条一级评论的ID
  editorShowTwo: function (e) {
    this.setData({
      listidShow: e.currentTarget.dataset.listid,
      objectName: e.currentTarget.dataset.listname
    })
  },
  //回答输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //回答内容提交接口
  getcontentTwo(e) {
    var that = this
    that.setData({
      loading1: !that.data.loading1,
      disabled1: !that.data.disabled1
    })
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (that.data.inputValue == "") {
        wx.showToast({
          title: "请填写回答内容...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading1: false,
          disabled1: false
        })
      } else if (that.data.inputValue > 140) {
        wx.showToast({
          title: "输入框文字不能超过100字...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading1: false,
          disabled1: false
        })
      } else {
        api.msg_sec_check({
          content: time.utf16toEntities(that.data.inputValue)
        },
          function (res) {
            console.log(res)
            if (res.code == 0) {
              api.communityAnswerInsert(
                {
                  messageName: time.utf16toEntities(wx.getStorageSync('nickName')),
                  messagePortrait: wx.getStorageSync('wechatPortrait'),
                  messageWechatId: wx.getStorageSync('openId'),
                  messageContent: time.utf16toEntities(that.data.inputValue),
                  askId: that.data.listidShow
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    that.setData({
                      listidShow: "000",
                      inputValue: '',
                      loading1: false,
                      disabled1: false
                    })
                    wx.showToast({
                      title: "回答成功",
                      icon: 'success',
                      duration: 1500,
                    })
                    that.communityAskList(that.data.followerid)
                  }
                },
                function (err) {
                  that.setData({
                    loading1: false,
                    disabled1: false
                  })
                  console.log(err)
                }
              )
            } else if (res.code == 1) {
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
              that.setData({
                loading1: false,
                disabled1: false
              })
            } else {
              that.setData({
                loading1: false,
                disabled1: false
              })
            }
          },
          function (err) {
            that.setData({
              loading1: false,
              disabled1: false
            })
            console.log(res)
          }
        )
      }
    }
  },
  //关注
  follow(e) {
    var that = this
    if (wx.getStorageSync('openId') != e.currentTarget.dataset.openid) {
      if (e.currentTarget.dataset.title == "关注") {
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
                follow: '取消关注'
              })
            }
          },
          function (err) {
            console.log(err)
          }
        )
      } else {
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
    } else {
      wx.showToast({
        title: "不能关注自己",
        icon: 'loading',
        duration: 1500,
      })
    }
  }
})