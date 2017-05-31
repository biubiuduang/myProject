// 默认登录信息，如果使用登录用户自己的信息，请重新定义该对象，并使用全局变量，全局变量，全局变量
// userSig 替换为 登录用户替换为自己真实的signature;mtoken
// identifier 替换为 登录用户替换为自己真实的userId;
// identifierNick 替换为 登录用户替换为自己真实的nickName;
// 其他保持不变

// 必须为全局变量
//正式环境 的loginInfo
//loginInfo = {
//    sdkAppID : '1400007682',
//    appIDAt3rd : '1400007682',
//    accountType : '3881',
//    userSig :
//    'eJxlzk9PgzAYx-E7r6Lp2bgWWkq9GcQBgc2JzumF8KdsdQ6Q1kU0e**buEQSz99Pnt-zbQAA4EOUXGZF0XzUOtV9KyC4AhDBi7-YtrJMM51aXfkvis9WdiLNKi26IWJKqYnQ2MhS1FpW8iz4qVJqETIiqtymw87vDXIiiNmOOSZyPcTYe3aDhasqHrP3t-mMC7nqYz7HySx6dfNktZ96S1NF4UYRa*tPd4tgcx0u7-CtV-bBfSPtyUvuf2VBwnyR2*zJztdCkbBwEjZ5ZDejSS134vyQwzimNmWjuhedkk09ABNhik3r520EjYNxBAFXW8Y_',
//    identifier: '900055344',
//    identifierNick: '美豆Rt1va'
//};

//测试环境 的loginInfo
loginInfo = {
    sdkAppID : '1400009434',
    appIDAt3rd : '1400009434',
    accountType : '5253',
    userSig :
        'eJxlzk9PgzAYx-E7r6Lp2bgWWkq9GcQBgc2JzumF8KdsdQ6Q1kU0e**buEQSz99Pnt-zbQAA4EOUXGZF0XzUOtV9KyC4AhDBi7-YtrJMM51aXfkvis9WdiLNKi26IWJKqYnQ2MhS1FpW8iz4qVJqETIiqtymw87vDXIiiNmOOSZyPcTYe3aDhasqHrP3t-mMC7nqYz7HySx6dfNktZ96S1NF4UYRa*tPd4tgcx0u7-CtV-bBfSPtyUvuf2VBwnyR2*zJztdCkbBwEjZ5ZDejSS134vyQwzimNmWjuhedkk09ABNhik3r520EjYNxBAFXW8Y_',
    identifier: '900055344',
    identifierNick: '美豆Rt1va'
};

var safelyParseJSON = function (json) {
    var parsed;
    try {
        parsed = JSON.parse(json);
    } catch (err) {
        return null;
    }
    return parsed;
};

var createGiftObj = function(message) {
    var gift = {
        giftContentUrl: message.data.giftContentUrl,
        giftCount: message.data.giftCount,
        giftIconUrl: message.data.giftIconUrl,
        giftId: message.data.giftId,
        giftLabel: message.data.giftLabel,
        giftPrice: message.data.giftPrice,
        giftType: message.data.giftType,
        giftEffect : message.data.giftEffect,
        message : message.data.message
    };

    var data = {
        type: 'gift',
        from: message.data.from,
        to: message.data.to,
        gift: gift
    };
    return data;
}

