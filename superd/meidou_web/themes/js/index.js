/**
 * Created by Jacky.Wang on 2017/3/16.
 */

//全局变量
var sd_index = {
    indexListHtml : "",       //主播列表html
    anchorTyle :"",           //视频类型 直播/录播
    mtoken : getCookie("mtoken"),               //mtoken
    //url : "https://meidou.tv/api/v1/",      //正式环境
    url : "https://stage-api.meidou.tv/api/v1/",               //测试环境
    packId : "",
    orderId : "",                                   //订单id

    //用户余额
    userMoney : 0,
    //用户头像
    userAvatarUrl : "",
    n : diu_Randomize(0,3),
};

//直播间全局变量
var room = {
    performerId :  GetUrlString("performerId"),    //主播ID
    roomType : GetUrlString("roomType"),          //获取播放类型
    roomIndex : GetUrlString("i"),                //获取当前直播间
    sceneId : "",                                 //获取当前场次

    leftListHtml : "",     //左侧在线主播列表
    contriListHtml : "",    //贡献榜
    giftsListHtml :"",       //礼物列表
    bulletPosition : 0,      //弹幕位置

    //聊天框滚动判定
    sBoole: true,
    //随机主播ID
    randomId : "",
    //是否发送弹幕消息
    bulletScreen : false,

    //游戏ID
    gameId : ""
};
//首页banner

