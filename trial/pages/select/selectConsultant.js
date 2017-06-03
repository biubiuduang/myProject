// pages/select/selectConsultant.js
var app = getApp();
Page({
  data:{
    selectList: [
      {name: '2', value: '按吻合度排序', text: '根据顾问对您申请目标的擅长程度来排序'},
      {name: '3', value: '按评价排序', text: '根据学生对顾问的评价进行排序'},
       {name: '1', value: '按案例数排序', text: '根据案例的数量进行排序'},
      {name: '4', value: '按响应速度排序', text: '在您选择顾问后，该顾问联系您的速度'},
    ],
    selectName: ['', 'verify_sort', 'total_match', 'current_grade', 'response_percent'],//排序的字段；
    bgStatus: 'hide',//
    marketStatus: 'block',//小管家弹窗
    selectStatus: 'hide',//选排序弹窗
    downListStatus: 'hide',//下拉筛选窗
    type:0,//学生弹窗选择排序方式
    tips: 'hide',
    userid:  wx.getStorageSync('userId'),
    downListStyle: ['', '', '', '', 'select'],//下拉列表选中样式
    memberSortBottom: ['', 'hide', 'hide', 'hide', 'hide'], //列表的类型
    selectTypeStyle: ['select', ''],//是否已选的样式
    selectType:0,//是否已选的类型
    onIsDeposite: 0,//是否选了保证金
    memberSort:2,
    initRankText: '按吻合度排序'
  },

  onShareAppMessage: function () {
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_share');
    return {
      title: '留学快问免费试用',
      desc: '留学快问中立第三方留学平台。优选留学机构和独立顾问入驻，帮你找到靠谱的留学服务。',
      path: 'pages/index/index'
    }
  },

  onLoad:function(options){
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    //判断是否需要加载数据
    var isCache = wx.getStorageSync("isCache");
    console.log(isCache);
    if (isCache == 1) {
      wx.setStorage({
        key: 'isCache',
        data: 0,
      })
      return;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });

    //获取缓存里的数据
    var trialId = wx.getStorageSync('studendId');
    console.log(trialId);
    this.setData({
      trialId: trialId
    });
    var that = this;
    //获取学生试用信息
    wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'getServiceGate',
          model_name: 'MemberApi',
          method_name: 'getWxStudentInfo',
          external_member_id: wx.getStorageSync('userId'),
          student_id: that.data.trialId,
          usertype: '1' ,
          data_type: 'array'
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          
          that.setData({
            data: res.data,
            memberSort: res.data.result.member_sort==0?2:res.data.result.member_sort,
            consultantList: res.data.consultant,
            initConsultantList: res.data.consultant,
          })

          wx.setStorage({
            key: 'markerInfo',
            data: res.data.market_info,
          })
          
          //判断是否要显示小管家
          if (res.data.info.tips == 1) {
            that.setData({
              bgStatus: 'block'
            })

             app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_menbang');
          }

          //初始化默认排序
          that.filterConsultant();
        }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  /*事件*/
  radioChange: function(e) {
    this.setData({
      sortType: e.detail.value
    })
    console.log(this.data);
  },

  know: function(e) {
    this.setData({
      marketStatus: 'hide',
      selectStatus: 'block',
    })
  },
  
  save: function(e) {
    var type = this.data.type;

    var that = this;
    console.log(type);
    if (type == 0) {
      this.setData({
        tips:'block'
      });
    } else {
      console.log(that.data.userid);
      console.log(that.data.type);
      console.log(that.data.trialId);
      console.log(getApp().globalData.dateServiceCrmUrl);
      wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'getServiceGate',
          model_name: 'MemberApi',
          method_name: 'saveMemberSortByStudent',
          // external_member_id: that.data.userid,
          student_id: that.data.trialId,
          member_sort: that.data.type,
          userid: that.data.userid,
          
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          that.setData({
            selectStatus: 'hide',
            bgStatus: 'hide'
          });

          that.filterConsultant(that.data.type);
        }
    });
    
    if (type == 1) {
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_menbang_paixu_case');
    } else if (type == 2) {
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_menbang_paixu_wenhe');
    } else if (type == 3) {
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_menbang_paixu_grade');
    } else if (type == 4) {
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_menbang_paixu_respon');
    }
  }
  },

  //保存弹窗选中的排序类型
  radioChange: function(e) {
    var type = e.detail.value;
    console.log(type);
    this.setData({
      type: type,
    })

    if (type != 0) {
      this.setData({
        tips:'hide'
      });
      
    }
  },

  onToptab: function(e) {
    var status = this.data.downListStatus;
    if (status == 'hide') {
      this.setData({
        downListStatus: 'block',
      });
    } else {
      this.setData({
        downListStatus: 'hide',
      });
    }
  },

  onBgClick: function(e) {
    this.setData({
        downListStatus: 'hide',
      });
  },

  //选顾问
  onSelectButton: function(e) {
      var consultantId = e.target.dataset.id;
      var studentId = this.data.trialId;
      console.log(this.data);
      var count = this.data.data.info.trial_remain_count;
      console.log(count);
      //判断是否还有选顾问名额
      if (count == 0) {
        wx.showModal({
          title: '留学快问',
          content: '您已用完所有选顾问名额，如需帮助请联系小管家',
          success: function(res) {
            if (res.confirm) {
              wx.setStorage({
                key: "isCache",
                data: 1
              })
              wx.navigateTo({
                url: '../marker/contactMarker',
              })
            } else if (res.cancel) {
              
            }
          }
        })
        return;
      }
      wx.setStorage({
        key: "isCache",
        data: 1
      })
      app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_consultant_select', consultantId);
      if (app.globalData.selectStatus) {
        wx.redirectTo({
          url: '../contact/contactInfo?consultantId=' + consultantId + '&studentId=' +  studentId
        })
      } else {
        wx.navigateTo({
          url: '../contact/contactInfo?consultantId=' + consultantId + '&studentId=' +  studentId
        })
      }
  },

  submitAgain: function(e) {
    wx.showModal({
      title: '提示',
      content: '重新提交试用后，系统将删除你以前提交的试用',
      success: function(res) {
        if (res.confirm) {
           app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_resubmit');
           
            wx.setStorage({
                key:"studendId",
                data: ''
            })
            getApp().globalData.selectStatus = '';
            wx.redirectTo({
              url: '../index/index'
            })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  filterType: function(e) {
    var type = e.currentTarget.dataset.id;
    this.filterConsultant(type);
    this.setData({
      memberSort: type
    })
  },

  selectTypeClick: function(e) {
    var id = e.currentTarget.dataset.id;
    var selectTypeStyle = this.data.selectTypeStyle;
    console.log(id);
    for(var i=0; i<selectTypeStyle.length; i++) {
      if (i == id) {
        selectTypeStyle[i] = 'select';
      } else {
        selectTypeStyle[i] = ' ';
      }
    }

    this.setData({
        selectTypeStyle:selectTypeStyle,
        selectType: id
    })
    this.filterConsultant();
  },

  onIsDeposite: function(e) {
    if (this.data.onIsDeposite == 0){
        this.setData({
          onIsDeposite: 1
        });
    } else {
        this.setData({
          onIsDeposite: 0
        });
    }
    console.log(this.data.onIsDeposite);
    this.filterConsultant();
  },

  //排序方法
  filterConsultant: function(type) {
    wx.showToast({
      title: '加载中.....',
      icon: 'loading',
    })

    if (!type) var type = this.data.memberSort;
    var downListStyle = this.data.downListStyle;
    var memberSortBottom = this.data.memberSortBottom;
    var consultant = this.data.initConsultantList;
    var isSelect = this.data.selectType;
    var onIsDeposite = this.data.onIsDeposite;
    console.log(type);
    //改变下拉框选择的样式
    for(var i=0; i<downListStyle.length; i++) {
      if (i == type) {
        downListStyle[i] = 'select';
      } else {
        downListStyle[i] = ' ';
      }
    }

     //判断列表块展现的样式
    for(var i=0; i<memberSortBottom.length; i++) {
          if (i == type) {
              memberSortBottom[i] = 'block';
            } else {
              memberSortBottom[i] = 'hide';
            }
    }
          this.setData({
                downListStyle:downListStyle,
                memberSortBottom: memberSortBottom,
                downListStatus: 'hide'
          })

    var selectList = this.data.selectList;
     //初始化默认排序获取默认排序名称
     for (var i=0; i<selectList.length; i++) {
            if (type == selectList[i].name) {
              this.setData({
                initRankText:selectList[i].value
              })
            }
      }

    //顾问列表筛选
    console.log(consultant);
    var list = [];
    var result = [];
    //筛选是否已选
    if (isSelect == 1) {
      for (var i=0; i<consultant.length; i++) {
        if (consultant[i].status > 0) {
          list.push(consultant[i]);
        }
      }
    } else {
      list = consultant;
    }
   
    //筛选是否有保证金
    if (onIsDeposite == 1 && list.length>0) {
      for (var i=0; i<list.length; i++) {
        if (list[i].calc_deposit_amount > 0 || list[i].studio_calc_deposit_amount > 0) {
          result.push(list[i]);
        }
      }
    } else {
      result = list;
    }
   
    //筛选顾问条件
    var name = this.data.selectName[type];
    var sortList = [];
    console.log(name);
    if (type == 1) {
			sortList = result.sort(function(a,b){
                    return parseInt(b[name]) - parseInt(a[name]);
                  });
    } else {
      sortList = result.sort(function(a,b){
                    return parseFloat(b[name]) - parseFloat(a[name]);
                  });
    }
    
    this.setData({
      consultantList: sortList,
    });
    //隐藏弹窗
    setTimeout(function(){
      wx.hideLoading()
    },1000)
    console.log(sortList);
  },

  onConsultantDetial: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.setStorage({
      key: "isCache",
      data: 1
    })
    wx.navigateTo({
      url: '../consultant/consultantDetail?id=' + id
    })
  },

  onConsulatntCase: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.setStorage({
      key: "isCache",
      data: 1
    })
     wx.navigateTo({
      url: '../consultant/consultantDetail?id=' + id + '&case=1'
    })
  },

  onMarkerHead: function (e) {
    wx.setStorage({
      key: "isCache",
      data: 1
    })
    wx.navigateTo({
      url: '../marker/contactMarker',
    })
  }
})