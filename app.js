var api = require("./utils/api.js")
App({
  globalData:{
    navHeight:""
  },
  onShow() {
    this.messageNumber()
    //使用更新对象之前判断是否可用
    if (wx.canIUse('getUpdateManager')) {
      console.log("检查更新版本")
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)//res.hasUpdate返回boolean类型
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启当前应用？',
              success(res) {
                if (res.confirm) {
                  wx.clearStorage()
                  // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          // 新版本下载失败时执行
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '发现新版本',
              content: '请删除当前小程序，重新搜索打开...',
            })
          })
        }
      })
    } else {
      //如果小程序需要在最新的微信版本体验，如下提示
      wx.showModal({
        title: '更新提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
})