var banner = {
    init : function(){
        var that = this;
        that.bannerSlide();
    },
    bannerSlide : function(){
        var swiper = new Swiper('.swiper-banner', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween : 10,
            autoplay : 3000,
            loop : true
        });
    }
};
//首页列表
var fun_index = {
    init : function(){
        var that = this;
        that.getAnchorList();
        that.listAnimate();
    },
    /**
     * 获取首页列表
     * */
    getAnchorList : function(){
        $.ajax({
            url : sd_index.url + "pub/hot?n="+ sd_index.n,
            type : "get",
            //xhrFields: { withCredentials: true },
            //crossDomain: true,
            crossDomain: true == !(document.all),
            beforeSend : function(){
                popup.loading();
            },
            success : function(data){
                var len = data.data.length;

                for(var i = 0 ; i < len ; i ++ ){
                    if(data.data[i].room.layout == 0){

                        if(data.data[i].room.roomType == 3){
                            sd_index.anchorTyle = "直播";
                        }
                        if(data.data[i].room.roomType == 9){
                            sd_index.anchorTyle = "录播";
                        }
                        sd_index.indexListHtml += '<li class="col-xs-3" data-uid =  '+ data.data[i].userId  +' data-room-type='+ data.data[i].room.roomType +' data-index='+ i +'>'+
                            '<div class="list">'+
                            '<img class="anchor-poster" src='+ (data.data[i].room.coverUrl).replace('http:','https:') +' alt="" />'+
                            '<p class="anchor-cond">'+ sd_index.anchorTyle +'</p>'+
                            '<div class="anchor-info">'+
                            '<p class="anchor-name" title='+ data.data[i].nickName +'>' + data.data[i].nickName+ '\ </p>'+
                            '<p class="iconfont anchor-ppv">' + data.data[i].room.currentMembers + '人</p>'+
                            '</div>'+
                            '</div>'+
                            '</li>'
                    }
                }
                popup.loadingHide();
                $("#anchorList").html(sd_index.indexListHtml);
            },
            error : function(data){
                popup.loadingHide();
                console.log(data.errMsg);
            }
        })
    },
    listAnimate : function(){
        $("#anchorList").delegate("li","mouseenter mouseleave click",function(e){
            if(e.type == "mouseenter"){
                if(!$(this).find(".anchor-poster").is(":animated")){
                    $(this).find(".anchor-poster").animate({"width":"256px","height":"256px",left:"-10px",top:"-10px"},500)
                }
            }
            if(e.type == "mouseleave"){
                $(this).find(".anchor-poster").animate({width:"236px",height:"236px",left:"0",top:"0"},500);
            }

            if(e.type == "click"){
                window.location.href = "liveRoom.html?performerId="+$(this).attr("data-uid")+"&roomType="+$(this).attr("data-room-type")+"&i="+$(this).attr("data-index");
            }
        })
    },
    //删除cookie
    deleteCookie : function(){
        $.cookie({"ignoreAuth":null,"mAppType":null,"mDevId":null,"mchannel":null,"mtoken":null,"platform":null});
    }
};
//弹窗
var popup = {
    init : function(){
        var that = this;
        that.close();
    },
    close : function(){
        $(".popup-close").click(function(){
            $(".popup,.popup-login,.popup-error,.live-finish,.popup-recharge-type,.popup-recharge-weixin,.popup-recharge-zhifubao,.recharge-success,.recharge-error").hide();
        })
    },
    loading : function(){
        $(".popup,.popup-loading").show();
    },
    loadingHide : function(){
        $(".popup,.popup-loading").hide();
    },
    errMsg : function(msg){
        $(".popup .alert").hide();
        $(".popup,.popup-error").show();
        $("#errMsg").html(msg);
    }
};
//登录
var login = {
    init : function(){
        var that = this;
        that.login();
        that.loginState();
        that.logout();
    },
    imSdkInit : function(){
        // 页面加载时调用该函数，初始化imsdk, imsdk在收到消息后，回调onMessageNotify
        imSdkInit(onMessageNotify, function (resp) {

            console.log('login rst:', resp);
            //sdklogin后，才进入直播间
            enterRoom(room.performerId,function(){
                console.log("成功");
                userRoom.init();
            },function(){
                console.log("失败");
            });

            enterRoom("255255255255",function(){
                console.log("大礼物成功");
            },function(){
                console.log("大礼物失败");
            });
            //console.log(room.performerId);
        }, function (error) {
                console.log(error);
            }
            ,function(){
            $(".popup,.live-finish").show();
        }
        );
    },
    login : function(){
        $(".un-login").click(function(){
            $(".popup,.popup-login").show();
        });
        //登录跳转
        $(".popup-login ul li").click(function(){
            var loginType = $(this).attr("data-login-type");
            if(room.performerId == null || room.performerId == undefined){
                window.location.href = (sd_index.url + "pc/login?platformLogin=web&loginType=" + loginType);
            }else{
                window.location.href = (sd_index.url + "pc/login?platformLogin=web&loginType=" + loginType + "&performerId=" + room.performerId +"&roomType="+room.roomType);
            }
        });
    },
    loginState : function(){
        var that = this;
        if(sd_index.mtoken == "" || sd_index.mtoken == undefined || sd_index.mtoken == null){
            that.loginErr();
            $.ajax({
                url : sd_index.url + "user/startup",
                type: 'GET',
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success : function(data){
                    loginInfo.userSig = data.data.usersig;

                    loginInfo.identifier = data.data.identifier;

                    if($("body").hasClass("live-room")){
                        that.imSdkInit();
                    }
                }
            });
        }else{
            $.ajax({
                url : sd_index.url + "user/info?platform=web&n="+sd_index.n,
                type: 'GET',
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success : function(data){
                    if(data.rtn == 0){
                        that.loginSuccess();
                        //解密加密字段
                        var encrypted = data.data.userString;
                        var key = data.data.random;
                        var iv = data.data.random;

                        key = CryptoJS.enc.Utf8.parse(key);
                        iv = CryptoJS.enc.Utf8.parse(iv);

                        encrypted = encrypted.toString();

                        var decrypted = CryptoJS.RC4.decrypt(encrypted, key, {
                            iv: iv
                        });
                        // 转换为 utf8 字符串
                        decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
                        //将返回字符串转换为对象
                        var userInfo = parseQuery(decrypted);
                        console.log(userInfo);

                        $(".login .user-name").html(userInfo.nickName);
                        $(".login img").attr({"src":(userInfo.avatarUrl).replace('http:','https:'),"alt":userInfo.nickName});

                        loginInfo.userSig = userInfo.usersig;

                        loginInfo.identifier = userInfo.userId;
                        loginInfo.identifierNick = userInfo.nickName;

                        sd_index.userMoney = userInfo.money;

                        sd_index.userAvatarUrl = userInfo.avatarUrl;

                        $("#userMoney").html(sd_index.userMoney);
                        $(".recharge-name").html(loginInfo.identifierNick);

                        //获取免费礼物个数
                        //$("[data-gift-label='荧光棒'] .gifts-price").html(data.data.giftFree + "个");
                       // $("[data-gift-label='超级荧光棒'] .gifts-price").html(Math.floor(data.data.giftFree/99) + "个");

                    }else{
                        that.loginErr();
                        console.log(data.errMsg);
                        fun_index.deleteCookie();
                    }

                    if($("body").hasClass("live-room")){
                        that.imSdkInit();
                    }
                }
            });
        }

    },
    loginErr : function(){
        $(".un-login").show();
        $(".login").hide();
    },
    loginSuccess : function(){
        $(".un-login").hide();
        $(".login").show();
    },
    logout : function(){
        $(".logout").click(function(){
            popup.loading();
            $.ajax({
                url : sd_index.url + "user/logout",
                type : "post",
                data : {"platform":"web"},
                xhrFields: { withCredentials: true },
                //crossDomain: true,
                crossDomain: true == !(document.all),
                success : function(){
                    window.location.reload();
                    popup.loadingHide();
                }
            });
        })
    }
};

