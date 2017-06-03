// pages/login/noLogin.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(this.autoImg(640, 1419));
    var imgInfo = this.autoImg(640, 1419);
    this.setData({
      imgWidth: imgInfo.imgWidth,
      imgHeight: imgInfo.imgHeight
    });
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_show_login');
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  //图片宽度自适应方法
  autoImg: function(width, height) {
     var imgInfo = {};
      wx.getSystemInfo({
        success: function(res) {
          console.log(res);
          var imgWidth = res.windowWidth;
          var imgHeight = parseInt(height/(imgWidth/imgWidth));
          imgInfo = {
            imgWidth: imgWidth + 'px',
            imgHeight: imgHeight + 'px'
          }
        }
    })
    return imgInfo;
  }
})