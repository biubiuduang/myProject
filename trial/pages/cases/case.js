// pages/cases/case.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var id = options.id;
    wx.request({
    // url: getApp().globalData.dateServiceUrl, //仅为示例，并非真实的接口地址
     url: 'https://weixin.liuxuekw.com/index/dataserviceapi',
    method: 'POST',
    data: {
        method: 'getServiceGate',
       
        userid : wx.getStorageSync('userId'),    
        model_name: 'AdmissionApi',
        method_name: 'admissionDetails',
        id : id
    },
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
        that.setData({
            student_info: res.data.result.student_info,
            other : res.data.result.other,
            background :  res.data.result.background,
        }); 
      
    }
    })
  },

})
