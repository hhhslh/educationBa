/** 
 * new Date() ---> 转化为 年 月 日 时 分 秒
 * let date = new Date();
 * date: 传入参数日期 Date
*/
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


//时间多久前
function getDateDiff(dateTime) {
  let dateTimeStamp = new Date(dateTime).getTime();
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let year = day * 365;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  let monthEnd = diffValue / month;
  let weekEnd = diffValue / (7 * day);
  let dayEnd = diffValue / day;
  let hourEnd = diffValue / hour;
  let minEnd = diffValue / minute;
  let yearEnd = diffValue / year;
  if (yearEnd >= 1) {
    result = dateTime;
  } else if (monthEnd >= 1) {
    result = "" + parseInt(monthEnd) + "月前";
  } else if (weekEnd >= 1) {
    result = "" + parseInt(weekEnd) + "周前";
  } else if (dayEnd >= 1) {
    result = "" + parseInt(dayEnd) + "天前";
  } else if (hourEnd >= 1) {
    result = "" + parseInt(hourEnd) + "小时前";
  } else if (minEnd >= 1) {
    result = "" + parseInt(minEnd) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
};
// 将表情转为字符
function utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
  str = str.replace(patt, function (char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0); // 取出高位
      L = char.charCodeAt(1); // 取出低位
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
  return str;
}
// 标题将字符转为表情
function uncodeUtf16(str) {
  var reg = /\&#.*?;/g;
  var result = str.replace(reg, function (char) {
    var H, L, code;
    if (char.length == 9) {
      code = parseInt(char.match(/[0-9]+/g));
      H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
      L = (code - 0x10000) % 0x400 + 0xDC00;
      return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
    }else{
      return char
    }
  });
  return result;
}
// 内容不展示表情
function uncodeUtfNone(str) {
  var reg = /\&#.*?;/g;
  var result = str.replace(reg, function (char) {
    var H, L, code;
    if (char.length == 9) {
      return ""
    }
  });
  return result;
}
module.exports = {
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  getDateDiff: getDateDiff,
  uncodeUtfNone: uncodeUtfNone,
  uncodeUtf16: uncodeUtf16,
  utf16toEntities: utf16toEntities,
}