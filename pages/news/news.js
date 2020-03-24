// pages/news.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
var messageCount = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unreadpageNum:1,
    readpageNum: 1,
    unreadpageSize: 10,
    readpageSize: 10,
    unreadList:[],//未读消息列表
    readList: [],//已读消息列表
    active: 0,
    loadMore: true,
    title:'',
    unisRefresh: true,//判断是否刷新
    isRefresh: true,//判断是否刷新
    searchList: ""//存放搜索下拉刷新全部列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
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
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    this.unread("未查看")
    messageCount.messageNumber()
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
    console.log(this.data.title)
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      unreadpageNum: 1,
      unreadpageSize: 10,
      readpageNum: 1,
      readpageSize: 10,
      loadMore: true,
      isRefresh: true, 
    })
    messageCount.messageNumber()
    if (this.data.title == "未查看" || this.data.title == "") {
      this.unread("未查看")
    } else {
      this.read("已查看")
    }
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.title == "未查看"){
      this.data.unreadpageNum++
      this.data.unisRefresh = false
      this.unread("未查看")
    }else {
      this.data.readpageNum++
      this.data.isRefresh = false
      this.read("已查看")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //未查看消息
  unread(e){
    var that=this
    api.communityList({
      pageNum: that.data.unreadpageNum,
      pageSize: that.data.unreadpageSize,
      wechatId: wx.getStorageSync('openId'),
      state:e,
    },function(res){
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
        res.data[i].messageContent = time.uncodeUtf16(res.data[i].messageContent)
        res.data[i].messageName = time.uncodeUtf16(res.data[i].messageName)
      }
      if (that.data.unisRefresh) {
        that.data.searchList = res.data
        if (res.data.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      } else {
        that.data.searchList = that.data.unreadList.concat(res.data)
        if (res.data.length == 0) {
          that.setData({
            loadMore: false,
          })
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
      }
      that.setData({
        unreadList: that.data.searchList
      })
    },function(err){
    })
  },
  //已查看消息
  read(e) {
    var that = this
    api.communityList({
      pageNum: that.data.readpageNum,
      pageSize: that.data.readpageSize,
      wechatId: wx.getStorageSync('openId'),
      state: e,
    }, function (res) {
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
        res.data[i].messageContent = time.uncodeUtf16(res.data[i].messageContent )
        res.data[i].messageName = time.uncodeUtf16(res.data[i].messageName)
      }
      if (that.data.isRefresh) {
        that.data.searchList = res.data
        if (res.data.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      } else {
        that.data.searchList = that.data.readList.concat(res.data)
        if (res.data.length == 0) {
          that.setData({
            loadMore: false,
          })
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
      }
      that.setData({
        readList: that.data.searchList
      })
    }, function (err) {
    })
  },
  //切换接口
  onClick(event) {
    this.setData({
      title: event.detail.title
    })
    console.log(event.detail.title)
    if (event.detail.title == "未查看"){
      this.unread(event.detail.title)
    }else{
      this.read(event.detail.title)
    }
  },
  // //全部已读
  readBtn(){
    var that = this
    api.communityMessagecheckAll({
      wechatId: wx.getStorageSync('openId'),
      },
      function(res){
        console.log(res)
        messageCount.messageNumber()
        if (res.code == 0){
          that.unread("未查看")
        }
      }, 
      function (res) {

      }
    )
  },
  // 点击消息进入详情
  enterDetail(e) {
    api.communityMessageCheck({
      messageId: e.currentTarget.dataset.messageid
    }, function (res) {
      console.log(res)
    }, function (err) {
      console.log(err)
    })
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.titleid
    })
    messageCount.messageNumber()
  },
  enterHomePage(e){
    api.communityMessageCheck({
      messageId: e.currentTarget.dataset.messageid
    }, function (res) {
      console.log(res)
    }, function (err) {
      console.log(err)
    })
    wx.navigateTo({
      url: '../followHomePage/followHomePage?followerid=' + e.currentTarget.dataset.jumpid
    })
    messageCount.messageNumber()
  }
})