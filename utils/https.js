/**
 * 请求头
 */
var header = {
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': "Bearer " + wx.getStorageSync("token"),
  'os': 'android',
  'version': '1.0.0',
  'device_token': 'ebc9f523e570ef14',
}


/**
 * 供外部post请求调用  
 */
function post(url, params, onSuccess, onFailed) {
  // console.log("请求方式：", "POST")
  request(url, params, "POST", onSuccess, onFailed);

}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed) {
  // console.log("请求方式：", "GET")
  request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, onSuccess, onFailed) {
  wx.request({
    url: url,
    data: params,
    method: method,
    header: header,
    success: function (res) {
      if (res.data) {
        onSuccess(res.data)
      }else{
        onFailed(res.data)
      }
    },
    fail: function (error) {
      onFailed("请求失败");
    }
  })
}

// 1.通过module.exports方式提供给外部调用
module.exports = {
  post: post,
  get: get,
}