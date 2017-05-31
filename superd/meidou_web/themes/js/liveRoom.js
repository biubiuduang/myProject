/**
 * Created by Jacky.Wang on 2017/3/16.
 */

//function

//左侧主播列表
var leftList = {
    init : function(){
        var that = this;
        that.getLeftList();
    },
    getLeftList : function(){
        $.ajax({
            url : sd_index.url + "pub/hot",
            type : "get",
            //xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success : function(data){
                var len = data.data.length;
                if(len > 6){
                    len = 6;
                }
                for(var i = 0 ; i < len ; i ++ ){
                    if(data.data[i].room.layout == 0){
                        room.leftListHtml += '<li>'+
                                                '<a href="liveRoom.html?performerId='+ data.data[i].userId +'&roomType='+ data.data[i].room.roomType +'&i='+ i +'"><img src='+ (data.data[i].room.coverUrl).replace("http:","https:") +' alt=""></a>'+
                                                '<p class="alt"><span>'+ data.data[i].nickName +'</span></p>'+
                                            '</li>';
                        room.randomId = data.data[i].userId;
                        $(".random").attr("href","liveRoom.html?performerId="+data.data[i].room.roomId +"&roomType=" + data.data[i].room.roomType+"&i="+i);
                    }

                }

                $("#onAir").html(room.leftListHtml);
            }
        });

        alt("#onAir","li",".alt");
    }
};
//中间部分及直播间信息
var centerInfo = {
    init : function(){
        var that = this;
        that.getLiveData();
        that.sendMsgEvent();
        that.giftListAni();
        //that.testGifts();
    },
    //获取左侧贡献榜列表
    getLeftLiveList : function() {
        var that = this;
        if(room.roomType == 3){
            $.ajax({
                url: sd_index.url+"pub/room/board?performerId=" + room.performerId + "&sceneId=" + room.sceneId,
                type: "get",
                //xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success: function (data) {
                    room.contriListHtml = "";
                    var len = data.data.length;
                    if (len > 8) {
                        len = 8;
                    }
                    for (var i = 0; i < len; i++) {
                        room.contriListHtml += '<li>' +
                            '<div class="level-icon">' + (i+1) + '</div>' +
                            '<img src=' + data.data[i].user.avatarUrl + ' alt=' + data.data[i].user.nickName + ' />' +
                            '<p class="iconfont nick-name" data-gender=' + +' title=' + data.data[i].user.nickName + '>' + data.data[i].user.nickName + '</p>' +
                            '<p class="contri-val">魅力值 <span>' + data.data[i].pointSent + '</span></p>' +
                            '</li>'
                    }

                    $(".contri-list").html(room.contriListHtml);
                }
            });
        }
        if(room.roomType == 9){
            $.ajax({
                url: sd_index.url+"pub/board?performerId=" + room.performerId,
                type: "get",
                //xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success: function (data) {
                    room.contriListHtml = "";
                    var len = data.data.length;
                    if (len > 8) {
                        len = 8;
                    }
                    for (var i = 0; i < len; i++) {
                        room.contriListHtml += '<li>' +
                            '<div class="level-icon">' + (i+1) + '</div>' +
                            '<img src=' + data.data[i].user.avatarUrl + ' alt=' + data.data[i].user.nickName + ' />' +
                            '<p class="iconfont nick-name" data-gender=' + +' title=' + data.data[i].user.nickName + '>' + data.data[i].user.nickName + '</p>' +
                            '<p class="contri-val">魅力值 <span>' + data.data[i].pointSent + '</span></p>' +
                            '</li>'
                    }

                    $(".contri-list").html(room.contriListHtml);
                }
            });
        }

        setInterval(that.getLeftLiveList,10000);
    },
    //video以及主播信息
    getLiveData : function(){
        var that = this;
        if(room.roomType == 3){
            $.ajax({
                url: sd_index.url+"pub/live?performerId=" + room.performerId + "&members=1",
                type: "get",
                //xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success: function (data) {
                    if(data.rtn == 0){
                        //video
                        var player =  new TcPlayer('mdVideo', {
                            "m3u8": (data.data.room.playUrl.hls).replace('http:','https:'),
                            "flv": (data.data.room.playUrl.flv).replace('http:','https:'), //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
                            "autoplay" : true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                            //"coverpic" : (data.data.room.coverUrl).replace("http:","https:"),
                            "width" :  '400',//视频的显示宽度，请尽量使用视频分辨率宽度
                            "height" : '711'//视频的显示高度，请尽量使用视频分辨率高度
                        });
                        room.sceneId = data.data.sceneId;
                        that.getLeftLiveList();

                        var lvTop = Math.floor(data.data.performer.level/10);
                        //$("#memberCountOffset").html(data.data.room.currentMembers+"人");
                        $("#nickName").html(data.data.performer.nickName).attr("title",data.data.performer.nickName);
                        $("#anchorLv").html(data.data.performer.level).css({"background-position":"0 "+ -22*lvTop +"px"});
                        $("#anchorId").html("ID："+data.data.performer.userId);
                        var roomTitle = data.data.room.title;
                        $("#anchorSl").html(roomTitle);
                        $("#memberCountOffset").html(data.data.members.count+"人");

                        $("#anchorCover").attr({"src":(data.data.room.coverUrl).replace("http:","https:"),"alt":data.data.performer.nickName});
                    }else{
                        $(".popup,.live-finish").show();
                        $.ajax({
                            url : sd_index.url + "pub/user/info?userId=" + room.performerId,
                            type : "get",
                            xhrFields: { withCredentials: true },
                            //crossDomain: true,
                            crossDomain: true == !(document.all),
                            success : function(data){
                                var lvTop = Math.floor(data.data.level/10);
                                $("#memberCountOffset").html("0人");
                                $("#nickName").html(data.data.nickName).attr("title",data.data.nickName);
                                $("#anchorLv").html(data.data.level).css({"background-position":"0 "+ -22*lvTop +"px"});
                                $("#anchorId").html("ID："+data.data.userId);
                                $("#anchorSl").html("");

                                $("#anchorCover").attr({"src":(data.data.avatarUrl).replace("http:","https:"),"alt":data.data.nickName});

                            }
                        })
                    }
                }
            });
            return
        }else if(room.roomType == 9){
            $.ajax({
                url : sd_index.url + "pub/hot",
                type : "get",
                crossDomain: true == !(document.all),
                success : function(data){
                    var len = data.data.length;
                    var videoUrl = "";
                    var videoHtml = "";
                    var videoIndex = "";
                    console.log(room.roomIndex);
                    if(room.roomIndex != null){
                        videoIndex = Number(room.roomIndex);
                    }else{
                        for(var i=0;i<len;i++){
                            if(data.data[i].userId == room.performerId && data.data[i].room.roomType == room.roomType){
                                videoIndex = i;
                                break;
                            }
                        }
                    }

                    var lvTop = Math.floor(data.data[videoIndex].level/10);

                    $("#memberCountOffset").html(data.data[videoIndex].room.currentMembers +"人次");
                    //if(data.data[videoIndex].room.videoUrls.length >=1){
                    //    videoUrl = data.data[videoIndex].room.videoUrls[0];
                    //}else{
                    //    videoUrl = data.data[videoIndex].room.videoUrls;
                    //}
                    videoUrl = data.data[videoIndex].room.videoUrls[0];

                    $("#nickName").html(data.data[videoIndex].nickName);
                    $("#anchorLv").html(data.data[videoIndex].level).css({"background-position":"0 "+ -22*lvTop +"px"});
                    $("#anchorId").html("ID："+data.data[videoIndex].userId);
                    var roomTitle = data.data[videoIndex].room.title;
                    $("#anchorSl").html(roomTitle);

                    $("#anchorCover").attr({"src":data.data[videoIndex].avatarUrl,"alt":data.data[videoIndex].nickName});

                    videoHtml = "<video id='recVideo' controls autoplay='autoplay' width='400px' height='711px' src='"+ videoUrl +"'></video>";
                    $("#mdVideo").html(videoHtml);

                }
            });
            return;
        }else{
            $(".popup,.live-finish").show();
        }

    },

    //发送消息  弹幕消息
    sendMsg : function(){
        var that = this;
            var messageTxt = $.trim($("#sendTxt").val());
            if(room.roomType == 3){
                //判断登录状态
                if(sd_index.mtoken == "" || sd_index.mtoken == undefined || sd_index.mtoken == null){
                    $(".popup").show();
                    $(".popup-login").show();
                }else{
                    //判断消息是否为空
                    if(messageTxt == ""){
                        popup.errMsg("您没有输入任何信息哦!");
                    }else{
                        $.ajax({
                            url : sd_index.url + "user/info",
                            type: 'GET',
                            xhrFields: { withCredentials: true },
                            //crossDomain: true,
                            crossDomain: true == !(document.all),
                            contentType: "application/json",
                            success : function(data){
                                if(data.rtn == 0){
                                    //判断是否是弹幕消息
                                    if(room.bulletScreen){
                                        $.ajax({
                                            url : sd_index.url + "user/danmaku",
                                            type : "post",
                                            xhrFields: { withCredentials: true },
                                            //crossDomain: true,
                                            crossDomain: true == !(document.all),
                                            data : {"message" : messageTxt , "performerId" :room.performerId},
                                            success : function(data){
                                                if(data.rtn == 0){
                                                    $("#userMoney").html(data.data.money);
                                                    centerInfo.bulletScreenHtml(sd_index.userAvatarUrl, loginInfo.identifierNick,messageTxt,"danmaku");
                                                }else{
                                                    popup.errMsg("您的余额不足，无法发送弹幕消息，请充值。");
                                                }
                                            }
                                        })
                                    }else{
                                        sendMessage(room.performerId,messageTxt,function(){
                                            console.log("发送消息成功");
                                            $("#sendTxt").val("");
                                        },function(){
                                            console.log("发送信息失败");
                                            popup.errMsg("发送信息失败");
                                        })
                                    }
                                }else if(data.rtn == 30007){
                                    fun_index.deleteCookie();
                                    $(".popup").show();
                                    $(".popup-login").show();
                                }else{
                                    popup.errMsg(data.errMsg);
                                    console.log(data.errMsg);
                                }
                            }
                        });
                    }
                }
            }else{
                popup.errMsg("录播不能发送聊天信息哦~~");
            }

    },
    sendMsgEvent : function(){

        var that = this;
        $("#sendMsg").click(function(){
            that.sendMsg();
        });

        $("body").keydown(function() {
            if (event.keyCode == "13") { //keyCode=13是回车键
                that.sendMsg();
            }
        });
    },
    //大幕礼物
    /**
     * listHtml 参数
     * num : 礼物数量   (Int)
     * pic : 用户头像地址   （链接）
     * userName : 用户名字   （string）
     * giftType : 礼物类型    （string）
     * giftPic : 礼物图片     （链接）
     * */
    giftListHtml: function (num, pic, useName, giftType, giftPic) {

        var list = '<div class="gift-list" data-num="' + num + '">' +
            '<div class="gift-host-head">' +
            '<img src=' + pic + ' alt="" />' +
            '</div>' +
            '<h2 class="gift-username">' + useName + '</h2>' +
            '<h2 class="gift-type">送出<span>' + giftType + '</span></h2>' +
            '<div class="gift-info">' +
            '<img class="gift-pic" src=' + giftPic + ' alt="">' +
            '<span class="iconfont">&#xe605;</span>' +
            '<span class="gift-count">' + num + '</span>' +
            '</div>' +
            '</div>';
        $(".bullet-gifts").append(list);

        //$(".gift-list").animate({left:"0px",opacity:"1"},500,function(){
        //    var s = $(this);
        //    setTimeout(function () {
        //        s.remove();
        //    }, (3000 + num * 10));
        //})
    },
    giftListAni : function(){
        setInterval(function(){
            $(".gift-list").eq(0).animate({left:"0px",opacity:"1"},500,function(){
                var s = $(this);
                setTimeout(function(){
                    s.animate({left:"-300px",opacity:"0"},100).remove();
                },2588 + Number(s.attr("data-num"))*10);
            });
            $(".gift-list").eq(1).animate({left:"0px",opacity:"1"},600,function(){
                var s = $(this);
                setTimeout(function(){
                    s.animate({left:"-300px",opacity:"0"},100).remove();
                },2488 + Number(s.attr("data-num"))*10);
            });
        },1000);
    },
    bulletScreenHtml : function(pic,username,txt,type){

        if(type == "siteMsg"){
            var bullet = '<div class="bullet-screen-list" style="top:;" data-bullet-type= '+ type + '>'+
                            '<div class="bullet-head">'+
                                '<img src= '+ pic +'>'+
                            '</div>'+
                            '<div>'+
                                 '<h3 class="bullet-screen-content">'+ txt +'</h3>'+
                            '</div>'+
                        '</div>';
        }else if(type =="giftDamaku"){
            var bullet = '<div class="bullet-screen-list" style="top:'+ (room.bulletPosition*50) +'px;" data-bullet-type= '+ type + '>'+
                '<div class="bullet-head">'+
                '<img src= '+ pic +'>'+
                '</div>'+
                '<div>'+
                '<h3 class="user-name">'+ username +'</h3>'+
                '<h3 class="bullet-screen-content">'+ txt +'</h3>'+
                '</div>'+
                '</div>';
            room.bulletPosition++;
            if(room.bulletPosition >= 6){
                room.bulletPosition = 0;
            }
        }else{
            var bullet = '<div class="bullet-screen-list" style="top:'+ (room.bulletPosition*50) +'px;" data-bullet-type= '+ type + '>'+
                                '<div class="bullet-head">'+
                                     '<img src= '+ pic +'>'+
                                '</div>'+
                                '<div>'+
                                    '<h3 class="user-name">'+ username +'</h3>'+
                                    '<h3 class="bullet-screen-content">'+ txt +'</h3>'+
                                '</div>'+
                        '</div>';
                room.bulletPosition++;
                if(room.bulletPosition >= 6){
                    room.bulletPosition = 0;
                }
        }

        $(".bullet-screen").append(bullet);
        setTimeout(function(){
            $(".bullet-screen-list").animate({left:"-1000px"},10000,function(){
                var s = $(this);
                setTimeout(function () {
                    s.remove();
                }, (20000));
            })
        },1000)

    },
    //测试礼物弹幕
    testGifts: function () {
        var that = this;
        $("#memberCountOffset").click(function(){
            centerInfo.bulletScreenHtml("http://meidou-10028005.image.myqcloud.com/1472030905303", "中奖信息" , "用户昵称”赠送幸运礼物“小飞人”，中得10000倍大奖，获得XXX美豆","siteMsg");
        });
        //$("#givingGift").click(function(){
        //    that.bulletScreenHtml("http://meidou-10028005.image.myqcloud.com/1488640556336","用户名","弹幕内容弹幕弹幕内容弹幕弹幕内容弹幕弹幕内容弹幕","text");
        //    that.giftListHtml(99,"http://meidou-10028005.image.myqcloud.com/1488640556336","用户名","玫瑰","http://mediastorage-10028005.file.myqcloud.com/Pictures/1/ic_liwu_hua%403x.png");
        //});
    },


    //聊天框
    chattingListHtml: function () {
        //鼠标移入后 聊天框不滚动 移出后移动
        $(".chatting-box").bind({
            mouseenter: function () {
                room.sBoole = false;
            },
            mouseleave: function () {
                room.sBoole = true;
            }
        });
        if (room.sBoole == true) {
            $(".chatting-box").scrollTop($(".send").height());
        } else {
            $(".chatting-box").scrollTop();
        }

    }

};

