// pages/modifyMy.js
var api = require("../../utils/api.js")
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
var time = require('../../utils/util.js')
import WeCropper from '../../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2
Page({
  data: {
    chooseImage: '',//头像
    nickname: '',//昵称
    truename: '',//真实姓名
    slogan: '',//签名
    organization: '',//公司
    position: '',//职位
    phone: '',//电话
    usermail: '',//邮箱
    id:'',//ID
    active:false,
    imgSrc: '',//确定裁剪后的图片
    cropperOpt: {
      id: 'cropper',
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 200 * 0.5), // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200// 裁剪框高度
      }
    },
  },
  onLoad: function (options) {
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })

    //刷新画面
    this.wecropper.updateCanvas()
  },
  onReady: function () {
  },
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
  chooseshow(){
    var that = this
    that.setData({
      active: true
    })
  },
  //上传头像
  chooseImage(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];
        that.wecropper.pushOrign(src);
      }
    })
  },
  getCropperImage() {
    let that = this;
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 20000
    })
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          imgSrc: src
        })
        wx.uploadFile({
          url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/talent/upload.do',
          filePath: src,
          name: 'file',
          formData: {
            'type': 'nsi-community/UserPortrait/'
          },
          success(res) {
            var data = JSON.parse(res.data)
            if (data.code == 0){
              that.setData({
                chooseImage: data.data.url,
                active: false
              })
              wx.hideToast()
            }
          }
        })
        
      } else {
        console.log('获取图片地址失败，请稍后重试')
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
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
})
 
