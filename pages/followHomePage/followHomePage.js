// pages/followHomePage/followHomePage.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followerid:"",
    userMessage:"",
    pageNum: 1,
    pageSize: 10,
    postList:"",//帖子列表
    commentList:"",//回答列表
    loadMore: true,
    isPostRefresh: false,//判断帖子是否刷新
    isCommentRefresh: false,//判断回答是否刷新
    tabTitle:"",//选择tab标题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.followerid)
    this.data.followerid = options.followerid
    this.getUserInfo()
    this.getComment()
    this.getPost()
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
  // 判断点击tab标签
  onChangeTab(e) {
    var that=this
    that.setData({
      tabTitle:e.detail.title,
      pageNum :1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.tabTitle=="回答"){
      that.data.pageNum++
      that.data.isCommentRefresh = true
      that.getComment()
    }else{
      that.data.pageNum++
      that.data.isPostRefresh = true
      that.getPost()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取基本信息
  getUserInfo(){
    var that=this
    api.personalUserInfo({
      wechatId: that.data.followerid
    },function(res){
      console.log(res)
      res.data.nickname = time.uncodeUtf16(res.data.nickname)
      that.setData({
        userMessage:res.data
      })
    })
  },
  // 帖子
  getPost(){
    var that=this
    api.personalPost({
      pageNum:that.data.pageNum,
      pageSize: that.data.pageSize,
      // openId:oCUylv-NVuQdO3RUjuPLvs7hfBQc,
      // isCheck:1,
      openId: that.data.followerid,
    },function(res){
      for (var i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = time.getDateDiff(res.data.list[i].createTime)
        res.data.list[i].content = time.uncodeUtf16(res.data.list[i].content)
        res.data.list[i].nickName = time.uncodeUtf16(res.data.list[i].nickName)
      }
      // 判断是否刷新
      if (that.data.isPostRefresh) {
        that.data.postList = that.data.postList.concat(res.data.list);
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
      } else {
        that.data.postList = res.data.list
        if (res.data.list.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      }
      that.setData({
        postList: that.data.postList
      })
    })
  },
  // 评论
  getComment(){
    var that=this
    api.personalComment({
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      wechatId: that.data.followerid
    },function(res){
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
        res.data[i].content = time.uncodeUtf16(res.data[i].content)
      }
      // 判断是否刷新
      if (that.data.isCommentRefresh) {
        that.data.commentList = that.data.commentList.concat(res.data);
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
      } else {
        that.data.commentList = res.data
        if (res.data.length < 10) {
          that.setData({
            loadMore: false
          })
        }
      }
      that.setData({
        commentList: that.data.commentList
      })
    })
  },
  //跳转帖子详情
  postDetail(e){
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.postid
    })
  },
  
})