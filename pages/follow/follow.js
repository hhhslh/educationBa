// pages/follow.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     followList:'',
     pageNum: 1,
     pageSize: 10,
     loadMore: true,
    isRefresh: true,//判断是否刷新
    searchList: ""//存放搜索下拉刷新全部列表
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
    this.communityFollowMyFollow()
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
    var that = this
    that.data.pageNum++
    that.data.isRefresh = false
    that.communityFollowMyFollow()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  communityFollowMyFollow(){
    var that = this
    api.communityFollowMyFollow({
      wechatId: wx.getStorageSync('openId'),
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    },
      function (res) {
        if (that.data.isRefresh) {
          that.data.searchList = res.data
          if (res.data.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } else {
          that.data.searchList = that.data.followList.concat(res.data);
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
        }
        for (var i = 0; i < res.data.length; i++) {
          that.data.searchList[i].followerNickname = time.uncodeUtf16(res.data[i].followerNickname)
        }
        that.setData({
          followList: that.data.searchList
        })
      }
    )
  },
  ellipsis(e){
    var that = this
    wx.showModal({
      content: '您确定要取消此条关注',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          api.communityFollowDelete(
            { id: e.currentTarget.dataset.deleteid},
            function(res){
              console.log(res)
              if(res.code == 0){
                wx.showToast({
                  title: "取消关注成功",
                  icon: 'none',
                  duration: 1500
                })
                that.onShow()
              }
            },
            function(err){
              console.log(err)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  enterHomePage(e){
    wx.navigateTo({
      url: '../followHomePage/followHomePage?followerid=' + e.currentTarget.dataset.followerid
    })
  }
})