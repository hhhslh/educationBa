    //index.js
var api = require("../../utils/api.js")
var time = require('../../utils/util.js')
var App = getApp()
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indexTitle:[],//类目
    newList:[],//全部列表
    hotList:[],//本周讨论热榜
    pageNum: 1,
    pageSize: 10,
    loadMore: true,
    postHead: "",//类目列表
    isShow:true,//判断是否展示全部列表
    isChoose: false,//判断是否展示类目列表
    showId:0,//点击类目
    active:0,//定位在首位
    inputValue: '',//搜索内容
    isRefresh:false,//判断是否刷新
    searchList:"",//存放搜索下拉刷新全部列表
    isSearch:false,//判断是否搜索
    searchNull:false,//判断是否是空搜
    homeConfigList:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow(){
    // 置顶
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  onLoad: function (e) {
    this.setData({
      pageNum: 1,
      pageSize: 10,
      loadMore: true,
      navH: App.globalData.navHeight,//顶部导航高度
    })
    this.getIndexList()
    this.gethomeConfig()
    wx.showShareMenu()
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    // this.onLoad()
    this.setData({
      isShow: true,
      active: 0,
      showId: 11111111,
    })
    this.getIndexList()
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
    that.data.isRefresh=true
    that.data.isSearch=false
    that.getIndexList()
  },
  gethomeConfig(){
    var that=this
    api.homeConfig({},function(res){
        console.log(res)
        that.setData({
          homeConfigList:res.data
        })
    })
  },
 
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindinput(e){
    this.data.inputValue=e.detail
    this.setData({
      pageNum:1,
      isSearch:true,
      isRefresh:false
    })
    this.getIndexList()
  },
  // 获取全部列表
  getIndexList() {
    var that = this
    api.indexList({
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      searchKey: that.data.inputValue
    }, // 调用接口，传入参数
      function (res) {
        console.log('接口请求成功', res)
        for (var i = 0; i < res.data.lastList.length;i++){
          res.data.lastList[i].createTime = time.formatTimeTwo(res.data.lastList[i].createTime, "M月D日")
          res.data.lastList[i].summaryDesc = time.uncodeUtfNone(res.data.lastList[i].summaryDesc)
          res.data.lastList[i].nickName = time.uncodeUtf16(res.data.lastList[i].nickName)
          res.data.lastList[i].title = time.uncodeUtf16(res.data.lastList[i].title)
          if (res.data.lastList[i].postIcon != "") {
            res.data.lastList[i].postIcon = res.data.lastList[i].postIcon + '?x-oss-process=image/resize,m_fill,h_80,w_130'
          }
        }
        // 判断是否刷新
        if (that.data.isRefresh) {
          that.data.searchList = that.data.newList.concat(res.data.lastList);
          if (res.data.lastList.length == 0) {
            that.setData({
              loadMore: false
            })
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 1500
            })
          }
        }else{
          that.data.searchList = res.data.lastList
          if (res.data.lastList.length < 10) {
            that.setData({
              loadMore: false
            })
          }
        } 
        // 判断是否进行搜索
        if (that.data.isSearch){
          console.log(res.data.lastList.length)
          if (res.data.lastList.length == 0){
            that.setData({
              searchNull: true
            })
          } else if (that.data.inputValue==""){
            that.setData({
              searchNull: false
            })
          }
        }
        that.setData({
          indexTitle: res.data.postVO,
          newList: that.data.searchList,
          hotList:res.data.hotList
        })
      },
      function (err) {
        console.log(err)
      }
    )
  },
  // 判断是否点击全部
  chooseAll(e) {
    if (e.detail.title == '全部') {
      this.setData({
        isShow:true,
        isChoose:false
      })
    }else{
      this.setData({
        isChoose:true
      })
    }
  },
  // 进类目列表
  toTabDetail(e) {
    var that = this
    var listId = e.currentTarget.dataset.listid
    api.chineseList({
      categoryId: listId
    }, function (res) {
      console.log('接口请求成功', res)
      for (var i = 0; i < res.data.itemList.length; i++) {
        res.data.itemList[i].createTime = time.formatTimeTwo(res.data.itemList[i].createTime, "M-D")
        res.data.itemList[i].summaryDesc = time.uncodeUtfNone(res.data.itemList[i].summaryDesc)
        res.data.itemList[i].nickName = time.uncodeUtf16(res.data.itemList[i].nickName)
        res.data.itemList[i].title = time.uncodeUtf16(res.data.itemList[i].title)
      }
      that.setData({
        postHead: res.data,
        showId: listId,
        isShow:false,
        loadMore:false
      })
    },
      function (err) {
        console.log(err)
      }
    )
  },
  // 进入列表详情页
  hotDetails: function (e) {
    console.log(e.currentTarget.dataset.detailid)
    wx.navigateTo({
      url: '../hotDetails/hotDetails?id=' + e.currentTarget.dataset.detailid
    })
  },
  enterCard(e){
    console.log(e.currentTarget.dataset.cardid)
    wx.navigateTo({
      url: e.currentTarget.dataset.cardid
    })
  }

})