//充值
var recharge = {
    init : function(){
        var that = this;
        that.rechargeList();
        that.recharge();
        that.payCallback();
    },
    rechargeList : function(){
        $.ajax({
            url : sd_index.url + "pub/packages",
            type : "get",
            //xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success : function(data){
                var len = data.data.length;
                var reListHtml = "";
                for(var i = 0; i < len;i++){
                    reListHtml += "<li data-cost="+ data.data[i].point +" data-pack-id = "+ data.data[i]._id +">"+
                        "<p class='money'>"+ data.data[i].RMB +"<span>元</span></p>"+
                        "<p class='meidou'>"+ data.data[i].point +"美豆</p>"+
                        "</li>"
                }
                $(".recharge-list").html(reListHtml);
                $(".recharge-list li").eq(0).addClass("active");
            }
        });
        $(".recharge-list,#payTypeChoice").delegate("li","click",function(){
            $(this).addClass("active").siblings("li").removeClass("active");
        });
    },
    //充值
    recharge : function(){
        var that = this;
        $("#recharge").click(function(){
            $(".popup").show();
            if(sd_index.mtoken == "" || sd_index.mtoken == undefined || sd_index.mtoken == null){
                $(".popup-login").show();
            }else{
                $.ajax({
                    url : sd_index.url + "user/info",
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    //crossDomain: true,
                    crossDomain: true == !(document.all),
                    contentType: "application/json",
                    success : function(data){
                        if(data.rtn == 0){
                            $(".popup-recharge-type").show();
                            MtaH5.clickStat("recharge");
                        }else if(data.rtn == 30007){
                            fun_index.deleteCookie();
                            $(".popup-login").show();
                        }else{
                            popup.errMsg(data.errMsg);
                            console.log(data.errMsg);
                        }
                    }
                });

            }
        });
        $("#rechargeTypeBtn").click(function(){
            var packId = $(".popup-recharge-type .recharge-list .active").attr("data-pack-id");
            var type = $(".popup-recharge-type #payTypeChoice .active").attr("data-type");

            if(type == "weixin"){
                $(".popup-recharge-weixin .recharge-list li[data-pack-id='"+ packId +"']").addClass("active").siblings("li").removeClass("active");
                sd_index.packId = $(".popup-recharge-type .recharge-list li.active").attr("data-pack-id");
                $(".popup-recharge-type").hide();
                $(".popup-recharge-weixin").show();
                that.rechargeWeixin();
                return;
            }
            if(type == "zhifubao"){
                $(".popup-recharge-type").hide();
                $(".popup-recharge-zhifubao").show();
                sd_index.packId = $(".popup-recharge-type .recharge-list li.active").attr("data-pack-id");
                that.rechargeZfb();
                return;
            }
        });
        $(".popup-recharge-weixin .recharge-list").delegate("li","click",function(){
            sd_index.packId = $(this).attr("data-pack-id");
            that.rechargeWeixin();
        });
    },
    rechargeWeixin : function(){
        $.ajax({
            url : sd_index.url + "order/webPay",
            type: 'post',
            data : {"paymentID":"TEN_PAY"  ,"packId":sd_index.packId},
            xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            before : function(){
                $("#barcode").html("");
            },
            success : function(data){
                if(data.rtn == 0){
                    sd_index.orderId = data.data.orderId;
                    $("#barcode").html("").qrcode({
                        text    : data.data.tenString,
                        width : "130",
                        height : "130",
                        src:  ''
                    });
                    $(".popup-recharge-type").hide();
                    $(".popup-recharge-weixin").show();
                }
            }
        })
    },
    rechargeZfb : function(){
        console.log(sd_index.packId);
        $.ajax({
            url : sd_index.url + "order/webPay",
            type: 'post',
            data : {"paymentID":"ALI_PAY"  ,"packId":sd_index.packId},
            xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success : function(data){
                sd_index.orderId = data.data.orderId;
                $("#payForm").html(data.data.pcString);
            }
        })
    },
    payCallback : function(){
        var that = this;
        $("#payWxBtn,#payZfbErr,#payZfbSuc").click(function(){
            $(".popup-recharge-weixin,.popup-recharge-zhifubao").hide();
            $.ajax({
                url : sd_index.url + "order/info/"+ sd_index.orderId,
                type : "get",
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success : function(data){
                    console.log(data);
                    if(data.rtn == 0){
                        if(data.data.status == 2){
                            that.rechargeSucceed();
                        }else{
                            that.rechargeError();
                        }
                    }else if(data.rtn == 30007){
                        fun_index.deleteCookie();
                        popup.errMsg("登录超时,请重新登录");
                    }else{
                        popup.errMsg(data.errMsg);
                        console.log(data.errMsg);
                    }

                    that.moneyCallback();
                }
            })
        })
        $(".money-callback").click(function(){
            that.moneyCallback();
        })
    },
    moneyCallback : function(){
        var count = 0;
        var moneyCallback = setInterval(function(){
            if(count >=9){
                clearInterval(moneyCallback);
            }
            count ++;
            $.ajax({
                url : sd_index.url + "user/info",
                type: 'GET',
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                contentType: "application/json",
                success : function(data){
                    if(data.rtn == 0){
                        sd_index.userMoney = data.data.money;
                        $("#userMoney").html(sd_index.userMoney);
                    }else if(data.rtn == 30007){
                        fun_index.deleteCookie();
                        $(".popup-login").show();
                    }else{
                        popup.errMsg(data.errMsg);
                        console.log(data.errMsg);
                    }
                }
            });
        },1000);
    },
    //充值返回值  成功或者失败
    rechargeSucceed : function(){
        $(".recharge-success").show();
        $(".recharge-success .success").click(function(){
            $(".popup,.alert").hide();
        })
    },
    rechargeError : function(){
        $(".recharge-error").show();
        $(".recharge-error .error").click(function(){
            $(".recharge-error").hide();
            $(".popup-recharge-type").show();
        })
    }
};
//礼物列表
var giftsList = {
    init : function(){
        var that = this;
        that.getGiftsListHtml();
        that.bulletOnOff();
    },
    //礼物列表
    getGiftsListHtml: function () {
        var that = this;
        $.ajax({
            url: sd_index.url+"pub/gifts",
            type: "get",
            //xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success: function (data) {
                var len = data.data.length;
                room.giftsListHtml = "";
                for (var i = 0; i < len; i++) {

                    if(data.data[i].label == "撒红包"){
                        continue;
                    }
                    room.giftsListHtml +=
                        '<div class="swiper-slide" data-gift-label='+ data.data[i].label +' data-gift-id=' + data.data[i]._id + '>'+
                        '<div class="alt">'+
                        '<img src=' + data.data[i].iconUrl + ' alt=""/>'+
                        '<p class="gifts-name">' + data.data[i].label + '</p>'+
                        '<p class="gifts-price">' + data.data[i].price + '豆</p>'+
                        '</div>'+
                        '<img class="img-gifts" src=' + data.data[i].iconUrl + ' alt="">'+
                        '</div>'
                }

                $(".gifts-container .swiper-wrapper").html(room.giftsListHtml);

                //获取免费礼物个数
                $("[data-gift-label='荧光棒'] .gifts-price").html("0个");    //荧光棒
                $("[data-gift-label='超级荧光棒'] .gifts-price").html("0个");    //99荧光棒

                //屏蔽未完成红包礼物
                $("[data-gift-label='荧光棒']")


                $.ajax({
                    url : sd_index.url + "user/info",
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    //crossDomain: true,
                    crossDomain: true == !(document.all),
                    contentType: "application/json",
                    success : function(data){
                        if(data.rtn == 0){
                            //获取免费礼物个数
                            $("[data-gift-label='荧光棒'] .gifts-price").html(data.data.giftFree + "个");
                            $("[data-gift-label='超级荧光棒'] .gifts-price").html(Math.floor(data.data.giftFree/99) + "个");
                        }
                    }
                });


                that.showGiftsList();
                //选取礼物 和 数量
                that.giftsClick();
            }
        });
    },
    showGiftsList: function () {
        var swiper = new Swiper('.gifts-container', {
            slidesPerView: 4,
            slidesPerColumn: 2,
            paginationClickable: true,
            spaceBetween: 0,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev'
        });


        alt(".gifts-container",".swiper-slide",".alt");
    },
    giftsClick: function () {
        $(".gifts-container").delegate(".swiper-slide", "click", function () {
            $(this).addClass("active").siblings(".swiper-slide").removeClass("active");
        });
        $(".gifts-num ul li").click(function () {
            $(this).addClass("active").siblings("li").removeClass("active");
        });
    },

    //弹幕开关
    bulletOnOff : function(){
        function bulletInit(){
            if($(".checkbox input").attr("checked")){
                //$(".bullet-screen").hide();
                room.bulletScreen = false;
            }else{
                //$(".bullet-screen").show();
                room.bulletScreen = true;
            }
        }
        bulletInit();

        $(".htmleaf-content").click(function(){
            bulletInit();
        });
    }
};

