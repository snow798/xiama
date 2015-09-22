/**
 * Created by Administrator on 2015/9/11.
 */
define(['../lib/hammer.min'], function(Hammer){
    var init= function(touchObj){
        if(typeof touchObj !== 'string') return false;
            var parentsH= document.documentElement.clientHeight;
            var main_obj= document.querySelector(touchObj);
           // var main_ev= new Hammer(main_obj);
        var config= {
            currentSite: 0,
            currentOff: 0,
            obj: main_obj,
            status: 0,
            bufferCoefficient: 0.3    //缓冲系数
        };
        var starX, starY, currentX, currentY;
        /*var touchSlide= function(ev){
            var currentY= ev.deltaY;
            currentY= parentsH*(currentY/parentsH*config.bufferCoefficient);   //
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+currentY+'px, 0px)';
            config.status= 1;
        };

        main_ev.on('panstart', function(ev){
            main_obj.style['-webkit-transition']= '0s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';

        });
        main_ev.on('panmove', function(ev){
            touchSlide(ev);
        });
        main_ev.on('panend', function(ev){

            //位置回收
            config.obj.style['-webkit-transition']= '0.25s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+config.currentSite+'px, 0px)';
           // config.obj.style['overflow-y']= 'scroll';
        });*/
        main_obj.style['touch-action']= 'pan-x pan-y';
        main_obj.style['-webkit-user-select']= 'none';
        main_obj.style['-webkit-user-drag']= 'none';
        main_obj.style['-webkit-tap-highlight-color']= 'rgba(0, 0, 0, 0)';
        var touchSlide= function(ev){
            currentX= ev.changedTouches[0].pageX - starX;
            currentY= ev.changedTouches[0].pageY - starY;
            if(currentY < 0 ){
                currentY= 0;
            }
            currentY= parentsH*(currentY/parentsH*config.bufferCoefficient);
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+currentY+'px, 0px)';
            config.status= 1;
        };
        main_obj.addEventListener('touchstart', function(ev){
            config.obj.style['-webkit-transition']= '0s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';
            starX= ev.changedTouches[0].pageX;
            starY= ev.changedTouches[0].pageY;
        }, false);
        main_obj.addEventListener('touchmove', function(ev){
            touchSlide(ev);
        }, false);
        main_obj.addEventListener('touchend', function(ev){
            //动作回收
            config.obj.style['-webkit-transition']= '0.5s cubic-bezier(0.333333, 0.666667, 0.666667, 1) 0s';
            config.obj.style['-webkit-transform']= 'translate3d(0px, 0px, 0px)';
        }, false);
    };
    return {
        init: init
    }
});