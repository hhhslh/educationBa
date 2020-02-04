// pages/hotList.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: "",
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
    this.getHotList()
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
    that.getHotList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getHotList() {
    var that = this
    api.communityUserMyPostItem({
      openId: wx.getStorageSync('openId'),
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }, function (res) {
      for (var i = 0; i < res.data.list.length;i++){
        res.data.list[i].nickName = time.uncodeUtf16(res.data.list[i].nickName)
        console.log(time.uncodeUtf16(res.data.list[i].nickName))
        if (res.data.list[i].isCheck == 0){
          res.data.list[i].isCheck = "审核中"
        }
        if (res.data.list[i].isCheck == 1) {
          res.data.list[i].isCheck = "已发布"
        }
        if (res.data.list[i].isCheck == 2) {
          res.data.list[i].isCheck = "审核失败"
        }
      }
      if (that.data.isRefresh) {
        that.data.searchList = res.data.list
        if (res.data.list.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      } else {
        that.data.searchList = that.data.hotList.concat(res.data.list);
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
        hotList: that.data.searchList,
      })
    },
      function (err) {
        console.log(err)
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
      content: '您确定要删除此条帖子',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          api.communityUserDelete(
            { itemId: e.currentTarget.dataset.deleteid, openId: wx.getStorageSync('openId') },
            function (res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: res.msg,
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
  },
  postModify: function (e) {
    console.log(e.currentTarget.dataset.detailid)
    wx.navigateTo({
      url: '../postModify/postModify?id=' + e.currentTarget.dataset.detailid
    })
  },
  
})