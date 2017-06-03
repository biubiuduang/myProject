var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    var that = this;
    console.log(options);
    var markerInfo = wx.getStorageSync('markerInfo');
    this.setData({
      student_id: options.studentID,
      markerHead: markerInfo.headimg
    });
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_contact_success');
    wx.request({
    url: getApp().globalData.dateServiceUrl, //仅为示例，并非真实的接口地址
    method: 'POST',
    data: {
        method: 'getServiceGate',
        student_id: options.studentID,
        consultant_id: options.consultantID,    
        userid : wx.getStorageSync('userId'),    
        model_name: 'TrialApi',
        method_name: 'getInviteStatus',
    },
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {

        that.setData({
            result: res.data.result
          }); 
          console.log(res.data.result);
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


  getMore: function(e) {
      wx.navigateTo({
        url: '../deposit/depositIntro'
      })
  },

  onGoToSelecte : function(e){
      var that = this;
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_select_more');
      console.log(that.data.student_id);
      // wx.setStorage({
      //     key: "selectStatue",
      //     data:1
      // });
        getApp().globalData.selectStatus = 1;
        console.log(getApp().globalData);
        wx.redirectTo({
          url: '../select/selectConsultant?trial_id=' + that.data.student_id
        })
  },

  onFindMarket: function() {
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_contact_marker');
    wx.navigateTo({
      url: '../marker/contactMarker',
    })
  }
})