//赠送礼物
var gifts = {
    init : function(){
        var that = this;
        that.giveGifts();
    },
    giveGifts : function(){
        $("#givinggift").click(function(){
            if(room.roomType == 3){
                if(sd_index.mtoken == "" || sd_index.mtoken == undefined || sd_index.mtoken == null){
                    $(".popup,.popup-login").show();
                }else{
                    if( $(".gifts-container .active").length > 0){
                        MtaH5.clickStat("givinggift");
                        var giftId = $(".gifts-container .active").attr("data-gift-id");
                        var giftCount = $(".focus .active").attr("data-num");

                        var giftLabel = $(".gifts-container .active .gifts-name").html();
                        var giftIconUrl = $(".gifts-container .active .img-gifts").attr("src");
                        $.ajax({
                            url : sd_index.url + "user/gifts",
                            type : "post",
                            xhrFields: { withCredentials: true },
                            //crossDomain: true,
                            crossDomain: true == !(document.all),
                            data : {
                                "performerId" : room.performerId ,
                                "giftId" : giftId,
                                "giftCount" : giftCount,
                                "platform" : "web"
                            },
                            success : function(data){
                                if(data.rtn == 0){
                                    //centerInfo.giftListHtml(giftCount,sd_index.userAvatarUrl, loginInfo.identifierNick,giftLabel, giftIconUrl);
                                    $("#userMoney").html(data.data.money);

                                    //获取免费礼物个数
                                    $("[data-gift-label='荧光棒'] .gifts-price").html(data.data.giftFree + "个");
                                    $("[data-gift-label='超级荧光棒'] .gifts-price").html(Math.floor(data.data.giftFree/99) + "个");
                                }else if(data.rtn == 30007){
                                    fun_index.deleteCookie();
                                    $(".popup").show();
                                    $(".popup-login").show();
                                }else{
                                    popup.errMsg(data.errMsg);
                                }
                            }
                        })
                    }else{
                        popup.errMsg("请选择要赠送的礼物");
                    }
                }
            }else{
                popup.errMsg("录播不能发送礼物哦~~");
            }
        });
    }
};

