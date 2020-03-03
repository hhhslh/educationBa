var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({
  data: {
    src: '',//直播地址
    id:'',//直播视频id
    vidioInfo:'',//直播嘉宾介绍
    vidioTitile: '',//直播标题
    guest:''//嘉宾
  },
  onLoad: function (options) {
    this.id = options.id
    this.list(options.id)
  },
  onShow: function () {
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onShareAppMessage: function (res) {
    var that = this;
    var goods_id = that.id;//获取产品id
    var goods_title = that.vidioTitile;//获取产品标题
    if (res.from === 'button') {
      return {
        title: goods_title,
        path: '/pages/video/video?id=' + goods_id,
      }
    }
  },
  list(e){
    var that = this
    api.managerplayback({ courseId: e},
      function (res) {
        console.log(res.data)
        that.setData({
          vidioInfo: res.data.vidioInfo,
          vidioTitile: res.data.vidioTitile,
          guest: res.data.guest,
          src: res.data.mvAddress
        })
      },
      function (err) {
        console.log(err)
      }
    )
  }
})