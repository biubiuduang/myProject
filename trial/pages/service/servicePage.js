// pages/service/servicePage.js
var app = getApp();
Page({
  data:{
    titleSelect: ['select', '', ''],
    serviceShow: ['block', 'hide', 'hide']
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '服务介绍'
    })
    var that = this;
    //获取屏幕宽度等比例缩放图片(1242X5610)
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
          var windowWidth = res.windowWidth;
          var imgHeight = 5610/(1242/windowWidth);
          console.log(parseInt(imgHeight));
          that.setData({
            imgWidth: windowWidth + 'px',
            imgHeight: imgHeight + 'px'
          });
      }
    })
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

  onTitleClick: function(e) {
    var id = e.currentTarget.dataset.id;
    var titleSelect = [];
    var serviceShow = [];
   
    for (var i=0; i<this.data.titleSelect.length; i++) {
      if (i == id) {
        titleSelect[i] = 'select';
      } else {
        titleSelect[i] = '';
      }
    }

    for (var i=0; i<this.data.serviceShow.length; i++) {
      if (i == id) {
        serviceShow[i] = 'block';
      } else {
        serviceShow[i] = 'hide';
      }
    }
   
    this.setData({
      titleSelect: titleSelect,
      serviceShow: serviceShow
    });
  },
})