//用户进入房间 退出房间消息推送
var userRoom = {
    init : function(){
        var that = this;
        that.enterRoom();
        //that.leaveRoom();
    },
    enterRoom : function(){
        $.ajax({
            url : sd_index.url + "user/room/enter",
            type : "post",
            data : {"performerId": room.performerId , "withInfo" : 1},
            xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success : function(data){

            }
        });
    },
    leaveRoom : function(){
        $.ajax({
            url : sd_index.url + "user/room/leave",
            type : "post",
            data : {"performerId": room.performerId},
            xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            success : function(data){

            }
        });
    }
};


//转转乐
var zzlStr = {
    list_1 : "",
    list_2 : "",
    list_3 : "",
    list_1_result : 195,
    list_2_result : 130,
    list_3_result : 0,
    downT : ""              //倒计时计时器
};

var zzl = {
    init : function(time){
        var that = this;
        that.gameBegin();
        that.blink();
        that.objEvent();
        that.zzlState();
        that.countDown(time);
    },
    eleHide : function(){
        $(".zzl-icon,.zzl-ele,.zzl-state").hide();
        $("#btnStart").removeClass("btn-start");
    },
    gameBegin : function(){
        var that = this;
        zzlStr.list_1 =  $(".list-1 img");
        zzlStr.list_2 =  $(".list-2 img");
        zzlStr.list_3 =  $(".list-3 img");
        $(".zzl-icon,.zzl-ele").show();
        $(".btn-start").removeAttr("disabled");
        $(".zzl-close").click(function(){
            $(".zzl-ele,.zzl-state").hide();
        });
        $(".zzl-icon").click(function(){
            $(".zzl-ele").show();
        })
    },
    countDown : function(t){
        var intDiff = parseInt(t); //倒计时总秒数量
        timer(intDiff);
    },
    blink : function(){
        ani($(".blink img"),0,4,"top",-52,1,200,true);
    },
    put : function(){
        ani($(".put img"),0,6,"left",-36,1,200,false);
    },
    objInit : function(){
        $(".list-1 img,.list-2 img,.list-3 img").css({"top":"-260px"});
    },
    objAni : function(ele,time){
        var a = 24;
        ele.t = setInterval(function(){
            ele.step = 13*a;
            if(ele.step <= 0){
                a = 24;
            }
            ele.css("top",-ele.step);
            if(ele.onOff && ele.step == ele.stop){
                clearInterval(ele.t);
                ele.onOff = false;
                if(ele == zzlStr.list_3){
                    $(".put img").css({"left":0});
                    $(".btn-start").removeAttr("disabled");
                }
            }

            a--;

        },time);

    },
    objAniStop : function(){
        setTimeout(function(){
            zzlStr.list_1.onOff = true;
            zzlStr.list_1.stop = zzlStr.list_1_result;
        },3000);
        setTimeout(function(){
            zzlStr.list_2.onOff = true;
            zzlStr.list_2.stop = zzlStr.list_2_result;
        },4000);
        setTimeout(function(){
            zzlStr.list_3.onOff = true;
            zzlStr.list_3.stop = zzlStr.list_3_result;
        },5000);
    },
    objEvent : function(){
        var that = this;
        $(".btn-start").click(function(){
            $(this).attr("disabled","disabled");

            that.objInit();
            that.objAni(zzlStr.list_1,100);
            that.objAni(zzlStr.list_2,80);
            that.objAni(zzlStr.list_3,90);
            that.put();
            $.ajax({
               url : sd_index.url + "user/gifts",
                type : "post",
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                data : {
                    "performerId" : room.performerId ,
                    "giftId" : room.gameId,
                    "giftCount" : 1,
                    "platform" : "web"
                },
                success : function(data){
                    //调取中间信息
                    zzlStr.list_1_result = result(data.data.winningResult.list[0]);
                    zzlStr.list_2_result = result(data.data.winningResult.list[1]);
                    zzlStr.list_3_result = result(data.data.winningResult.list[2]);
                    that.objAniStop();

                    //获取余额
                    $("#userMoney").html(data.data.money);

                    //获取免费礼物个数
                    $("[data-gift-label='荧光棒'] .gifts-price").html(data.data.giftFree + "个");
                    $("[data-gift-label='超级荧光棒'] .gifts-price").html(Math.floor(data.data.giftFree/99) + "个");


                    //获得双倍奖励
                    if(data.data.winningResult.multiple == 2) {
                        setTimeout(function() {
                            that.winningDouble(data.data.winningResult.list[0].type, data.data.winningResult.list[0].count);
                        },4000);
                    }

                    //获取打赏主播信息

                    var len = data.data.winningResult.gifts.length;
                    var htm = "";

                    var m = 0;

                    for(var j = 0 ; j < 3 ; j ++){
                        if(data.data.winningResult.list[j].type == "money"){
                            m += data.data.winningResult.list[j].count;
                        }
                    }
                    $("#winCount").html(m);

                    if(len > 0){

                        for(var i = 0;i < len; i++){
                            htm += '<li class="col-xs-4" data-gifts-id='+ data.data.winningResult.gifts[i]._id +'>'+
                                        '<div>'+
                                            '<img src='+ data.data.winningResult.gifts[i].contentUrl +' alt="">'+
                                            '<p class="price">'+ data.data.winningResult.gifts[i].price +'美豆</p>'+
                                        '</div>'+
                                    '</li>'
                        }
                        setTimeout(function() {
                            that.winningGive(htm);
                        },4000);
                    }
                }
            });


        })
    },
    //奖品说明
    zzlState : function(){
        $(".btn-state").click(function(){
            $(".zzl-state").show();
        });
        $(".state-close").click(function(){
            $(".zzl-state").hide();
        })
    },
    //获得双倍奖励
    winningDouble : function(type,count){
        var imgUrl = "";
        var name = "";
        if(type == "giftFree"){
            imgUrl = "themes/img/zzl/ygb-double.png";
            name = "荧光棒";
        }
        if(type == "money"){
            imgUrl ="themes/img/zzl/md-double.png";
            name = "美豆";
        }
        $(".gifts-double").attr("src",imgUrl);

        $(".double-info").html("恭喜您获得" + count*3*2 + name);

        $(".winning-info-double").show();

        //两秒后自动消失.
        setTimeout(function(){
            $(".winning-info-double").hide();
        },2000);

        $(".double-close").click(function(){
            $(".winning-info-double").hide();
        })
    },
    //获奖打赏主播
    winningGive : function(htm){

        $(".gifts-list").html(htm).delegate("li","click",function(){
            $(this).addClass("active").siblings("li").removeClass("active");
        });
        $(".gifts-list li").eq(0).addClass("active");

        $(".winning-md").show();

        //打赏主播. 赠送礼物
        $(".reward").click(function(){
            var giftId = $(".gifts-list .active").attr("data-gifts-id");
            $.ajax({
                url : sd_index.url + "user/gifts",
                type : "post",
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                data : {
                    "performerId" : room.performerId ,
                    "giftId" : giftId,
                    "giftCount" : 1,
                    "platform" : "web"
                },
                success : function(data){
                    if(data.rtn == 0){

                        $("#userMoney").html(data.data.money);

                        //获取免费礼物个数
                        $("[data-gift-label='荧光棒'] .gifts-price").html(data.data.giftFree + "个");
                        $("[data-gift-label='超级荧光棒'] .gifts-price").html(Math.floor(data.data.giftFree/99) + "个");
                    }else if(data.rtn == 30007){
                        fun_index.deleteCookie();
                        $(".popup").show();
                        $(".popup-login").show();
                    }else{
                        popup.errMsg(data.errMsg);
                    }
                }
            })
        });

        //关闭打赏
        $(".md-close").click(function(){
            $(".winning-md").hide();
        });
    }
};



