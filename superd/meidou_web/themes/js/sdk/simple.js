// enter/leave message

// { 
//     type: 'enter',
//     user: {
//         userId: 380398,
//         nickName: '国士无双',
//         avatarUrl: 'http://q.qlogo.cn/qqapp/1105452330/AFDB0CD12D9C1489064D07908BE3C9CD/100',
//         level: 1,
//         verifiedMode: 0,
//         verifiedMessage: '',
//         gender: 'male',
//         isPerformer: false,
//         isRobot: false,
//         totalCount: 99,
//         effect: 'none',
//         sendTime: 1487913777,
//         GroupId: '360392'
//     } 
// }

// gift message

// { 
//     type: 'gift',
//     from: {
//         userId: 304863,
//         nickName: '贝勒爷ヽ',
//         avatarUrl: 'http://meidou-10028005.image.myqcloud.com/1487599911271',
//         level: 10,
//         verifiedMode: 1,
//         verifiedMessage: '隔壁老王',
//         gender: 'male',
//         isPerformer: true,
//         isRobot: false 
//     },
//     to: {
//         userId: 349651,
//         nickName: '非了个典',
//         avatarUrl: 'http://meidou-10028005.image.myqcloud.com/1487850843928',
//         level: 27,
//         verifiedMode: 1,
//         verifiedMessage: '人妻',
//         gender: 'female',
//         isPerformer: true,
//         isRobot: false
//     },
//     gift: {
//         giftContentUrl: 'http://meidou-10028005.image.myqcloud.com/1486785407609',
//         giftCount: 1,
//         giftIconUrl: 'http://meidou-10028005.image.myqcloud.com/1486785407609',
//         giftId: '589e8b8b7cf3c98d0464cd32',
//         giftLabel: '干杯',
//         giftPrice: 6,
//         giftType: 'common'
//     } 
// }


// text message

// {
//     type: 'text',
//     from: {
//         nickName: '(→_→)~S哥👽💤',
//         gender: 'male',
//         verifiedMode: 0,
//         isPerformer: true,
//         level: 7,
//         userId: '359399'
//     },
//     content: '我睡了啊'
// }

// 弹幕
// { type: 'server',
//   subtype: 'danmaku',
//   data: 
//    { userId: 302022,
//      nickName: '我爱一条柴',
//      avatarUrl: 'http://meidou-10028005.image.myqcloud.com/1492061310354',
//      level: 6,
//      verifiedMode: 0,
//      verifiedMessage: '',
//      gender: 'male',
//      isPerformer: false,
//      isRobot: false,
//      ure: 1,
//      message: '我是弹幕消息',
//      sendTime: 1492061437,
//      GroupId: '300451'
//     }
// }


// 消息处理回调
var onMessageNotify = function(message){
    switch (message.type) {
        case 'enter':
            var user = message.user;
            var msg =  user.level + ' ' +  user.nickName + ' 进入房间';
            alert(msg);
            break;
        case 'leave':
            var user = message.user;
            var msg =  user.level + ' ' +  user.nickName + ' 离开房间';
            alert(msg);
            break;
        case 'text':
            var user = message.from;
            var msg = user.nickName + ': ' + message.content;
            alert(msg);
            break;
        case 'gift':
            var gift = message.gift;
            var sender = message.from;
            var msg = sender.nickName + ' 送出'  + gift.giftCount +  gift.giftLabel;
            alert(msg);
            break;
        default:
            break;
    }

};

// 页面加载时调用该函数，初始化imsdk, imsdk在收到消息后，回调onMessageNotify
imSdkInit(onMessageNotify);


//sdklogin后，才进入直播间
enterRoom(300400)