var imSdkInit = function(onMessageNotify, onSuccess, onError,onDestroy){
    function onApplyJoinGroupRequestNotify(notify) {
        console.info('执行 加群申请： %s', JSON.stringify(notify));
    };

    function onApplyJoinGroupAcceptNotify(notify) {
        console.info('执行 申请加群被同意： %s', JSON.stringify(notify));
    };

    function onDestoryGroupNotify(notify) {
        console.info("执行 解散群 回调： %s", JSON.stringify(notify));
    };

    function jsonpCallback(rspData) {
        webim.setJsonpLastRspData(rspData);
    };


    var onConnNotify = function (resp) {
        switch (resp.ErrorCode) {
            case webim.CONNECTION_STATUS.ON:
                webim.Log.warn('连接状态正常...');
                break;
            case webim.CONNECTION_STATUS.OFF:
                webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
                break;
            default:
                webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
                break;
        };
    };

    var onBigGroupMsgNotify = function(listNewMsg) {
        if (listNewMsg.length < 0) return;
        listNewMsg.forEach(function(newMsg){
            var sender = newMsg.getFromAccountNick();
            var user = safelyParseJSON(sender);
            if (!user) return;

            user.userId = newMsg.getFromAccount();
            var msgContents = newMsg.getElems().map(
                function (elem) {
                    return elem.content.text;
                }
            );

            msgContents.forEach(function(text){
                if (!text) return;
                var data = {
                        type: 'text',
                        from: user,
                        content: text
                    };
                onMessageNotify(data);
            });
            
        })
    }

    var onCustomGroupNotify = function(notify) {
        var message = safelyParseJSON(notify.UserDefinedField);
        if (!message) return;
        var data;
        switch(message.subtype) {
            case 'gift':
                data = createGiftObj(message);
                break;
            case 'leave':
            case 'enter':
                data = {
                    type: message.subtype,
                    user: message.data
                };
                break;
            default:
                data = {
                    type: message.subtype,
                    data: message.data
                };
        }
        if (data) onMessageNotify(data);
    }

    //var onGroupSystemNotifys = {
    //    '1': onApplyJoinGroupRequestNotify,
    //    '2': onApplyJoinGroupAcceptNotify,
    //    '255': onCustomGroupNotify
    //};
    var onGroupSystemNotifys = {
        "1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到）
        "2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到）
        //"3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到）
        //"4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到)
        "5": onDestroy || onDestoryGroupNotify, //群被解散(全员接收)
        //"6": onCreateGroupNotify, //创建群(创建者接收)
        //"7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收)
        //"8": onQuitGroupNotify, //主动退群(主动退出者接收)
        //"9": onSetedGroupAdminNotify, //设置管理员(被设置者接收)
        //"10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收)
        //"11": onRevokeGroupNotify, //群已被回收(全员接收)
        "255": onCustomGroupNotify//用户自定义通知(默认全员接收,暂不支持)
    };

    var listeners = {
        'onConnNotify': onConnNotify,
        'jsonpCallback': jsonpCallback,
        'onBigGroupMsgNotify': onBigGroupMsgNotify,
        'onGroupSystemNotifys': onGroupSystemNotifys,
    };

    webim.login(loginInfo, listeners, {'isLogOn': false}, onSuccess||console.log.bind(console), onError || console.error.bind(console));
};

// enterRoom 需要在sdkinit后才可以调用成功
var enterRoom = function(roomId, onSuccess, onError){
    if(!roomId) {
        cb('非法的房间ID: ' + roomId);
        return;
    }

    var groupId = roomId + '';
    webim.applyJoinBigGroup({'GroupId': groupId}, onSuccess||console.log.bind(console), onError || console.error.bind(console));
};

var leaveRoom = function(roomId, cb){
    if(!roomId) {
        cb('非法的房间ID: ' + roomId);
        return;
    }

    var groupId = roomId + '';
    webim.quitBigGroup({'GroupId': groupId}, onSuccess||console.log.bind(console), onError || console.error.bind(console));
}

var sendMessage = function(roomId, message, onSuccess, onError){
    var cb = cb || console.log;

    if(!message){
        cb('message不能为空');
        return;
    }

    var msgLen = webim.Tool.getStrBytes(message);
    var msgSessType = webim.SESSION_TYPE.GROUP;
    var msgMaxLen = webim.MSG_MAX_LENGTH.GROUP;
    var msgSubType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    if (msgLen > msgMaxLen) {
        cb("消息长度超出限制(最多" + Math.round(msgMaxLen / 3) + "汉字)");
        return;
    }

    var now = Math.round(new Date().getTime() / 1000);
    var selSess = new webim.Session(msgSessType, roomId.toString(), roomId.toString(), "", now);
    var isSend = true;
    var seq = -1;
    var random = Math.round(Math.random() * 4294967296);
    var msgTime = now;
    var Msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, msgSubType, loginInfo.identifierNick);
    var text_obj = new webim.Msg.Elem.Text(message);
    Msg.addText(text_obj);
    webim.sendMsg(Msg,  onSuccess||console.log.bind(console), onError || console.error.bind(console));
};