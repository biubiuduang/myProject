/**
 * Created by Jacky.Wang on 2016/12/1.
 */

/**
 * 一.全局参数 sd
 * 二.全局方法 base
 * 三.公共方法 sdFun
 * */
//一.全局参数
var sd = {
    u : navigator.userAgent,     //用户浏览器代理商
    ww : $(window).width(),     //用户窗口高度
    wh : $(window).height(),     //用户窗口高度
    st : 0   //滚动条距离顶部的距离
};
//二.全局方法
var base = {
    init : function(){
        var that = this;
        that.fontSizeRem();  //rem
        that.superDIcon();   //icon
        //that.commonPart();  //公共的头部顶部
        that.imgLoad();       //img按需加载
    },
    //屏幕宽度小于 768px 长度单位使用rem , 1rem = 屏幕宽度/18;
    fontSizeRem : function(){
        rem();
        $(window).resize(function(){
            rem();
        });
        function rem(){
            if(sd.ww<768){
                var size = sd.ww/18;
                $("html").css("font-size",size);
            }
        }
    },
    //所有页面加入页面icon
    superDIcon : function(){
        $("head").append(
            "<link href='themes/superd/img/sprites/icon.png' rel='icon'>" +
            "<link href='themes/superd/img/sprites/icon.png' rel='shortcut icon'>"
        );
    },
    //includ公共的header  footer
    commonPart : function(){
        sdFun.includePage("#J_header","../include/header.html");
        sdFun.includePage("#J_footer","../include/footer.html");
    },
    //图片的懒加载(页面优化 减少页面加载的线程 加快页面加载速度)
    //用法 <img src="" alt="" data-src="当前img的路径" />
    imgLoad : function(){
        imgOnload();
        $(window).scroll(function(){
            sd.st = $(window).scrollTop();
            imgOnload();
        });
        function imgOnload(){
            $("img").each(function(){
                if($(this).attr("src") == ""){
                    var h = $(this).offset().top+$(this).height()/2;
                    if( h < (sd.wh+sd.st) ){
                        $(this).attr("src",$(this).attr("data-src"));
                    }
                }
            })
        }
    }


};



//三.公共方法 function

var sdFun = {}; //公共方法集合

/**
 * 1. include()
 * jQuery实现include方法
 * @param id 目标元素ID
 * @param path include文件路径
 */

sdFun.includePage = function( id, path ){
    $.get( path,function( data ){
        ( $( data ) ).appendTo( $( id ) );
    });
};

$(function(){
    sd.st = $(window).scrollTop();
    base.init();
});