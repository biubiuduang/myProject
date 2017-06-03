//app.js
App({
  globalData:{
    userInfo:null,
    dateServiceUrl:'https://weixin.liuxuekw.com/smallapp/index/dataserviceapi',
    // dateServiceUrl:'https://wxtest.liuxuekw.com/smallapp/index/dataserviceapi',
    submitInfo: []
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  getUserInfo:function(cb){
    var that = this
    console.log(this.globalData.userInfo);
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      console.log("2222");
      //调用登录接口
      wx.login({
        success: function (loginres) {
          console.log(loginres);
          //通过code获取openid
          wx.request({
                  url:  getApp().globalData.dateServiceUrl,
                  method: 'POST',
                  data: {
                    method:'userLoginFromTrialSmallApp',
                    code: loginres.code,
                  },
                  header: {
                      'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function(res) {
                    console.log(res.data);
                    if (res.data.success == 't') {
                      getApp().globalData.userId = res.data.result.external_member_id;
                      getApp().globalData.openId = res.data.result.open_id;
                      getApp().globalData.studendId = res.data.result.student_id;

                      wx.setStorage({
                        key: "openId",
                        data: res.data.result.open_id
                      })

                      //授权登陆框打点
                      that.lxkwUserDot(res.data.result.open_id, 'weixin_small_app_trial_login_show');
                      wx.getUserInfo({
                        success: function (res) {
                          console.log(res);
                          that.globalData.userInfo = res.userInfo;
                          typeof cb == "function" && cb(res, loginres);
                          wx.setStorage({
                            key: "userInfo",
                            data: res.userInfo
                          });
                          that.lxkwUserDot(wx.getStorageSync("openId"), 'weixin_small_app_trial_login_agree');
                        },
                        //拒绝授权
                        fail: function (res) {
                          console.log("拒绝授权");
                          //获取用户openid
                          that.lxkwUserDot(wx.getStorageSync("openId"), 'weixin_small_app_trial_login_close');

                          wx.navigateTo({
                            url: '../login/noLogin'
                          });
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '注册失败',
                        icon: 'fail',
                        duration: 2000
                      })
                      setTimeout(function() {
                        wx.navigateTo({
                          url: '../login/noLogin'
                        });
                      },2000);
                      
                    } 
                  }
          });
          //缓存登陆信息
          wx.setStorage({
                key: "loginInfo",
                data:loginres
          });
        }
      })
    }
  },

  lxkwUserDot: function (opendId, dot, additional) {
    //用户打点
    var userid = wx.getStorageSync('userId')?wx.getStorageSync('userId'):'';
      wx.request({
        url:  'https://weixin.liuxuekw.com/index/dataserviceapi',
        method: 'POST',
        data: {
          method:'stat',
          identify_code: dot,
          source: 'smallapp',
          trace_id:  opendId,
          additional: additional?additional:'',
          site_id: 3,
          user_id: userid
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res.data);
        }
      });
  },

  checkUnLogin: function() {
    var userInfo = wx.getStorageSync('userInfo') || '';
    var loginInfo = wx.getStorageSync('loginInfo') || '';
    if (loginInfo) {
      if (!userInfo) {
        return false;
      } else {
         return true;
      }
    } else {
      return true;//第一次出现
    }
  }
})