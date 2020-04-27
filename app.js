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
// Page({
//   onLoad(options) {
//     this.getCode();
//   },
//   getCode() { //获取动态小程序码
//     wx.request({
//       url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=ACCESS_TOKEN', 
//       method: 'POST',
//       dataType: 'json',
//       data: {
//         page: "pages/hotDetails/hotDetails",
//         scene: "1374"
//       },
//       header: {
//         'content-type': 'application/x-www-form-urlencoded'
//       },
//       success: res => {
//         //后端返回的小程序码服务器地址（默认是二进制图片，我这里是后端处理过了）
//         console.log(res);
//         //此处是将小程序码下载到本地，用于canvas绘图（ps：网络图片一定要先下载到本地）
//         wx.downloadFile({
//           url: res.data.data, //上方返回的服务器小程序码地址
//           success: res1 => {
//             if (res1.statusCode === 200) {
//               //下载成功，我这里是执行的canvas绘图方法（canvas绘图可看下篇文章）
//               this.canvasPoster(res1);
//             }
//           }
//         });
//       }
//     });
//   }
// })