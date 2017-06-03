//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    timeArray: ['2017', '2018', '2019', '2020', '2021'],
    index: 1,
    lock: 0
  },
  onShareAppMessage: function () {
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_share');
    return {
      title: '留学快问免费试用',
      desc: '留学快问中立第三方留学平台。优选留学机构和独立顾问入驻，帮你找到靠谱的留学服务。',
      path: 'pages/index/index'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var studentId = wx.getStorageSync('studendId');
    var automaticCount = wx.getStorageSync('automaticCount');
    console.log(studentId);
    if (studentId) {
      // wx.reLaunch({
      //   url: '../select/selectConsultant?trial_id=' + studentId
      // })
      console.log("有试用ID");
        wx.redirectTo({
          url: '../select/selectConsultant?trial_id=' + studentId
        })
      
    }
    
    var that = this
    var user = wx.getStorageSync('userInfo') || '';
    var loginInfo = wx.getStorageSync('loginInfo') || '';
    console.log(loginInfo);

    //判断是否为没授权登陆
    var status = app.checkUnLogin();
    console.log(status);
    if (!status) {
        wx.navigateTo({
          url: '../login/noLogin'
        });
        return;
    }

    //判断是否已经登陆了
    if(!user) {
      //调用登陆接口获取opdenid

        app.getUserInfo(function(res, loginres){
                //更新数据
                console.log(res);
                if(loginres) var code = loginres.code;
                var userInfo = res.userInfo;
                console.log(code);
                console.log(userInfo);

                //发送分享者id和获取用户的id
                wx.request({
                  url:  getApp().globalData.dateServiceUrl,
                  method: 'POST',
                  data: {
                    method:'userLoginFromTrialSmallApp',
                    code: code,
                    avatar: userInfo.avatarUrl,
                    city: userInfo.city,
                    country: userInfo.country,
                    gender: userInfo.gender,
                    nickname: userInfo.nickName,
                    province: userInfo.province,
                    openid: wx.getStorageSync('openId'),
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  header: {
                      'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function(res) {
                    console.log(res);
                    console.log(res.data.result.external_member_id);
                    console.log("无缓存");
                    if (res.data.success == 't') {
                      //判断是否有返回userId
                      if (res.data.result.external_member_id) {
                        wx.setStorage({
                          key: "userId",
                          data: res.data.result.external_member_id
                        });

                        wx.setStorage({
                          key: "studendId",
                          data: res.data.result.student_id
                        })

                        //判断是否存在试用；
                        if (res.data.result.student_id) {
                          // wx.reLaunch({
                          //   url: '../select/selectConsultant?trial_id=' + res.data.result.student_id
                          // })
                          wx.redirectTo({
                            url: '../select/selectConsultant?trial_id=' + res.data.result.student_id
                          })
                        }
                      } else {
                        wx.showToast({
                          title: '注册失败',
                          icon: 'fail',
                          duration: 2000
                        })
                        wx.setStorage({
                          key: "userInfo",
                          data: ''
                        });

                        setTimeout(function () {
                          wx.navigateTo({
                            url: '../login/noLogin'
                          });
                        }, 2000);
                      }
                    } else {
                      wx.showToast({
                        title: '注册失败',
                        icon: 'fail',
                        duration: 2000
                      })

                      setTimeout(function () {
                        wx.navigateTo({
                          url: '../login/noLogin'
                        });
                      }, 2000);
                    }

                    app.lxkwUserDot(res.data.result.open_id, 'weixin_small_app_trial_page');

                  }
                });
            });
      } else {
        console.log("有缓存");
        //用户打点
         app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_page');
      }

    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // });
    console.log(getApp().globalData.submitInfo);
    //初始化已选信息
    var apply_country = getApp().globalData.submitInfo['country']?getApp().globalData.submitInfo['country'].join(','):'';
    var apply_degree = getApp().globalData.submitInfo['degree']?getApp().globalData.submitInfo['degree'].join(','):'';
    var apply_major = getApp().globalData.submitInfo['major']?getApp().globalData.submitInfo['major'].join(','):'';
    var location = getApp().globalData.submitInfo['location'];
    var grade = getApp().globalData.submitInfo['grade'];
    if (getApp().globalData.submitInfo['apply_year']) {
      this.setData({
        index: this.data.timeArray.indexOf(getApp().globalData.submitInfo['apply_year'])
      })
    } else {
       getApp().globalData.submitInfo['apply_year'] = this.data.timeArray[1];
    }
    this.setData({
      apply_country: apply_country,
      apply_degree: apply_degree,
      apply_major: apply_major,
      location: location,
      grade: grade,
      name: getApp().globalData.submitInfo['student_name'],
      apply_year: getApp().globalData.submitInfo['apply_year'],
      major: getApp().globalData.submitInfo['student_major'],
      college: getApp().globalData.submitInfo['student_school'],
    })

    console.log("this.data:" + this.data);
    
  },

  //选择事件
  onItemClick: function(e) {
     var type = e.currentTarget.dataset.type;
     console.log(type);
    //  wx.navigateTo({
    //   url: '../filter/filterList?type=' + type
    // })

    wx.redirectTo({
      url: '../filter/filterList?type=' + type
    })

    // wx.redirectTo({
    //     url: '../filter/filterList?type=' + type
    //   });
  },

  bindInputName: function(e) {
     getApp().globalData.submitInfo['student_name'] = e.detail.value;
  },

  bindInputSchool: function(e) {
     getApp().globalData.submitInfo['student_school'] = e.detail.value;
  },

  bindInputMajor: function(e) {
     getApp().globalData.submitInfo['student_major'] = e.detail.value;
  },

  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    getApp().globalData.submitInfo['apply_year'] = this.data.timeArray[e.detail.value];
  },

   primary: function(e) {
    //先判断有没有登陆
    var status = app.checkUnLogin();
    console.log(status);
    if (!status) {
        wx.navigateTo({
          url: '../login/noLogin'
        });
        return false;
    }
    var lock = this.data.lock;
    if (lock == 1) {
      console.log('已锁');
      return;
    }
     var name = getApp().globalData.submitInfo['student_name'];
     var apply_year = this.data.apply_year;
     var apply_country = this.data.apply_country;
     var apply_major = this.data.apply_major;
     var apply_degree = this.data.apply_degree;
     var grade = getApp().globalData.submitInfo['grade'];
     var college = getApp().globalData.submitInfo['student_school'];
     var major = getApp().globalData.submitInfo['student_major'];
     var location = getApp().globalData.submitInfo['location'];
     var location_id = getApp().globalData.submitInfo['location_id'];
     var text = [name,apply_country,apply_degree,apply_major,apply_year,location,college,major,grade];
     var text_name = ['昵称','意向国家','申请学位','申请专业','出国时间','学校地区','就读学校','就读专业','所在年级'];
     var tips = '';
     var userid = wx.getStorageSync('userId');
    
    console.log(text);
    console.log("user_id:" + userid);
    for(var i=0; i<text.length; i++) {
        if (!text[i]) {
          wx.showModal({
                title: '提示',
                content: '请填写' + text_name[i],
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    
                  }
                }
              });
          return;
        }
    }
     app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_button');
      wx.showToast({
        title: '数据提交中....',
        icon: 'loading',
      });
    this.setData({
      lock: 1
    })
    var that = this;
    wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'getServiceGate',
          model_name: 'MemberApi',
          method_name: 'wxCreate',
          name: name, 
          apply_year :apply_year,
          location:location,
          location_id:location_id,
          apply_major:apply_major,
          apply_country :apply_country,
          apply_degree :apply_degree,
          grade:grade,
          college:college,
          major:major,
          userid: userid,
          external_member_id: userid,
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          that.setData({
            lock: 0
          })
          wx.hideToast();
          console.log(res);
          if (res.data.success == 't') {
            getApp().globalData.trialInfo = [];
            getApp().globalData.trialInfo.push({
              automatic_count: res.data.automatic_count,
              recipient_avatar: res.data.params.recipient_avatar,
              trial_id: res.data.result,
            });
            //缓存试用ID
            wx.setStorage({
                key:"studendId",
                data: res.data.result
            })
            //缓存自动匹配到的老师个数
            wx.setStorage({
                key:"automaticCount",
                data: res.data.automatic_count
            })
            console.log(getApp().globalData.trialInfo);
            //没有匹配到顾问跳去小管家提示页
            if (res.data.automatic_count == 0) {
              wx.redirectTo({
                url: '../choose/choosePage'
              })
            } else {
              //判断是否有保存来源信息
              if (res.data.is_register_info == 0) {
                wx.redirectTo({
                  url: '../choose/choosePage'
                })
              } else {
                wx.redirectTo({
                  url: '../select/selectConsultant?trial_id=' + res.data.result
                })
              }
            }
            
          } else {
               wx.showModal({
                title: '提示',
                content: res.data.error_msg,
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    
                  }
                }
              });
          }
          
        }
    });

    
  },
})
