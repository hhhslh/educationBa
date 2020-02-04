// login.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wechatNickname:'',
    openId:'',
    wechatPortrait:'',
    gender:''
  },
  onShow:function(){
    wx.login({
      success: res => {
        console.log(res.code)
        wx.setStorageSync('code', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  login(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.encryptedData = res.encryptedData,
              that.iv =  res.iv,
              that.getInfo()
            }
          })
        }
      }
    })
  },
  //获取微信用户信息
  getInfo() {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    var that = this;
    var prams = {
      code: wx.getStorageSync('code'),
      encryptedData: that.encryptedData,
      iv: that.iv
    }
    api.decodeUserInfo(prams,
      function (res) {
        console.log(res)
        console.log(res.data.nickName)
        that.setData({
          wechatNickname: res.data.nickName,
          openId: res.data.openId,
          wechatPortrait: res.data.avatarUrl,
          gender: res.data.gender
        })
        if (res.code == 0){
          that.userregister()
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },
 
  //用户登陆和注册
  userregister() {
    var that = this;
    var prams = {
      wechatNickname: time.utf16toEntities(that.data.wechatNickname),
      openId: that.data.openId,
      wechatPortrait: that.data.wechatPortrait
    }
    api.communityUser_Login(prams,
      function (res) {
        console.log(res)
        if (res.code == 0) {
          wx.setStorageSync('wechatPortrait', res.data.wechatPortrait)
          wx.setStorageSync('nickName', time.utf16toEntities(res.data.nickname))
          wx.setStorageSync('openId', res.data.openId)
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  }
})