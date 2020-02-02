// var WxParse = require('../../wxParse/wxParse.js');
// pages/two/two.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WXparseData:"",
    nodes:"",
    itemId:"",
    headerTitle:""
  },
  // 拒绝
  refuse:function(){
    var that = this;
    console.log(parseInt(this.data.itemId));
    wx.showModal({
      title: '提示',
      content: '确定拒绝吗',
      success(res) {
        if (res.confirm) {
          //拒绝操作
          wx.request({
            url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/verify_failed.do',
            data: {
              itemId: parseInt(that.data.itemId),
              isCheck:2
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'  // 默认值
            },
            method:"post",
            // 成功返回
            success: function(res) {
              console.log(res.data.code)
              //拒绝成功提示框
              if(res.data.code == 0){
                wx.showToast({
                  title: '拒绝成功',
                  icon: 'success',
                  duration: 2000
                });
                //更新
                wx.request({
                  // url:"www.baidu.com",
                  url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/list.do?pageNum=1&pageSize=10&isCheck=0&title=',
                  data: {

                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    console.log()
                    if (res.data.data.list.length == 0){
                      // 当前无数据 跳转list页面
                      wx.showToast({
                        title: '全部审核完毕',
                        icon: 'success',
                        duration: 2000
                      });
                      setTimeout(function(){
                        wx.navigateBack({
                          delta: 1
                        })
                      },2000)
                    }else{
                      //获取下一条的信息
                      that.setData({
                        itemId: res.data.data.list[0].itemId,
                        headerTitle: res.data.data.list[0].title
                      });
                      let data = res.data.data.list[0].content;
                      that.setData({ nodes: data })
                    }
                  }
                });
              }
              console.log(res)
            },
            fail: function(res) {},
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //通过
  adopt:function(){
    var that = this;
    console.log(parseInt(this.data.itemId));
    wx.showModal({
      title: '提示',
      content: '确定通过吗',
      success(res) {
        if (res.confirm) {
          //通过
          wx: wx.request({
            url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/verify_success.do',
            data: {
              itemId: parseInt(that.data.itemId),
              isCheck: 1
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'  // 默认值
            },
            method: "post",
            success: function (res) {
              console.log(res.data.code)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '通过成功',
                  icon: 'success',
                  duration: 2000
                });
                // 更新
                wx.request({
                  // url:"www.baidu.com",
                  url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/list.do?pageNum=1&pageSize=10&isCheck=0&title=', 
                  data: {},
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    if(res.data.data.list.length == 0){
                      // 当前无数据 跳转list页面
                      wx.showToast({
                        title: '全部审核完毕',
                        icon: 'success',
                        duration: 2000
                      });
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 2000)
                    }else{
                      //获取下一条的信息
                      that.setData({
                        itemId: res.data.data.list[0].itemId,
                        headerTitle: res.data.data.list[0].title
                      })
                      let data = res.data.data.list[0].content;
                      that.setData({ nodes: data })
                    }
                  }
                })
              }
            
            },
            fail: function (res) { },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      itemId:options.id
    })
    wx.request({
      // url:"www.baidu.com",
      url: 'https://data.xinxueshuo.cn/nsi-1.0/postItem/detail.do', 
      data: {
        itemId:that.data.itemId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          headerTitle: res.data.data.postItem.title
        })
    
        let data = res.data.data.postItem.content;
        that.setData({ nodes: data })
      }
    })
   

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

  }
})