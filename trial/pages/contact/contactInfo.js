// pages/contact/contactInfo.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var mobile = wx.getStorageSync("userMobile");
    var weixin = wx.getStorageSync("userWeixin");
    console.log(mobile);
    console.log(weixin);
    
    this.setData({
      id: options,
      mobile: mobile,
      weixin: weixin
    })
    console.log(this.data.id);
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_contact_page');
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

  primary: function(e) {
     var checkboxValue = this.data.checkboxValue;
     console.log(checkboxValue);
     var mobile =  '';
     if(this.data.mobile) mobile = this.data.mobile;
     var weixin =  '';
     if(this.data.weixin) weixin = this.data.weixin;
     if(!mobile && !weixin){
         wx.showModal({
                title: '留学快问',
                content: '请填写联系方式',
                showCancel: false,
                success: function(res) {
                }
              });
          return;
     } else {
       if (!checkboxValue || checkboxValue.length == 0) {
         wx.showModal({
           title: '留学快问',
           content: '请选择联系方式',
           showCancel: false,
           success: function (res) {

           }
         })
         return;
       }

       for (var i = 0; i < checkboxValue.length; i++) {
         if (checkboxValue[i] == 1) {
           if (!mobile) {
             wx.showModal({
               title: '留学快问',
               content: '请填写电话号码',
               showCancel: false,
               success: function (res) {

               }
             });
             return;
           }
         } else if (checkboxValue[i] == 2) {
           if (!weixin) {
             wx.showModal({
               title: '提示',
               content: '请填写微信',
               showCancel: false,
               success: function (res) {
               }
             });
             return;
           }
         }
       }
     }
     
    //验证手机号mobile
    var mobileStr = /\d{11}/i;
    if (mobile && !mobileStr.test(mobile)) {
        wx.showModal({
            title: '提示',
            content: '请填写正确的电话号码',
            showCancel: false,
            success: function(res) {

            }
        });
        return;
    }
    console.log(mobile);
    var that = this;
    console.log("点击了提交按钮：");
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_contact_button');
    
    //判断选的那种联系类型
    console.log(checkboxValue.indexOf('1'));
    console.log(checkboxValue.indexOf('2'));
    if (checkboxValue.indexOf('1') == -1) {
      mobile = '';
    }
    if (checkboxValue.indexOf('2') == -1) {
      weixin = '';
    }

    var text = '';
    //组装提交信息；
    if (mobile) {
      text = '您的电话：' + mobile + ';';
    }

    if (weixin) {
      text = text + '您的微信：' + weixin;
    }

    wx.showModal({
      title: '请再次确认你提交的信息',
      content: text,
      success: function (res) {
        if (res.confirm) {
           //缓存数据
          if (mobile) {
            wx.setStorage({
              key: 'userMobile',
              data: mobile,
            })
          }
          if (weixin) {
            wx.setStorage({
              key: 'userWeixin',
              data: weixin,
            })
          }

          wx.showToast({
            title: '数据提交中....',
            icon: 'loading',
          });

          wx.request({
            url: getApp().globalData.dateServiceUrl,
            data: {
              method: 'getServiceGate',
              model_name: 'TrialApi',
              method_name: 'confirmConsultant',
              consultant_id: that.data.id.consultantId,
              phone: mobile,
              mobile: mobile,
              phone_radio: mobile ? '尽快随时联系' : '',
              student_id: that.data.id.studentId,
              userid: wx.getStorageSync('userId'),
              weixin: weixin,
              service_scheme: 1,
              service_type: 0,
              weixin_radio: weixin ? '尽快随时联系' : '',
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res);
              wx.hideToast();
              wx.setStorage({
                key: "isCache",
                data: 0
              })
              wx.redirectTo({
                url: '../success/successSettime?consultantID=' + that.data.id.consultantId + '&studentID=' + that.data.id.studentId
              })

            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  contactChange : function(e) {
     this.setData({
      checkboxValue: e.detail.value
    })
  },

  mobileContact : function(e) {
     this.setData({
      mobile: e.detail.value
    })
    console.log(this.data.mobile)
    
  },

  wxContact : function(e) {
     this.setData({
      weixin: e.detail.value
    })
     console.log(this.data.weixin)
     
  }
})