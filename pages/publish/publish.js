// pages/publish.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleContent:"",//标题内容
    titleHeight:"",//标题高度
    auto_height: true,
    categoryItemList:[],//类目标签列表
    radioId: "",
    show: false,//展示弹窗
    postIcon:"",//内容图片
    itemContent:"",//展示选中标签
    isChoose:false,//是否选择了标签
    clickItemName:[],//选中标签名字
    isSubmit:false,//是否填写完整发布
    fontNumber:0,//还可在输入汉字数量
    textPlaceHolder:"",//标题placeholder
    uploadFile:"",//上传文件名字
    attachOne: "",//上传文件123路径
    attachTwo: "",
    attachThree: "",
    attach: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.categoryItemName()
  },
  // 类目标签
  categoryItemName(){
    var that = this
    api.publishCategoryItem({},
      function (res) {
        if (res.code == 0) {
          var lists = []
          for (that.data.i = 0; that.data.i < res.data.length; that.data.i++) {
            lists.push(res.data[that.data.i])
            that.setData({
              categoryItemList: lists,
              show: true,
            })
          }
        }
      }
    )
  },
  // 点击选中标签(多选) 
  clickSelect(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var comments = this.data.categoryItemList
    comments[index].isclickSelect = !comments[index].isclickSelect
    that.setData({
      isChoose: true, 
      categoryItemList: comments,
    })
    //判断是否重复 
    if (that.data.clickItemName.indexOf(e.currentTarget.dataset.name) == -1) {
      that.data.clickItemName.push(e.currentTarget.dataset.name)
    } else {
      for (var i = 0; i < that.data.clickItemName.length; i++) {
        if (that.data.clickItemName[i] == e.currentTarget.dataset.name) {
          that.data.clickItemName.splice(i, 1);
        }
      }
    }
    console.log(that.data.clickItemName)
  }, 
  getId(e){
    this.setData({
      radioId:e.currentTarget.dataset.id
    })
    console.log(this.data.radioId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
  },
  // 发布标题高度自适应
  areablur: function () {
    this.setData({
      auto_height: false
    })
  },
  areafocus: function () {
    this.setData({
      auto_height: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    if (wx.getStorageSync('openId') == "") {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    if (that.data.postIcon){
      that.data.postIcon = !that.data.postIcon
    }
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
  // 修改
  modify(){
    this.setData({
      show: true,
      textPlaceHolder:""
    })
  },
  // 确认
  onConfirm(e) {
    var that=this
    api.publishCategoryItem({},
      function (res) {
        console.log(that.data.clickItemName.length)
        if (res.code == 0 && that.data.clickItemName != "" && that.data.clickItemName.length < 6) {
            that.setData({
              show: false,
              itemContent: that.data.clickItemName.join(",").replace(/,/g, ";").split(), 
              textPlaceHolder:"请输入标题"
            })
          wx.showToast({
            title: "选择成功",
            icon: 'success',
            duration: 1500,
          })
        } else if (that.data.clickItemName.length==0){
          that.setData({
            show: true
          })
          wx.showToast({
            title: "请选择类目标签",
            icon: 'warn',
            duration: 1500,
          })
        } else if (that.data.clickItemName.length >5) {
          that.setData({
            show: true
          })
          wx.showToast({
            title: "最多可选5个",
            icon: 'warn',
            duration: 1500,
          })
        }
      }
    )
  },
  // 初始化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      console.log(res.context)
    }).exec()
  },
  // 上传图片
  uploadBtn() {
    var that = this
    that.setData({ show: false })
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        for (var i = 0; i < res.tempFilePaths.length;i++){
          wx.uploadFile({
            url: "https://data.xinxueshuo.cn/nsi-1.0/manager/talent/upload.do",
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              type: "nsi-community/CommentImg/",
            },
            success: function (res) {
              console.log(JSON.parse(res.data), '图片上传之后的数据')
              var data = JSON.parse(res.data)
              console.log(data.data.url)
              that.editorCtx.insertImage({
                src: data.data.url,
                success: function () {
                  that.setData({
                    show: false,
                    postIcon: data.data.url,
                  })
                  console.log('insert image success')
                }
              })
            }
          })
        }
        
      }
    })
  },
  // 上传文件 
  uploadFlie() {
    var that=this
    wx.chooseMessageFile({
      count: 3,
      type: 'file',
      success(res) {
        that.setData({
          uploadFile: res.tempFiles,
        })
        for(var i = 0; i < res.tempFiles.length;i++){
          wx.uploadFile({
            url: 'http://data.xinxueshuo.cn/nsi-1.0/postItem/upfile.do',
            filePath: res.tempFiles[i].path,
            name: 'file',
            formData: {
              'type': 'nsi-community/attachment/',
            },
            success(msg) {
              var data = JSON.parse(msg.data)
              if (data.data.url!=""){
                that.data.attach.push(data.data.url)
              }
              if (res.tempFiles.length == 1){
                that.setData({
                  attachOne: that.data.attach[0],
                  attachTwo: "",
                  attachThree: "",
                })
              } else if (res.tempFiles.length == 2){
                that.setData({
                  attachOne: that.data.attach[0],
                  attachTwo: that.data.attach[1],
                  attachThree: "",
                })
              }else{
                that.setData({
                  attachOne: that.data.attach[0],
                  attachTwo: that.data.attach[1],
                  attachThree: that.data.attach[2],
                })
              }
            }
          })
          console.log(that.data.attach)
        }
        
      }
    })
  }, 
  inputValue(e){
    this.setData({
      titleContent: e.detail.value
    })
  },
  // 取消
  onCancel() {
    var that=this
    wx.showModal({
      // title: '提示',
      content: '是否取消编辑',
      confirmColor: '#FF6464',
      cancelColor:'#FF6464',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            titleContent: "",
            uploadFile: "",
            auto_height: true,
          })
          that.editorCtx.clear()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }, 
  // 校验标题和内容，改变发布按钮颜色
  checkContent(res){
    this.setData({
      fontNumber: res.detail.text.length-1
    })
    if (this.data.titleContent != '' && res.detail.text.length>10){
      this.setData({
        isSubmit:true
      })
    }else{
      this.setData({
        isSubmit: false
      })
    }
  },
  // 防抖
  debounce(fn,delay) {   //默认300毫秒
    var timer;
    return function () {
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(that, args);   // this 指向vue
      }, delay);
    };
  },
  // 提交
  submit(e) {
    this.debounce(this.publish(), 500)
  },
  publish(){
    var that = this
    that.editorCtx.getContents({
      success: (res) => {
        if (that.data.postIcon) {
          var arr = res.html.match(/<img.*?(?:>|\/>)/gi);
          var src = arr[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
          that.data.postIcon = src[1]
        } else {
          that.data.postIcon = ""
        }
        var content = time.utf16toEntities(res.html)
        var title = time.utf16toEntities(that.data.titleContent)
        api.publishContent(
          {
            title: title,
            content: content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" '),
            summaryDesc: content.replace(/<(\/)?[^>].*?>/g, '').substr(0, 50),
            postIcon: that.data.postIcon,
            openId: wx.getStorageSync('openId'),
            avatar: wx.getStorageSync('wechatPortrait'),
            nickName: time.utf16toEntities(wx.getStorageSync('nickName')),
            attachOne: that.data.attachOne,
            attachTwo: that.data.attachTwo,
            attachThree: that.data.attachThree,
            postType: that.data.clickItemName.join(",").replace(/,/g, ";").split(),
          },
          function (msg) {
            if (that.data.titleContent.length > 0 && that.data.titleContent.length < 40 && res.html.replace(/<(\/)?[^>].*?>/g, '').length > 10) {
              if (msg.code == 0) {
                that.setData({
                  showModalStatus: false,
                })
                Toast('提交成功，请等待审核！')
                setTimeout(function () {
                  that.setData({
                    titleContent: "",
                    uploadFile: "",
                    attach: []
                  })
                  that.editorCtx.clear({})
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 2000);
              }
            } else if (that.data.titleContent == '') {
              wx.showToast({
                title: "标题不能为空",
                icon: 'none',
                duration: 1500,
              })
            } else if (that.data.titleContent.length > 40) {
              wx.showToast({
                title: "标题最多40字",
                icon: 'none',
                duration: 1500,
              })
            } else {
              wx.showToast({
                title: "内容至少10个字",
                icon: 'none',
                duration: 1500,
              })
            }
          },
          function (err) {
            console.log(err)
          }
        )
      },
      fail: (res) => {
        console.log(res);
      }
    });
  }
})