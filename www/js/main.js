/**
 * Created by Administrator on 2015/7/3.
 */
require.config({
    paths: {

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

define(["./util/util",'../lib/EventBus','../lib/idangerous.swiper.min','../lib/hammer.min', 'playData', 'play', 'referrals', 'popup'], function(util, t, f,Hammer,  playData, play, referrals, Popup) {
        util= util.init;
        Popup= Popup.init;
        console.log(util, t, playData, play, referrals);
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
        referrals.initref();
//弹出层
        var popup= new Popup('.popup', '.main-sos');
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
            }
        };
        glob_ev.on('tap', function(ev){
            var tag= ev.target;
            var src= tag.getAttribute('data-href');
            if(src){
                if(src.indexOf('http') == 0){
                    popup.show(tag, popupHandle.iframe);
                }
                //popup.show(tag);
            }
        });


    }
);


