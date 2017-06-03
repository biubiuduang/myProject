// pages/choose/choosePage.js
var app = getApp()
Page({
  data:{
    userReason: [
      {name: '1', value: '简单了解下留学方面的信息'},
      {name: '2', value: '想要找到靠谱的留学顾问/机构，但还不着急'},
      {name: '3', value: '想要找到靠谱的留学顾问/机构，比较着急'},
    ],
    regsteReason: [
      {name: '1', value: '今日头条'},
      {name: '2', value: '豆瓣'},
      {name: '3', value: '朋友介绍'},
      {name: '4', value: '朋友圈'},
      {name: '5', value: '公众号搜索'},
      {name: '6', value: '知乎'},
      {name: '8', value: '百度'},
      {name: '7', value: '其他'},
    ],
    hasConsultant: 'hide',
    noConsultant: 'hide',
    register_reason: 0,
    register_source: 0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     
    var trialInfo = getApp().globalData.trialInfo;
    console.log(trialInfo);
    this.setData({
      automatic_count: trialInfo[0].automatic_count,
      recipient_avatar: trialInfo[0].recipient_avatar,
      trial_id: trialInfo[0].trial_id
    });

    if (trialInfo[0].automatic_count == 0) {
      this.setData({
        noConsultant: 'block'
      })
       app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_submt_success_noCon');
    } else {
       this.setData({
        hasConsultant: 'block'
      })
       app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_submt_success_hasCon');
    }
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

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      register_reason: e.detail.value
    })
  },

  radioReason: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      register_source: e.detail.value
    })
  },

  primary: function(e) {
    console.log(this.data);
    if (this.data.register_reason == 0) {
        wx.showModal({
                title: '提示',
                content: '请选择使用留学快问的原因',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    
                  }
                }
              });
          return;
    }

    if (this.data.register_source == 0) {
        wx.showModal({
                title: '提示',
                content: '请选择知道留学快问的途径',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    
                  }
                }
              });
          return;
    }

    var userid = wx.getStorageSync('userId');
    var that = this;
    
    var register_reason = that.data.register_reason;
    var register_source = that.data.register_source;
    console.log(register_reason);
    console.log(register_source);
    console.log(userid);
    
    wx.showToast({
      title: '数据提交中....',
      icon: 'loading',
    })

    wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'getServiceGate',
          model_name: 'MemberApi',
          method_name: 'wxSaveRegisterInfo',
          external_member_id: userid,
          register_reason: register_reason,
          register_source: register_source,
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          wx.hideToast();
          console.log(res);
          wx.redirectTo({
            url: '../select/selectConsultant?trial_id=' + that.data.trial_id
          })
        }
    });
    
  },

  trialAgain: function(e) {
     wx.setStorage({
                key:"studendId",
                data: ''
    })
    wx.redirectTo({
      url: '../index/index'
    })
  }

})