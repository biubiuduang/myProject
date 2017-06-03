// pages/consultant/consultantDetail.js
var app = getApp();
Page({
  data:{
    consultantTab: ['active', '', ''],
    consultantShow: ['block', 'hide', 'hide'],
    caseSelect: ['select', '', ''],
    caseShow: ['block', 'hide', 'hide'],
    tabType: 0,
    page:1
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
     wx.setNavigationBarTitle({
      title: '顾问详情'
     })
    wx.showToast({
      title: '加载中.....',
      icon: 'loading',
    })
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var consulatntId = options.id;
    var caseType = options.case?options.case:'';//判断是否为查看顾问案例
    if (caseType) {
      this.setData({
        consultantTab: ['', 'active', ''],
        consultantShow: ['hide', 'block', 'hide'],
      })
    }
    console.log(options);
    console.log(consulatntId);
    // var consulatntId = 'M0000000003895';
    app.lxkwUserDot(wx.getStorageSync('openId'), 'weixin_small_app_trial_consultant', consulatntId);
    //获取顾问信息
    this.setData({
      consulatntId: consulatntId
    });
    wx.request({
        url: 'https://weixin.liuxuekw.com/index/dataserviceapi',
        data: {
          method: 'getConsultantInfo',
          userid: consulatntId
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          wx.hideToast();
          console.log(res);
          var consultantBaseinfo = res.data.result.consultant_baseinfo;
          var baseinfoContry = [];
          var baseinfoDegree = [];
          var baseinfoMajor = [];
          //处理顾问擅长信息
          for (var i=0; i<consultantBaseinfo.length; i++) {
            if (i == 0) {
                for(var j=0; j<consultantBaseinfo[i].length; j++) {
                  baseinfoContry.push(consultantBaseinfo[i][j].baseinfo_name);
                }
            } else if (i == 1) {
                for(var j=0; j<consultantBaseinfo[i].length; j++) {
                  baseinfoDegree.push(consultantBaseinfo[i][j].baseinfo_name);
                }
            } else if (i == 2) {
                for(var j=0; j<consultantBaseinfo[i].length; j++) {
                  baseinfoMajor.push(consultantBaseinfo[i][j].baseinfo_name);
                }
            }
          }
          //生成履历列表图片接
          var recordMages = [];
          var record_images = res.data.result.record_images
          for (var i=0; i<record_images.length; i++) {
            recordMages.push(record_images[i].file_url);
          }
          console.log(res.data.result.descr);
          that.setData({
            consultantInfo: res.data.result,
            gondAtContry: baseinfoContry.join(','),
            gondAtDegree: baseinfoDegree.join(','),
            gondAtMajor: baseinfoMajor.join(','),
            recordMages: recordMages
          });

          console.log(that.data.consultantInfo);
          console.log(that.data);
        }
    });

    //获取案例信息
    wx.request({
        url: 'https://weixin.liuxuekw.com/index/dataserviceapi',
        data: {
          method: 'getServiceGate',
          method_name: 'getAdmissionByConsultant',
          model_name: 'ConsultantApi',
          consultant_id: consulatntId,
          data_type: 'array'
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          that.setData({
            caseList: res.data.result
          });
        }
    });

     //获取评分信息
    wx.request({
        url: 'https://weixin.liuxuekw.com/index/dataserviceapi',
        data: {
          method: 'getServiceGate',
          method_name: 'getSchemeListByConsultant',
          model_name: 'SchemeApi',
          consultant_id: consulatntId,
          type: 1,
          pagesize:10,
          is_similar: 0,
          type_id: 999,
          page: that.data.page
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          that.setData({
            consulatntGrade: res.data,
            gradeList: res.data.result
          });
        }
    });
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
  //顾问信息切换
   onConsultantTab: function(e) {
    var id = e.currentTarget.dataset.id;
    var consultantTab = [];
    var consultantShow = [];
   
    for (var i=0; i<this.data.consultantTab.length; i++) {
      if (i == id) {
        consultantTab[i] = 'active';
      } else {
        consultantTab[i] = '';
      }
    }

    for (var i=0; i<this.data.consultantShow.length; i++) {
      if (i == id) {
        consultantShow[i] = 'block';
      } else {
        consultantShow[i] = 'hide';
      }
    }
   
    this.setData({
      consultantTab: consultantTab,
      consultantShow: consultantShow,
      tabType: id,
    });
  },

  //顾问案例切换
  onCaseClick: function(e) {
    var id = e.currentTarget.dataset.id;
    var caseSelect = [];
    var caseShow = [];
   
    for (var i=0; i<this.data.caseSelect.length; i++) {
      if (i == id) {
        caseSelect[i] = 'select';
      } else {
        caseSelect[i] = '';
      }
    }

    for (var i=0; i<this.data.caseShow.length; i++) {
      if (i == id) {
        caseShow[i] = 'block';
      } else {
        caseShow[i] = 'hide';
      }
    }
   
    this.setData({
      caseSelect: caseSelect,
      caseShow: caseShow
    });
  },

  onServiceClick: function() {
    wx.navigateTo({
      url: '../service/servicePage'
    })
  },

  //点击看大图
  onHeadClick: function(e) {
    var urls = [];
    var src = e.currentTarget.dataset.id;
    console.log(src);
    urls.push(src);

    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  onRecordClick: function(e) {
    var urls = this.data.recordMages;
    var src = e.currentTarget.dataset.id;
    console.log(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  onCaseDetail: function(e) {
    var caseid = e.currentTarget.dataset.id;
    console.log(caseid);
    var that = this;
    wx.navigateTo({
      url: '../case/representCase?id=' + caseid + '&consultantid=' + that.data.consultantId
    })
  },

  onCaseDetail2: function(e) {
    var caseid = e.currentTarget.dataset.id;
    console.log(caseid);
    var that = this;
    wx.navigateTo({
      url: '../cases/case?id=' + caseid
    })
  },
  //用户下拉刷新
  onReachBottom: function () {
    if (this.data.tabType == 2) {
       wx.showLoading({
        title: '加载中',
      })
      var page = this.data.page;
      page = page + 1;
      this.setData({
        page: page
      });
     
      var that = this;
      wx.request({
        url: 'https://weixin.liuxuekw.com/index/dataserviceapi',
        data: {
          method: 'getServiceGate',
          method_name: 'getSchemeListByConsultant',
          model_name: 'SchemeApi',
          consultant_id: that.data.consulatntId,
          type: 1,
          pagesize:10,
          is_similar: 0,
          type_id: 999,
          page: page
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          wx.hideLoading();
          // console.log(res);
          var gradeList = that.data.consulatntGrade.result;
          // console.log(res.data.result);
          for (var i=0; i< res.data.result.length; i++) {
              gradeList.push(res.data.result[i]);
          }
          // console.log(gradeList);
          that.setData({
            gradeList: gradeList
          });
        }
    });
    }
  },

  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  }
})