// pages/modifyMy.js
var api = require("../../utils/api.js")
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
var time = require('../../utils/util.js')
Page({
  data: {
    truename: '',//真实姓名
    organization: '',//公司
    phone: '',//电话
    id:'',//ID
    idx:0,
    idCardNum:'',//身份证号
    project: [
      {
        val: '个人'
      },
      {
        val: '学校'
      },
      {
        val: '机构'
      },
    ]
  },
  // 改变下拉选项
  bindPickerChange: function (event) {
    this.setData({   //给变量赋值
      idx: event.detail.value,
    })
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    //登录用户
    var that = this;
    var prams = {
      wechatId: wx.getStorageSync('openId')
    }
    api.communityUserlogin(prams,
      function (res) {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            id: res.data.id,
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },
  truename: function (e) {
    this.setData({
      truename: e.detail.value
    });
  },
  organization: function (e) {
    this.setData({
      organization: e.detail.value
    });
  },
  position: function (e) {
    this.setData({
      position: e.detail.value
    });
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  idCardNum:function(e){
    this.setData({
      idCardNum: e.detail.value
    });
  },
  // 初始化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      console.log(res.context)
    }).exec()
  },
  //提交用户信息
  submission(){
    var that = this
    if (this.data.truename == ""){
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if (this.data.organization == "") {
      wx.showToast({
        title: "公司不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: "手机号不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    } else {
      if (!(/^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/.test(this.data.phone))) {
        wx.showToast({
          title: "手机号格式不正确",
          icon: 'none',
          duration: 1500,
        })
        return false
      }
    }
    if (this.data.idCardNum == "") {
      wx.showToast({
        title: "身份证号不能为空",
        icon: 'none',
        duration: 1500,
      })
      return false
    } else {
      if (!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.data.idCardNum))) {
        wx.showToast({
          title: "身份证号格式不正确",
          icon: 'none',
          duration: 1500,
        })
        return false
      }
    }
    that.editorCtx.getContents({
      success: (res) => {
        if (res.text == "\n") {
          wx.showToast({
            title: "介绍不能为空",
            icon: 'none',
            duration: 1500,
          })
          return false
        } else {
          var resume = time.utf16toEntities(res.html)
          api.communityUserUpdate(
            {
              truename: this.data.truename,//真实姓名
              organization: this.data.organization,//公司
              phone: this.data.phone,//电话
              idCardNum: this.data.idCardNum,//身份证号
              id: this.data.id,
              openId: wx.getStorageSync('openId'),
              authType: this.data.project[this.data.idx].val,//认证类型
              resume: resume, //个人介绍
              gradeSign: 4
            },
            function (res) {
              if (res.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '申请成功，请等待工作人员审核！',
                  showCancel:false,
                  success (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                // wx.showToast({
                //   title: "申请成功，等待工作人员审核",
                //   icon: 'success',
                //   duration: 1500,
                // })
                // setTimeout(function () {
                //   wx.navigateBack({
                //     delta: 1
                //   })
                // }, 1500);
              }
            },
            function (err) {
            }
          )
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
   
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
})
 
