// pages/modifyMy.js
var api = require("../../utils/api.js")
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseImage: '',//头像
    nickname: '',//昵称
    truename: '',//真实姓名
    slogan: '',//签名
    organization: '',//公司
    position: '',//职位
    phone: '',//电话
    usermail: '',//邮箱
    id:''//ID
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
    //登录用户
    var that = this;
    var prams = {
      wechatId: wx.getStorageSync('openId')
    }
    api.communityUserlogin(prams,
      function (res) {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            id: res.data.id,
            chooseImage: res.data.wechatPortrait,
            nickname: time.uncodeUtf16(res.data.nickname),
            truename: res.data.truename,
            slogan: res.data.slogan,
            organization: res.data.organization,
            position: res.data.position,
            phone: res.data.phone,
            usermail: res.data.usermail
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
    
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
  nickname: function (e) {
    this.setData({
      nickname: e.detail.value
    });
  },
  truename: function (e) {
    this.setData({
      truename: e.detail.value
    });
  },
  slogan: function (e) {
    this.setData({
      slogan: e.detail.value
    });
  },
  organization: function (e) {
    this.setData({
      organization: e.detail.value
    });
  },
  position: function (e) {
    this.setData({
      position: e.detail.value
    });
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  usermail: function (e) {
    this.setData({
      usermail: e.detail.value
    });
  },
  //上传头像
  chooseImage(){
    var that = this 
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/talent/upload.do',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'type': 'nsi-community/UserPortrait/'
          },
          success(res) {
            var data = JSON.parse(res.data)
            if (data.code == 0){
              that.setData({
                chooseImage: data.data.url
              })
            }
          }
        })
      }
    })
  },
  //提交用户信息
  submission(){
    if (this.data.slogan == ""){
      wx.showToast({
        title: "签名不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if (this.data.phone != "" && !(/^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/.test(this.data.phone))){
      wx.showToast({
        title: "手机号不正确",
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if (this.data.usermail == "") {
      wx.showToast({
        title: "邮箱不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    }else{
      if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.data.usermail))){
        wx.showToast({
          title: "邮箱格式不正确",
          icon: 'none',
          duration: 1500,
        })
        return false
      }
    }
    api.communityUserUpdate(
      {
        wechatPortrait: this.data.chooseImage,//头像
        nickname: time.utf16toEntities(this.data.nickname),//昵称
        truename: this.data.truename,//真实姓名
        slogan: this.data.slogan,//签名
        organization: this.data.organization,//公司
        position: this.data.position,//职位
        phone: this.data.phone,//电话
        usermail: this.data.usermail,//邮箱
        id: this.data.id,
        openId: wx.getStorageSync('openId')
      },
      function(res){
        if(res.code == 0){
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            duration: 1500,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500);
        }
      },
      function(err){
      }
    )
  }
})