// 消息处理回调
var onMessageNotify = function (message) {
    console.log(message);
    switch (message.type) {
        case 'enter':
            var user = message.user;
            var msg = '<div class="send-list" data-type=' + message.type + '>'
                + '<span class="level" data-level=' + Math.floor(user.level / 10) + '>' + user.level + '</span>'
                +'<span>欢迎</span>'
                + '<span class="user-name">' + user.nickName + '</span>'
                + '进入房间~'
                + '</div>';

                $(".send").append(msg);
                centerInfo.chattingListHtml();

            break;
        case 'leave':
            var user = message.user;
            var msg = '<div class="send-list" data-type=' + message.type + '>'
                + '<span class="level" data-level=' + Math.floor(user.level / 10) + '>' + user.level + '</span>'
                + '<span class="user-name">' + user.nickName + '</span>'
                + '离开房间~'
                + '</div>';
            $(".send").append(msg);
            centerInfo.chattingListHtml();
            break;
        case 'text':
            var user = message.from;
            var msg = '<div class="send-list" data-type=' + message.type + '>'
                + '<span class="level" data-level=' + Math.floor(user.level / 10) + '>' + user.level + '</span>'
                + '<span class="user-name">' + user.nickName + '：</span>'
                + '<span class="send-content">' + message.content + '</span>'
                + '</div>';
            $(".send").append(msg);
            centerInfo.chattingListHtml();
            break;
        case 'gift':
            var gift = message.gift;
            var sender = message.from;
            if(gift.giftType != "lotteryBack"  && gift.giftType != "lottery"){
                var msg = '<div class="send-list" data-type=' + message.type + '>'
                    + '<span class="level" data-level=' + Math.floor(sender.level / 10) + '>' + sender.level + '</span>'
                    + '<span class="user-name">' + sender.nickName + '：</span>'
                    + '<span class="send-content"><span>我送了</span><span class="gift-sum">' + gift.giftCount + '</span>个</span>'
                    + '<img class="gift-type" src=' + gift.giftIconUrl + ' alt="礼物名称">'
                    + '</div>';
                $(".send").append(msg);
                //如果送礼物的用户 不是当前登录用户 时不调取弹幕礼物效果 (前端直接实时显示)
                //if(sender.userId != loginInfo.identifier){
                    centerInfo.giftListHtml(gift.giftCount, sender.avatarUrl, sender.nickName, gift.giftLabel, gift.giftIconUrl);
                //}
                centerInfo.chattingListHtml();
            }
            if(gift.giftType == "lottery"){
                if($.inArray("damaku",gift.giftEffect) >= 0){
                    centerInfo.bulletScreenHtml(gift.giftIconUrl, "中奖通知", gift.message,"giftDamaku");
                }
            }
            break;
        case 'danmaku':
            var danmaku = message.data;
            var msg = '<div class="send-list" data-type="text">'
                + '<span class="level" data-level=' + Math.floor(danmaku.level / 10) + '>' + danmaku.level + '</span>'
                + '<span class="user-name">' + danmaku.nickName + '：</span>'
                + '<span class="send-content">' + danmaku.message + '</span>'
                + '</div>';
            $(".send").append(msg);
            centerInfo.chattingListHtml();
            if(danmaku.userId != loginInfo.identifier) {
                centerInfo.bulletScreenHtml(danmaku.avatarUrl, danmaku.nickName, danmaku.message,message.subtype);
            }
            break;
        case 'gameBegin':
            var gameName = message.data.gameName;
            room.gameId = message.data.gift._id;
            var htm = '<a class="iconfont zzl-close" href="javascript:void(0);">&#xe725;</a>'+
                        '<div class="zzl-box">'+
                            '<div class="blink"><img src="themes/img/zzl/blink.png" alt="" /></div>'+
                            '<div class="put"><img src="themes/img/zzl/put.png" alt="" /></div>'+
                            '<div class="count-down"><span class="minute-show">03</span>:<span class="second-show">00</span></div>'+
                            '<ul class="obj-list">'+
                                '<li class="list-1"><img src="themes/img/zzl/list.png" alt="" /></li>'+
                                '<li class="list-2"><img src="themes/img/zzl/list.png" alt="" /></li>'+
                                '<li class="list-3"><img src="themes/img/zzl/list.png" alt="" /></li>'+
                            '</ul>'+
                            '<input type="button" class="btn-start" />'+
                            '<p class="intro">花费10美豆参加1次开心转转乐 <a href="javascript:void(0);" class="btn-state"></a></p>'+
                            '</div>';


            //转转乐
            if (gameName == "zhuanzhuanle" && sd_index.mtoken){
                $(".zzl-ele").html(htm);

                var countTime = Math.floor(message.data.duration/1000);
                zzl.init(countTime);
            }
            break;
        case 'siteMsg':
            console.log(message.data);
            centerInfo.bulletScreenHtml(message.data.iconUrl, "中奖信息" , message.data.msg,"siteMsg");
            break;
        default:
            break;
    }
};

