// pages/Collection.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: '',
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
    this.communityUserMyCollect()
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
    that.communityUserMyCollect()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  communityUserMyCollect(){
    var that = this
    api.communityUserMyCollect({
      openId: wx.getStorageSync('openId'),
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    },
      function (res) {
        console.log('接口请求成功', res)
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = time.formatTimeTwo(res.data.list[i].createTime, "Y-M-D")
          res.data.list[i].nickName = time.uncodeUtf16(res.data.list[i].nickName)
          if (res.data.list[i].postIcon != "") {
            res.data.list[i].postIcon = res.data.list[i].postIcon + '?x-oss-process=image/resize,m_fill,h_200,w_200'
          }
        }
        // 判断是否下拉刷新
        if (that.data.isRefresh) {
          that.data.searchList = res.data.list
          if (res.data.list.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } else {
          that.data.searchList = that.data.collectionList.concat(res.data.list);
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
        }
        that.setData({
          collectionList: that.data.searchList
        })
      }
    )
  },
  hotDetails: function (e) {
    console.log(e.currentTarget.dataset.detailid)
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.detailid
    })
  },
  ellipsis(e) {
    var that = this
    wx.showModal({
      content: '您确定要删除此条收藏',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          api.communityUserCollectDelete(
            { collectId: e.currentTarget.dataset.deleteid, openId: wx.getStorageSync('openId')},
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'none',
                  duration: 1500
                })
                that.onShow()
              }
            },
            function (err) {
              console.log(err)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})