/**
 * Created by Administrator on 2015/8/26.
 * 下拉刷新
 */
define(["./util/util", '../lib/hammer.min'], function(util, Hammer){
    var config= {
        isAnimate: true,
        animateContentStyle: false,
        startOff: 0,
        topOffset: -30,
        currentOff: 0,
        scrollObj: '.referrals',
        currentSite: 0,
        status: 0
    };
    config.currentSite= config.topOffset;   //起始位置
    var parentsH= document.documentElement.clientHeight;
    var defaultStyle= function(o){
        o.style.width= '100%';
        o.style.height= '30px';
        o.style.lineHeight= '30px';
        o.style.backgroundColor= '#fff';
        o.style.color= '#50484b';
        o.style.textAlign= 'center';
    };
    var init= function(obj, param){
        if(!obj || typeof obj !== 'string') return false;
        if(param || typeof param == 'object'){
            config= util.extend(config, param);
        }
        config.obj= document.querySelector(obj);
        if(config.isAnimate){
            var topAm= document.createElement('div');
            if(!config.animateContentStyle) defaultStyle(topAm);
            topAm.innerText= '正在刷新...';
            config.obj.insertBefore(topAm, config.obj.childNodes[0]);
            config.obj.style['-webkit-transform']= 'translate3d(0px, -30px, 0px)';
        }
        var touchSlide= function(ev){
            var currentY= ev.deltaY;
            config.currentOff = config.currentSite+ currentY;
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+config.currentOff+'px, 0px)';
            config.status= 1;
        };
        var downRefresh= function(ev){
            /*var currentY= ev.changedPointers[0].clientY;
            config.currentOff= currentY - config.startOff;
            var t= (1-config.currentOff/parentsH);
            var endOff= config.currentOff*t;*/
            var currentY= ev.deltaY;
            currentY= parentsH*(currentY/parentsH*0.3);

            config.obj.style['-webkit-transform']= 'translate3d(0px, '+currentY+'px, 0px)';
            config.status= 0;
        };
        var touch= Hammer(config.obj);
        touch.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        touch.on('panstart', function(ev){
            config.obj.style['-webkit-transition']= '0s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';
            config.startOff= ev.changedPointers[0].clientY;
        });
        touch.on('pandown', function(ev){
            if(config.currentSite >= config.topOffset){
                downRefresh(ev);    //刷新
            }else{
                touchSlide(ev);     //滑动
            }
        });
        touch.on('panup', function(ev){
            touchSlide(ev);
        });
        touch.on('panend', function(ev){
            if(!config.status){
                config.obj.style['-webkit-transition-duration']= '0.3s';
                config.obj.style['-webkit-transform']= 'translate3d(0px,-30px,0) translateZ(0)';
                config.currentSite= config.topOffset;
            }else{
                var ve= ev.velocityY;
                config.currentSite= config.currentOff-(500*ve);
                if(config.currentSite> config.topOffset) config.currentSite= config.topOffset;
                config.obj.style['-webkit-transition']= '0.75s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';
                config.obj.style['-webkit-transform']= 'translate3d(0px, '+config.currentSite+'px, 0px)';
            }
        });
    };
    return {
        init: init
    }
});