$(function(){
    banner.init();
    popup.init();
    login.init();

    $("#btnlogin").click(function(){
        MtaH5.clickStat('btnlogin');
    })
});



//公共方法
function GetUrlString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function getCookie(c_name) {
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return "";
}

function parseQuery(query) {
    var result = {};
    // 如果不是字符串返回空对象
    if (typeof query !== 'string') {
        return result;
    }
    // 去掉字符串开头可能带的?
    if (query.charAt(0) === '?') {
        query = query.substring(1);
    }
    var pairs = query.split('&');
    var pair;
    var key, value;
    var i, len;
    for (i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i].split('=');
        // application/x-www-form-urlencoded编码会将' '转换为+
        key = decodeURIComponent(pair[0]).replace(/\+/g, ' ');
        value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
        // 如果是新key，直接添加
        if (!(key in result)) {
            result[key] = value;
        }
        // 如果key已经出现一次以上，直接向数组添加value
        else if (isArray(result[key])) {
            result[key].push(value);
        }
        // key第二次出现，将结果改为数组
        else {
            var arr = [result[key]];
            arr.push(value);
            result[key] = arr;
        } // end if-else
    } // end for
    return result;
}

function diu_Randomize(b,e){

    if(!b && b!=0 || !e){return "?";}

    return Math.floor( ( Math.random() * e ) + b );

}
