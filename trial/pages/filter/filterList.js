// pages/filter/filterList.js
Page({
  data:{
    type: 1,
    result: getApp().globalData.infoList,
    index:0,
    leftOnStyle: 'color: #03aaee;background: #f5f4f9;border: 1px solid #f5f4f9;border-left: 2px solid #03aaee;border-top:1px solid #b0b0b0',
    rightOnStyle: 'color: #03aaee;border: 1px solid #03aaee;',
    selectList: [],
    leftListStatus: 'block',
    rightStyle: '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    this.setData({
      type: options.type
    });
    var type = options.type;
    var typeList = ['country', 'degree', 'major', '', 'location', 'grade'];
    var titleList = ['请选择申请国家', '请选择申请学位', '请选择申请专业', '请选择语言成绩', '请选择学校地区', '请选择所在年级'];
    var submitInfo = getApp().globalData.submitInfo;
    var name = typeList[type-1];
    // console.log(submitInfo);
    // console.log(name);
    // console.log(submitInfo[name]);
    if (submitInfo[name]) {
       var selectLeftList = submitInfo[name];//选中的缓存
      //  console.log(selectLeftList);
    }
    
    if(!selectLeftList) selectLeftList = [];
    this.setData({
      selectList: selectLeftList
    });
    var that = this;
    //判断选择类型
    this.setData({
          title: titleList[type - 1]
    });
    if (type == 5) {
      this.setData({
        leftListStatus: 'hide',
        rightStyle: 'new-right-style'
      });
      wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'getServiceGate',
          region_pid: '000000',
          model_name: 'CommonApi',
          method_name: 'getRegainList',

        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          result = [];
          result.push({
            infoList: res.data.result
          });
          that.setData({
            result: result
          }); 
          console.log(result);
          //初始化样式列表
           var listInfo = res.data.result;
          // console.log(listInfo);
          // console.log(selectLeftList);
          var styleNameLeft = [];
          for(var i=0; i<res.data.result.length; i++) {
            if(i == 0) {
              styleNameLeft.push(that.data.leftOnStyle);
            } else {
              styleNameLeft.push('color:#6b6d6e');
            }
          }
          var styleNameRight = [];
          for(var i=0; i<listInfo.length; i++) {
            // console.log(listInfo[i].areaname);
            if(selectLeftList.indexOf(listInfo[i].areaname) >= 0) {
              styleNameRight.push(that.data.rightOnStyle);
            } else {
              styleNameRight.push('color:#6b6d6e');
            }
          }

            that.setData({
              styleLeft: styleNameLeft,
              styleRight: styleNameRight
            }); 
        }
      });
    } else {
      wx.request({
        url: getApp().globalData.dateServiceUrl,
        data: {
          method: 'baseInfo',
          type: type
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          result = res.data.result;
          that.setData({
            result: res.data.result
          }); 
          console.log(res.data.result);
          //初始化样式列表
           var listInfo = res.data.result[0].infoList;
          // console.log(listInfo);
          // console.log(selectLeftList);
          var styleNameLeft = [];
          for(var i=0; i<res.data.result.length; i++) {
            if(i == 0) {
              styleNameLeft.push(that.data.leftOnStyle);
            } else {
              styleNameLeft.push('color:#6b6d6e');
            }
          }
          var styleNameRight = [];
          for(var i=0; i<listInfo.length; i++) {
            // console.log(listInfo[i].areaname);
            if(selectLeftList.indexOf(listInfo[i].areaname) >= 0) {
              styleNameRight.push(that.data.rightOnStyle);
            } else {
              styleNameRight.push('color:#6b6d6e');
            }
          }

            that.setData({
              styleLeft: styleNameLeft,
              styleRight: styleNameRight
            }); 
        }
      });
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

  onLeftTap: function(e) {
    var index = e.target.dataset.id;
    var text = e.target.dataset.text;
    var value = e.target.dataset.value;
    var type = this.data.type;
    var typeList = ['country', 'degree', 'major', '', 'location', 'grade'];
    var selectLeftList = this.data.selectList;//选中的缓存
    
    var selectId = '';
    if(type == 4) {
      getApp().globalData.submitGradeType = text;
      getApp().globalData.submitGradeValueText = value;
    }
    e.target.dataset.style = '';
    var list = this.data.result;
    var listInfo = list[index].infoList;
    
    //左边的列表循环设置样式变量区别不同的类型  
    var styleName = [];
    for(var i=0; i<list.length; i++) {
     
      if(index == i) {
        styleName.push(this.data.leftOnStyle);
      } else {
        styleName.push('color:#6b6d6e');
      }
    }

    //显示右边的选中样式
    var styleNameRight = [];
          for(var i=0; i<listInfo.length; i++) {
            // console.log(listInfo[i].areaname);
            if(selectLeftList.indexOf(listInfo[i].areaname) >= 0) {
              styleNameRight.push(this.data.rightOnStyle);
            } else {
              styleNameRight.push('color:#6b6d6e');
            }
          }
      this.setData({
          styleLeft: styleName,
          styleRight: styleNameRight,
          index: index
      });

  },

  onRightTap: function(e) {
    var type = this.data.type;
    var text = e.target.dataset.text;
    var list = this.data.result;
    var index = this.data.index;
    var targetId = e.target.dataset.id;
    var value = e.target.dataset.value;
    var typeList = ['country', 'degree', 'major', '', 'location', 'grade'];
    var selectLeftList = this.data.selectList;//获取已选的信息
   
    //保存已选的信息
    if(type == 1 || type == 2 || type == 3) {
          if (selectLeftList.indexOf(text) >= 0) {
            for(var i=0; i<selectLeftList.length; i++) {
              if(selectLeftList[i] == text) {
                  selectLeftList.splice(i, 1);
                break;
              }
            }
          } else {
            if(selectLeftList.length < 3) {
               selectLeftList.push(text);
            } else {
              wx.showModal({
                title: '提示',
                content: '最多只能选3个哦！',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    
                  }
                }
              });
              return;
           }
        }
    } else if(type == 5 || type == 6) {
      console.log(selectLeftList);
      if (selectLeftList.length > 0) {
          //去除已选的信息
          if (selectLeftList[0] == text) {
            selectLeftList.splice(0, 1);
            targetId = '';
          } else {
            //更换选中信息
            selectLeftList[0] = text;
          }     
      } else {
          selectLeftList.push(text)
      }
      if (type == 5) {
        this.setData({
          location_id: targetId
        })
      }
    }

    this.setData({
      selectList: selectLeftList
    });

    console.log(selectLeftList);
    
    var listInfo = list[index].infoList;

    //右边的列表切换样式的变化
    var styleName = [];
        for(var i=0; i<listInfo.length; i++) {
            if(selectLeftList.indexOf(listInfo[i].areaname) >= 0) {
              styleName.push(this.data.rightOnStyle);
            } else {
              styleName.push('color:#6b6d6e');
            }
          }
      this.setData({
          styleRight: styleName
      });
  },

  onBack: function(e) {
      var typeList = ['country', 'degree', 'major', '', 'location', 'grade'];
      var type = this.data.type;
      getApp().globalData.submitInfo[typeList[type - 1]] = this.data.selectList;
      if (type == 5) {
        getApp().globalData.submitInfo['location_id'] = this.data.location_id;
      }
      console.log(getApp().globalData.submitInfo);
      // wx.reLaunch({
      //   url: '../index/index'
      // });
      // wx.navigateBack({
      //   delta: 1
      // })
      wx.redirectTo({
        url: '../index/index'
      })
  }
})