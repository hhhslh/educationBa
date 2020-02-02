// pages/hotList.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList:"",
    pageNum:1,
    pageSize:10,
    loadMore:true,
    isRefresh: true,//判断是否刷新
    searchList: "",//存放搜索下拉刷新全部列表
    hotBg:'',//第一条数据
    hot:''//前三条评论
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
    this.setData({
      pageNum: 1,
      pageSize: 10,
      loadMore: true,
      isRefresh: true,
    })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    this.onShow()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
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
    api.hotList({
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
      },function (res) {
        console.log('接口请求成功', res)
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = time.formatTimeTwo(res.data.list[i].createTime, "M月D日")
          res.data.list[i].summaryDesc = time.uncodeUtfNone(res.data.list[i].summaryDesc)
          res.data.list[i].title = time.uncodeUtf16(res.data.list[i].title)
          res.data.list[i].nickName = time.uncodeUtf16(res.data.list[i].nickName)
          if (res.data.list[i].postIcon != "") {
            res.data.list[i].postIcon = res.data.list[i].postIcon + '?x-oss-process=image/resize,m_fill,h_200,w_200'
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
        that.commentAndSonlist(that.data.searchList[0].itemId)
        that.setData({
          hotList: that.data.searchList,
          hotBg: that.data.searchList[0]
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  hotDetails:function(e){
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.detailid
    })
  },
  // 一级二级评论列表
  commentAndSonlist(e) {
    var that = this
    var params = {
      id: e,
      pageNum: "1",
      pageSize: "10"
    }
    api.commentAndSonlist(params, // 调用接口，传入参数
      function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
          res.data[i].content = time.uncodeUtf16(res.data[i].content)
        }
        that.setData({
          hot: res.data.slice(0, 3),
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  hot(){
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + this.data.hotBg.itemId
    })
  }
})