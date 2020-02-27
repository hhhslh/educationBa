// pages/hotDetailsNoe.js
// pages/hotDetails.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data: {
    id: "",//全局ID
    hotDetails: "",// 一级二级评论数据列表
    listidShow: '',//用于来显示二级评论的input
    objectId: "",//二级评论点击获取当前一级评论的id
    objectName: "",//二级评论点击获取当前一级评论的name
    inputValue: '',//二级评论点击获取内容
    contentDetailTitle: "",//标题
    contentDetailNickName: '',//名称
    contentDetailAvatar: '',//头像
    contentDetailCreateTime: '',//时间
    hotDetailsNum: '',//一级评论的数量
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
    this.id = options.id
    this.contentTitle()
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
    this.commentAndSonlist()
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
    that.commentAndSonlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
  },
  // 头部内容
  contentTitle() {
    var that = this
    var params = {
      itemId: that.id
    }
    api.contentDetail(params, // 调用接口，传入参数
      function (res) {
        console.log(res)
        for (var i = 0; i < res.data.hotList.length; i++) {
          res.data.hotList[i].title = time.uncodeUtf16(res.data.hotList[i].title)
          if (res.data.hotList[i].postIcon != "") {
            res.data.hotList[i].postIcon = res.data.hotList[i].postIcon + '?x-oss-process=image/resize,m_fill,h_200,w_200'
          }
        }
        that.setData({
          contentDetailTitle: time.uncodeUtf16(res.data.postItem.title),
          contentDetailNickName: res.data.postItem.nickName,
          contentDetailAvatar: res.data.postItem.avatar,
          showSkeleton: false,
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 一级评论列表
  commentAndSonlist() {
    var that = this
    var params = {
      id: that.id,
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    api.commentAndSonlist(params, // 调用接口，传入参数
      function (res) {
        console.log(res.count)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createTime = time.getDateDiff(res.data[i].createTime)
          res.data[i].content = time.uncodeUtf16(res.data[i].content)
        }
        if (that.data.isRefresh) {
          that.data.searchList = res.data
          if (res.data.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } else {
          that.data.searchList = that.data.hotDetails.concat(res.data);
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
        that.setData({
          hotDetails: that.data.searchList,
          hotDetailsNum: res.count,
          loadMore: false
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  //用于获取单条一级评论的ID
  editorShowTwo: function (e) {
    this.objectId = e.currentTarget.dataset.listid
    this.setData({
      listidShow: e.currentTarget.dataset.listid,
      objectName: e.currentTarget.dataset.listname
    })
    console.log(e.currentTarget.dataset.listid)
  },
  //评论列表二级回答输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 二级评论插入
  getcontentTwo(e) {
    var that = this
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (that.data.inputValue == "") {
        wx.showToast({
          title: "请填写回复内容...",
          icon: 'none',
          duration: 1500,
        })
      } else if (that.data.inputValue > 50) {
        wx.showToast({
          title: "输入框文字不能超过50字...",
          icon: 'none',
          duration: 1500,
        })
      } else {
        api.msg_sec_check({
          content: time.utf16toEntities(that.data.inputValue)
        },
          function (res) {
            console.log(res)
            if (res.code == 0) {
              api.communityCommentSon(
                {
                  content: time.utf16toEntities(that.data.inputValue),
                  wechatId: wx.getStorageSync('openId'),
                  portrait: wx.getStorageSync('wechatPortrait'),
                  nickname: wx.getStorageSync('nickName'),
                  objectId: that.objectId
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    that.setData({
                      listidShow: "000",
                      inputValue: ''
                    })
                    wx.showToast({
                      title: "回复成功",
                      icon: 'success',
                      duration: 1500,
                    })
                  }
                },
                function (err) {
                  console.log(err)
                }
              )
            } else {
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
            }
          },
          function (err) {
            console.log(res)
          }
        )
      }
    }
  },
  // 二级评论查看全部评论
  allComments(e) {
    console.log(e.currentTarget.dataset.listid)
    wx.navigateTo({
      url: '../hotDetailsTwo/hotDetailsTwo?id=' + e.currentTarget.dataset.listid
    })
  },
})
