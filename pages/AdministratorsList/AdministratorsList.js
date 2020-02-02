// pages/home/home.js
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    "DataList": [],
    "boxCheckedTotal": false,
    "boxChecked": false,
    "boxCheckbox": 1,
    "listArr":[],
    "checkNum":0,
    "checkArr":[],
    "pageSize":15,
    "pageNum":1,
    "homeTotal":"",
    "isRefresh":true,
    "onShowNum":0,
    focus: false,
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    isPassword: false, //是否密文显示 true为密文， false为明文。
    hiddenBox: true,  //控制显示隐藏
    promptedBox:false
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 全选
  checkboxChange: function (e) {
    var that = this;
    console.log( e.detail.value[0])
    if (e.detail.value[0]){
      // 多选框全部选中
      for (var i = 0; i < this.data.DataList.length; i++){
        that.data.listArr.push(this.data.DataList[i])
        var mtext = "DataList[" + i + "].phone"
        this.setData({
          [mtext]: true,
          checkNum:0
        })
      }
      // 赋值id
      this.setData({checkArr:[]});
      for(var i=0;i<that.data.DataList.length;i++){
        console.log(that.data.DataList[i])
        if(that.data.DataList[i].phone == true){
          this.setData({
            checkNum:this.data.checkNum+1
          })
          this.data.checkArr.push(that.data.DataList[i].itemId) 
          console.log(this.data.checkArr)
        }
      }
    }else{
      that.setData({ boxChecked: false });
      for (var i = 0; i < this.data.DataList.length; i++) {
        console.log(i)
        var mtext = "DataList[" + i + "].phone"
        that.setData({
          [mtext]: false,
        })
      }
    }
  },
  //单个选
  checkboxChangeChild:function(e){
    var that = this;
    // console.log(e.target)
    if (e.detail.value[0] == undefined){
      // console.log(e.target.dataset.index)
      var Ranking = 'DataList[' + e.target.dataset.index + '].phone';
      that.setData({
        [Ranking]: false,
        boxCheckedTotal:false,
        checkNum:this.data.checkNum-1,
        checkArr: []
      })
      // 循环取值id
      for (var i = 0; i < that.data.DataList.length; i++) {
        if (that.data.DataList[i].phone == true) {
          this.data.checkArr.push(that.data.DataList[i].itemId)
          console.log(this.data.checkArr)
        }
      }
    }else{
      var Ranking = 'DataList['+ e.detail.value[0] + '].phone';
      this.setData({
        [Ranking]:true,
        checkNum:0,
        checkArr:[]
      })
      // 循环取值id
      for(var i=0;i<that.data.DataList.length;i++){
        if(that.data.DataList[i].phone == true){
          this.setData({
            checkNum:this.data.checkNum+1
          })
          this.data.checkArr.push(that.data.DataList[i].itemId) 
          if(this.data.checkNum == that.data.DataList.length){
            that.setData({
              boxCheckedTotal:true
            })
          }
        }
      }
    }
    // console.log(this.data.DataList)
    // console.log(e.detail.value[0])

  },
  // 验证密码
  password_input: function (e) {
    var that = this;
    var inputValue = e.detail.value;
    console.log();
    if (inputValue == "111111") {
      wx.setStorage({
        key: "password",
        data: inputValue
      })
      
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      // 修改状态
      this.setData({
        promptedBox:true
      })
    } else {
      if (e.detail.value.length == 6) {
        this.setData({
          hiddenBox: false
        })
      } else {
        this.setData({
          hiddenBox: true
        })
      }
    }
    that.setData({
      Value: inputValue
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  getFocus: function () {
    this.setData({
      focus: !this.data.focus
    })
  },
  // 数据加载
  getData:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    console.log(that.data.pageNum)
    wx.request({
      // url:"www.baidu.com",
      url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/list.do?pageNum=1&pageSize=10&isCheck=0&title=', 
      data: {
        pageSize: that.data.pageSize,
        pageNum: that.data.pageNum,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        //全部条数
        that.data.homeTotal = res.data.data.total;
        // 取消loding
        wx.hideLoading();
        if (that.data.isRefresh){
          // 获取pagenum++ 数据重新渲染
          var DataListTwo = res.data.data.list;
          console.log(DataListTwo)
          for (var i = 0; i < DataListTwo.length;i++){
            that.data.DataList.push(DataListTwo[i]);
          }
          that.setData({
            DataList: that.data.DataList
          })
          console.log(that.data.DataList)
        }else{
          that.setData({
            DataList: res.data.data.list
          })
        }
        console.log(that.data.DataList)
      }
    })
    
  },
  //123按钮
  btn:function(){
    console.log(this.data.checkArr)
  },
  //订阅消息
  ding: function () {
    wx.requestSubscribeMessage({
      tmplIds: ['fsAvZRGsQ6Fd8zBtbDqtqBFcziSDW5TvgeTSP8sPbq4'],
      success(res) { console.log(res) },
      fail(res) { console.log(res) }
    })
    console.log("订阅成功")
  },
  //跳转详情
  btnUpDetalis:function(e){
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx:wx.navigateTo({
      url:"/pages/AdministratorsDetails/AdministratorsDetails?id=" + id,
    });

    wx.setStorage({
      key: "key",
      data: e.currentTarget.dataset.index
    })
  },
  // 批量拒绝
  refuse:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定拒绝通过吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            // url:"www.baidu.com",
            url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/verify_failed.do',
            data: {
              itemId: that.data.checkArr
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'  // 默认值
            },
            method: "post",
            // 成功返回
            success(res) {
              wx.showToast({
                title: '审核已拒绝',
                icon: 'success',
                duration: 1000
              });
              that.data.isRefresh = false;
              that.getData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 批量通过
  adopt:function(){
    var that = this;
    if(that.data.checkArr.length == 0){
      console.log("请选择内容")
    }else{
      wx.showModal({
        title: '提示',
        content: '确定通过吗',
        success(res) {
          if (res.confirm) {
            wx.request({
              // url:"www.baidu.com",
              url: 'https://data.xinxueshuo.cn/nsi-1.0/manager/postItem/verify_success.do',
              data: {
                itemId: that.data.checkArr
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'  // 默认值
              },
              method: "post",
              // 成功返回
              success(res) {
                wx.showToast({
                  title: '审核已通过',
                  icon: 'success',
                  duration: 500
                })
                that.data.isRefresh = false;
                that.getData()
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

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
    var that = this;
    wx.getStorage({
      key: 'password',
      success(res) {
        console.log(res.data == 111111)
        if (res.data == 111111) {
          that.setData({
            promptedBox: true
          })
        }
      }
    })
    console.log(that.data.onShowNum+=1)
    if (that.data.onShowNum == 1){
      that.getData();
    }else{
      console.log(that.data.DataList)
      that.data.DataList = [];
      that.getData();
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
    var that = this;
    wx.stopPullDownRefresh();
    this.data.isRefresh = false;
    that.getData();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.pageNum <= Math.ceil(that.data.homeTotal/15)){
      that.data.pageNum = that.data.pageNum+1;
      console.log(that.data.pageNum);
      that.getData();
    }else{
      wx.showToast({
        title: '加载完毕',
        icon: 'success',
        duration: 1000
      })

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "管理员审核", //转发显示标题
      path: "pages/AdministratorsList/AdministratorsList", //转发当前的页面
    }
  }
})