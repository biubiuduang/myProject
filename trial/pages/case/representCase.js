var app = getApp();
Page({
   data: {},
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
        data_type : 'array',
        userid : wx.getStorageSync('userId'),    
        model_name: 'AdmissionApi',
        method_name: 'admissionDetails',
        id : id
    },
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
        
        var video = res.data.result.endorsement.video;
        var action = [];
        var videoShow = "hide";
        if(video){
            for(var i = 0;i<video.length;i++){
                 if(i == 0){
                 video[i].play = 1
            }else{
                video[i].play = 0
                }
            }
            if(video.length > 1){
                videoShow = ""
            }
        }
        var audio = res.data.result.endorsement.audio;
        if(audio){
            for(var i = 0;i<audio.len;i++){
                action.push({method: 'pause'})
            }
        }
        var imagesShow = "hide";
        var imageShow = ""
        if(res.data.result.endorsement.img){
            if(res.data.result.endorsement.img.length > 1){
                imagesShow = ""
                imageShow = "hide"
            }
       }
        console.log(res.data.result)
         that.setData({
            cover_img : res.data.result.cover_img,
            endorsement :  res.data.result.endorsement,
            video : video,
            action : action,
            result : res.data.result ,
            videoShow:videoShow,
            fullVideo:'',
            imageShow:imageShow,
            imagesShow:imagesShow
        }); 
      
    }
    })
  },

  videoPlay : function(e){
      var src = e.target.dataset.src
      var index = e.target.dataset.i
      var video = this.data.video
      for(var i = 0;i<video.length;i++){
            if(i == index){
                video[i].play = 1
            }else{
                video[i].play = 0
            }
        }
      this.setData({
            video : video,
            videoSrc : src
      }); 
  },

  offerVideo : function(e){
      var fullVideo = e.currentTarget.dataset.src
      console.log(fullVideo)
      this.setData({
            fullVideo : fullVideo,
      }); 
  },
  
  cancelVideo  : function(e){
      this.setData({
            fullVideo : '',
      }); 
  },

  bindend:function(){//视频播放结束按钮函数
      this.setData({
            fullVideo : '',
      }); 
    },

 bindplay:function(e){//语音播放结束按钮函数
      var index = e.target.dataset.i
      var action = this.data.action
      var len = this.data.endorsement.audio.length;
        for(var i = 0;i<len;i++){
            if(i == index){
               action[i] = {method: 'play'}
            }else{
                 action[i] = {method: 'pause'}
            }
        }
        console.log(action);
      this.setData({
            action : action,
      }); 
 },   

  fullScreenImages :  function(e){
      var images = [];
      for(var i=0;i<this.data.endorsement.img.length;i++){
            images.push(this.data.endorsement.img[i]['file_url']);
      }
      wx.previewImage({
         current: e.target.dataset.src, 
         urls: images
        })
  },

  offerImg: function(e){
      var images = [];
      for(var i=0;i<this.data.result.admission.length;i++){
            images.push(this.data.result.admission[i]['file_url']);
      }
      wx.previewImage({
         current: e.target.dataset.src, 
         urls: images
        })
  },
})

