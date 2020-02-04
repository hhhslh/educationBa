var http = require('https.js'); //导入封装的 post和get请求
// const URL = 'http://192.168.0.103:8080/nsi-1.0'; // 测试李岩
// const URL = 'http://192.168.0.102:8080/nsi-1.0'; // 测试罗振
const URL = 'https://data.xinxueshuo.cn/nsi-1.0'; // 线上
const decodeUserInfo = (params, success, faild) => http.post(URL + "/communityUser/decodeUserInfo.do", params, success, faild);
const chineseList = (params, success, faild) => http.get(URL + "/post/detail.do", params, success, faild);
const indexList = (params, success, faild) => http.get(URL + "/post/list.do", params, success, faild);
const communityComment = (params, success, faild) => http.post(URL + "/communityComment/list", params, success, faild);
const communityCommentinsert = (params, success, faild) => http.post(URL + "/communityComment/insert", params, success, faild);
const publishContent = (params, success, faild) => http.post(URL + "/postItem/add.do", params, success, faild);
const publishCategoryItem = (params, success, faild) => http.get(URL + "/postItem/find_category_item.do", params, success, faild);
const communityCommentSon = (params, success, faild) => http.post(URL + "/communityCommentSon/insertCommentSon", params, success, faild);
const communityCommentSonTwo = (params, success, faild) => http.post(URL + "/communityCommentSon/list", params, success, faild);
const commentAndSonlist = (params, success, faild) => http.post(URL + "/communityComment/CommentAndSonlist", params, success, faild);
const contentDetail = (params, success, faild) => http.get(URL + "/postItem/detail.do", params, success, faild); 
const hotList = (params, success, faild) => http.get(URL + "/post/hot_list.do", params, success, faild); 
const communityCommentSondetail = (params, success, faild) => http.post(URL + "/communityComment/detail", params, success, faild);
const addShareNum = (params, success, faild) => http.get(URL + "/postItem/add_share_num.do", params, success, faild);  
const communityFollow = (params, success, faild) => http.post(URL + "/communityFollow/insert", params, success, faild);  
const communityFollowMyFollow = (params, success, faild) => http.post(URL + "/communityFollow/myFollow", params, success, faild);
const communityList = (params, success, faild) => http.post(URL + "/communityMessage/list", params, success, faild);
const communityUserlogin = (params, success, faild) => http.post(URL + "/communityUser/login", params, success, faild);
const communityUserregister = (params, success, faild) => http.post(URL + "/communityUser/register", params, success, faild);
const communityUserMyCollect = (params, success, faild) => http.get(URL + "/communityUser/my_collect.do", params, success, faild);
const checkFollow = (params, success, faild) => http.get(URL + "/communityFollow/checkFollow", params, success, faild);
const postItemNum = (params, success, faild) => http.post(URL + "/postItem/add_collect_num.do", params, success, faild);
const communityUserMyPostItem = (params, success, faild) => http.get(URL + "/communityUser/my_post_item.do", params, success, faild);
const personalCenterPanel = (params, success, faild) => http.post(URL + "/communityUser/personalCenterPanel.do", params, success, faild);
const suggestSearch = (params, success, faild) => http.get(URL + "/post/suggest_search.do", params, success, faild);
const communityUserUpdate = (params, success, faild) => http.post(URL + "/communityUser/update", params, success, faild);
const communityFollowDelete = (params, success, faild) => http.post(URL + "/communityFollow/delete", params, success, faild);
const communityUserCollectDelete = (params, success, faild) => http.post(URL + "/communityUser/my_collect_delete.do", params, success, faild);
const communityUserDelete = (params, success, faild) => http.post(URL + "/communityUser/my_delete.do", params, success, faild);
const messageCount = (params, success, faild) => http.post(URL + "/communityMessage/messageCount", params, success, faild);
const communityMessageCheck = (params, success, faild) => http.post(URL + "/communityMessage/checked", params, success, faild);
const communityMessagecheckAll = (params, success, faild) => http.post(URL + "/communityMessage/checkAll", params, success, faild);
const communityUser_Login = (params, success, faild) => http.post(URL + "/communityUser/userLogin", params, success, faild);
const find_is_collect = (params, success, faild) => http.post(URL + "/postItem/find_is_collect.do", params, success, faild);
const msg_sec_check = (params, success, faild) => http.get(URL + "/postItem/msg_sec_check.do", params, success, faild);
const collect_delete = (params, success, faild) => http.post(URL + "/postItem/collect_delete.do", params, success, faild);
const cancelFollow = (params, success, faild) => http.post(URL + "/communityFollow/cancelFollow", params, success, faild);
const personalComment = (params, success, faild) => http.get(URL + "/communityComment/myComment", params, success, faild);
const personalPost = (params, success, faild) => http.get(URL + "/communityUser/my_post_item.do", params, success, faild);
const personalUserInfo = (params, success, faild) => http.post(URL + "/communityUser/getUserInfo", params, success, faild);
const homeConfig = (params, success, faild) => http.post(URL + "/CommunityConfig/homeConfig", params, success, faild);
const postItemUpdate = (params, success, faild) => http.post(URL + "/postItem/update.do", params, success, faild);
module.exports = {
  decodeUserInfo:decodeUserInfo, //获取微信用户信息
  chineseList:chineseList,//类目列表
  indexList:indexList,//首页最新列表
  hotList: hotList,//热榜列表
  communityComment: communityComment,//评论列表
  communityCommentinsert: communityCommentinsert,//富文本上传
  publishContent: publishContent,//发布帖子
  publishCategoryItem: publishCategoryItem,//选择帖子类目
  communityCommentSon: communityCommentSon,
  communityCommentSonTwo: communityCommentSonTwo,//二级回答
  commentAndSonlist: commentAndSonlist, //列表方法一级二级评论列表
  contentDetail: contentDetail, //帖子详情
  communityCommentSondetail: communityCommentSondetail,//一级评论详情
  addShareNum: addShareNum,//分享数
  communityFollow: communityFollow,//关注接口
  communityFollowMyFollow: communityFollowMyFollow,//关注列表
  communityList: communityList,//消息列表
  communityUserlogin: communityUserlogin,//登录login
  communityUserregister: communityUserregister,//用户注册
  communityUserMyCollect: communityUserMyCollect,//我的收藏
  checkFollow:checkFollow,//检查是否关注
  postItemNum:postItemNum,//检查是否收藏
  communityMessageCheck: communityMessageCheck,//消息是否已查看
  communityUserMyPostItem: communityUserMyPostItem,//我的帖子
  personalCenterPanel: personalCenterPanel,//个人页面
  suggestSearch: suggestSearch,//智能提示
  communityUserUpdate: communityUserUpdate,//用户修改资料
  communityFollowDelete: communityFollowDelete,//取消关注
  communityUserCollectDelete: communityUserCollectDelete,//删除收藏
  communityUserDelete: communityUserDelete,//删除帖子
  messageCount: messageCount,//未查看消息数量
  communityMessagecheckAll: communityMessagecheckAll,//点击全部已读
  communityUser_Login: communityUser_Login,//登陆注册
  find_is_collect: find_is_collect,//判断是否收藏
  msg_sec_check: msg_sec_check,//帖子校验
  collect_delete: collect_delete,//取消收藏
  cancelFollow: cancelFollow,//取消关注
  personalComment: personalComment,//个人主页评论
  personalPost: personalPost,//个人主页帖子
  personalUserInfo:personalUserInfo,//获取个人主页用户信息
  homeConfig: homeConfig,//首页轮播
  postItemUpdate: postItemUpdate//帖子修改
}