$(function(){
    leftList.init();
    centerInfo.init();
    giftsList.init();
    recharge.init();
    gifts.init();
    //userRoom.init();
});

//alt效果
function alt(box,ele,child){
    $(box).delegate(ele,"mouseenter mouseleave",function(e){
        if(e.type == "mouseenter"){
            if(!$(this).children(child).is(":animated")){
                $(this).children(child).show();
            }
        }
        if(e.type == "mouseleave"){
            $(this).children(child).hide();
        }
    })
}

//循环动画
function ani(ele,start,end,style,dist,step,time,loop){
    var ele = ele;
    var start = start;
    var end = end;
    var step = step;
    var time = time;
    var style = style;
    var dist = dist;
    var loop = loop;

    ele.t = setTimeout(function(){ani(ele,start,end,style,dist,step,time,loop)},time);

    ele.css(style,dist*start+"px");
    if(start >= end){
        start = 0;
        if (loop == false){
            clearTimeout(ele.t);
        }
    }else{
        start+=step;
    }

}

//倒计时
function timer(intDiff) {
    var day = 0,
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
    if (intDiff > 0) {
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }else{
        $(".btn-start").attr("disabled","disabled");
        clearTimeout(zzlStr.downT);
        zzlStr.downT = "";
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    //$('#day_show').html(day + "天");
    //$('#hour_show').html('<s id="h"></s>' + hour + '时');
    $('.minute-show').html(minute);
    $('.second-show').html(second);
    if (intDiff <= 0){
        zzl.eleHide();
        $(".zzl-ele").html(" ");
        clearTimeout(zzlStr.downT);
        return;
    }
    intDiff--;

    zzlStr.downT = setTimeout(function(){
        timer(intDiff);
    },1000)
}

//转转乐返回结果转义
function result(ele){
    var eType = ele.type;
    var eCount = ele.count;
    if(eType == "giftFree" && eCount == 1){
        return 0;
    }
    if(eType == "giftFree" && eCount == 10){
        return 65;
    }
    if(eType == "money" && eCount == 1){
        return 130;
    }
    if(eType == "money" && eCount == 6){
        return 195;
    }
    if(eType == "money" && eCount == 100){
        return 260;
    }
}