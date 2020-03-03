// pages/news.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
var messageCount = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unreadpageNum: 1,
    readpageNum: 1,
    unreadpageSize: 10,
    readpageSize: 10,
    unreadList: [],//未读消息列表
    readList: [],//已读消息列表
    active: 0,
    loadMore: true,
    title: '',
    unisRefresh: true,//判断是否刷新
    isRefresh: true,//判断是否刷新
    searchList: ""//存放搜索下拉刷新全部列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData("越姐麻辣说")
    this.read("火龙果讲座")
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
    if (this.data.title == "越姐麻辣说" || this.data.title == "") {
      this.unread("越姐麻辣说")
    } else {
      this.read("火龙果讲座")
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
    if (this.data.title == "越姐麻辣说") {
      this.data.unreadpageNum++
      this.data.unisRefresh = false
      this.unread("越姐麻辣说")
    } else {
      this.data.readpageNum++
      this.data.isRefresh = false
      this.read("火龙果讲座")
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
   
  },
  //越姐麻辣说
  getData(e) {
    var that = this
    api.playback({
      pageNum: that.data.unreadpageNum,
      pageSize: that.data.readpageSize,
      courseType: e 
      },
      function (res) {
        console.log(res.data.list)
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = time.getDateDiff(res.data.list[i].createTime)
        }
        if (that.data.unisRefresh) {
          that.data.searchList = res.data.list
          if (res.data.list.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } else {
          that.data.searchList = that.data.unreadList.concat(res.data.list)
          if (res.data.list.length == 0) {
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
      },
      function (err) {
        console.log(err)
      }
    )
  },
  //火龙果讲座
  read(e) {
    var that = this
    api.playback({
      pageNum: that.data.unreadpageNum,
      pageSize: that.data.readpageSize,
      courseType: e
    },
      function (res) {
        console.log(res.data.list)
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = time.getDateDiff(res.data.list[i].createTime)
        }
        if (that.data.unisRefresh) {
          that.data.searchList = res.data.list
          if (res.data.list.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } else {
          that.data.searchList = that.data.readList.concat(res.data.list)
          if (res.data.list.length == 0) {
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
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 点击消息进入详情
  enterDetail(e) {
    console.log(e.currentTarget.dataset.titleid)
    wx.navigateTo({
      url: '../video/video?id=' + e.currentTarget.dataset.titleid
    })
  },
})