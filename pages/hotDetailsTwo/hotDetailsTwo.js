// pages/hotDetails.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data: {
    id: "",//全局ID
    hotDetails: "",// 一级二级评论数据列表
    getcontentValue: '',//二级评论点击获取内容
    contentDetailContent: "",//详情内容
    contentDetailNickname: '',//名称
    contentDetailPortrait: '',//头像
    contentDetailCreateTime: '',//时间
    loading1: false,
    disabled1: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id
    this.communityCommentSonTwo(options.id)
    this.communityCommentSondetail(options.id)
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 头部内容
  communityCommentSondetail() {
    var that = this
    var params = {
      id: that.id
    }
    api.communityCommentSondetail(params, // 调用接口，传入参数
      function (res) {
        that.setData({
          contentDetailContent: res.data.content,
          contentDetailNickname: time.uncodeUtf16(res.data.nickname),
          contentDetailPortrait: res.data.portrait,
          contentDetailCreateTime: time.formatTimeTwo(res.data.createTime, "M-D")
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 一级二级评论列表
  communityCommentSonTwo(e) {
    var that = this
    var params = {
      id: e,
      pageNum: "1",
      pageSize: "10"
    }
    api.communityCommentSonTwo(params, // 调用接口，传入参数
      function (res) {
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = time.getDateDiff(res.data.list[i].createTime)
          res.data.list[i].content = time.uncodeUtf16(res.data.list[i].content)
          res.data.list[i].nickname = time.uncodeUtf16(res.data.list[i].nickname)
        }
        that.setData({
          hotDetails: res.data.list
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 二级评论插入
  getcontentTwo(e) {
    var that = this
    that.setData({
      loading1: !that.data.loading1,
      disabled1: !that.data.disabled1
    })
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      if (that.data.getcontentValue == "") {
        wx.showToast({
          title: "请填写回复内容...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading1: false,
          disabled1: false
        })
      } else if (that.data.getcontentValue > 140) {
        wx.showToast({
          title: "输入框文字不能超过140字...",
          icon: 'none',
          duration: 1500,
        })
        that.setData({
          loading1: false,
          disabled1: false
        })
      } else {
        api.msg_sec_check({
          content: time.utf16toEntities(that.data.getcontentValue)
        },
          function (res) {
            console.log(res)
            if (res.code == 0) {
              api.communityCommentSon(
                {
                  content: time.utf16toEntities(that.data.getcontentValue),
                  wechatId: wx.getStorageSync('openId'),
                  portrait: wx.getStorageSync('wechatPortrait'),
                  nickname: time.utf16toEntities(wx.getStorageSync('nickName')),
                  objectId: that.id
                },
                function (res) {
                  console.log(res)
                  if (res.code == 0) {
                    that.setData({
                      getcontentValue: '',
                      loading1: false,
                      disabled1: false
                    })
                    wx.showToast({
                      title: "回复成功",
                      icon: 'success',
                      duration: 1500,
                    })
                  }
                },
                function (err) {
                  that.setData({
                    loading1: false,
                    disabled1: false
                  })
                  console.log(err)
                }
              )
            } else if (res.code == 1) {
              wx.showToast({
                title: "内容包含敏感信息，请重新输入",
                icon: 'none',
                duration: 1500,
              })
              that.setData({
                loading1: false,
                disabled1: false
              })
            }else{
              that.setData({
                loading1: false,
                disabled1: false
              })
            }
          },
          function (err) {
            that.setData({
              loading1: false,
              disabled1: false
            })
            console.log(res)
          }
        )

      }
    }
  },
  //评论列表二级回答输入框
  getcontentValue: function (e) {
    this.setData({
      getcontentValue: e.detail.value
    })
  },
})