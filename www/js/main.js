/**
 * Created by Administrator on 2015/7/3.
 */

require.config({
    baseUrl: '/www',
    paths: {
        js: "js",
        lib: "lib",
        xscroll: 'lib/XScroll/cmd'
    },
    shim: {
       'EventBus': {
           exports: 'EventBus'
       },
        'idangerous.swiper.min': {
            exports: 'Swiper'
        },
        'hammer.min': {
            exports: 'Hammer'
        }
    }
});
requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }
    alert(err.toString());
    throw err;

}
alert(22)
/*define(function(require, exports, module){
    var t= require('xscroll/xscroll');
})*/

define(function(require, exports, module) {
        alert(444444444555);
        var util= require('js/util/util');
        var t= require('lib/EventBus');
        var f= require('lib/idangerous.swiper.x');
        var Hammer= require('lib/hammer.min');
        var playData= require('js/playData');
        var play= require('js/play');
        var referrals= require('js/referrals');
        var Popup= require('js/Popup');
        var dropDownRefresh= require('js/dropDownRefresh');
        var shortDownRefresh= require('js/shortDownRefresh');
        var smoothness= require('js/smoothness');
        util= util.init;
        Popup= Popup.init;
        //console.log(util, t, playData, play, referrals);
        console.log(dropDownRefresh);
        window.app= app= {
            module: {},
            currentMusic: {     //当前播放信息
                nowID: 0,
                preID: 0,
                nextID: 0,
                listName: ''
            },
            musicList:{
                newMusicList:{
                    $$location: 0
                }
            },
            musicSrc: 'http://172.16.7.100:4000/ko/xiama/www/'
        };
        var initApp= function(){
            return window.app= util.extend(window.app, {
                w: window.innerWidth,
                h: window.innerHeight,
                platform: (function(){
                    var webview= false;
                    var p= '';
                    if(window.navigator.platform.indexOf('arm')>-1){
                        webview= true;
                        p= 'arm';
                    }
                    return {
                        webview: webview,
                        plat: p
                    }
                })()
            });
        };
        initApp();
        window.addEventListener('resize', function(){
            location.reload();
            initApp();
        });
        window.addEventListener('resize', function(){
            for(var i in app.module){
                app.module[i].init();
            }
        });

        var audio = window.audio= new Audio();
        var bus = window.bus= new EventBus();
        var bus_play= window.bus_play= bus.branch('$play');   //用于播放信息传递
        playData.initData();
        play.initPlay();
        referrals.init();
//弹出层
        var popup= new Popup('#popup-main', '.main-sos');
        var popup_album= new Popup('#popup-album', '.main-sos');
        var glob_event= document.querySelector('.main-sos');
        var glob_ev= new Hammer(glob_event);

        var popupHandle={
            iframe: function(tag){
                this.obj.style['z-index']= '150';
                var iframe= document.createElement('iframe');
                iframe.src= tag.getAttribute('data-href');
                iframe.frameborder= '0';
                iframe.style.height= app.h - this.headHeight + 3 +'px';
                this.content.innerHTML= '';
                this.content.appendChild(iframe);
                console.log(7788, this, tag)
            },
            album1: function(tag){

            }
        };
        var rulesparse= function(ev){
            console.log(ev, ev.target)
            var tag= ev.target;
            var popupType= tag.getAttribute('data-popupType');
            var src= tag.getAttribute('data-href');
            if(!src) return false;
            if(popupType == 'album'){
                popup_album.show(tag, popupHandle.album1);
                return true;
            }
            if (src.indexOf('http') == 0) {
                popup.show(tag, popupHandle.iframe);
            }
        };
        glob_ev.on('tap', function(ev){
            rulesparse(ev);
                //popup.show(tag);
        });
        //banner 独立处理
        var bannerItems= document.querySelectorAll('.swiper-slide img');
        for(var n in bannerItems){
            if(bannerItems[n].nodeType == 1){
                bannerItems[n].addEventListener('click', function(ev){
                    rulesparse(ev);
                }, false)
            }
        }


/*dropDownRefresh.init('#mid-refresh',{
            scrollEnd: referrals.getRef_data
        });*/

        //水平滑动
        smoothness.init('.sos-show', 1);

        shortDownRefresh.init('.myMusic');


        /*document.querySelector('.swiper-slide img').addEventListener('touchstart', function(){
        }, false)*/

    }
);


