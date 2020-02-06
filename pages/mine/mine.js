// mine.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    show: false,//积分弹窗 
    avatarUrl: "",//用户头像地址
    nickName:"未登录",//用户姓名
    score:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this
    if (wx.getStorageSync('openId') == "") {
      that.setData({
        post: 0,
        follow: 0,
        collection: 0,
        avatarUrl: '../../images/mineTou.png',//用户头像地址
        nickName:  '授权登录',//用户姓名
        score:"0"
      })
    } else {
      api.personalCenterPanel(
        { wechatId: wx.getStorageSync('openId') },
        function (res) {
          console.log(res)
          that.setData({
            post: res.data.myPostResult,
            follow: res.data.myFollowResult,
            collection: res.data.myCollectResult,
            fans: res.data.myFans,
            
          })
        },
        function (err) {
        }
      ),
      api.communityUser_Login(
        { openId: wx.getStorageSync('openId'),
          wechatPortrait: wx.getStorageSync('wechatPortrait'), 
          nickName: time.utf16toEntities(wx.getStorageSync('nickName'))},
        function (res) {
          console.log(res)
          if (res.code == 0) {
            wx.setStorageSync('nickName', time.uncodeUtf16(res.data.nickname))
            wx.setStorageSync('wechatPortrait', res.data.wechatPortrait) 
            that.setData({
              avatarUrl: res.data.wechatPortrait,
              nickName: time.uncodeUtf16(res.data.nickname),
              score: res.data.score
            })
          }
        },
        function (err) {
          console.log(err)
        }
      )
    }
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
  onShareAppMessage: function () {

  },
  materials: function () {
    console.log(wx.getStorageSync('openId'))
    if (wx.getStorageSync('openId') == ""){
      wx.navigateTo({
        url: '../login/login',
      }) 
    }else{
      wx.navigateTo({
        url: '../modifyMy/modifyMy',
      }) 
    }
  }, 
  //我的帖子
  post:function(){
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../post/post',
      })
    }
  },
  //我的关注
  follow: function () {
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../follow/follow',
      })
    }
  },
  //我的收藏
  collection: function () {
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../collection/collection',
      })
    }
  },
  //我的粉丝
  fans: function () {
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../fans/fans',
      })
    }
  },
  mineBtn:function(){
    var that = this
    wx.clearStorage({
      success(res) {
        console.log(res)
        wx.showToast({
          title: '已清空缓存',
          icon: 'success',
          duration: 1500
        })
        that.onShow()
      }
    })
  },
  //订阅消息
  // ding:function(){
  //   wx.requestSubscribeMessage({
  //     tmplIds: ['fsAvZRGsQ6Fd8zBtbDqtqBFcziSDW5TvgeTSP8sPbq4'],
  //     success(res) { console.log(res) },
  //     fail(res) { console.log(res)}
  //   })
  // }
  dialogBtn() {
    var that = this
    that.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
})