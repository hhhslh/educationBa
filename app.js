var api = require("./utils/api.js")
App({
  globalData:{
    navHeight:""
  },
  onShow() {
    this.messageNumber()
  },
  messageNumber() {
    api.messageCount({
      wechatId: wx.getStorageSync('openId')
    }, function (res) {
      if (res.data == 0) {
        wx.setTabBarBadge({
          index: 3,
        })
      } else {
        wx.setTabBarBadge({
          index: 3,
          text: String(res.data)
        })
      }

    })
  },
  onLaunch: function () {
      wx.getSystemInfo({
        success: res => {
          //导航高度
          this.globalData.navHeight = res.statusBarHeight + 46;
        }, fail(err) {
          console.log(err);
        }
      })
    },
  onLoad: function (options) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          console.log(res.confirm)
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
      })
    })
  }
})