/**
 * Created by Administrator on 2015/8/26.
 * 下拉刷新
 */
define(["./util/util", '../lib/hammer.min'], function(util, Hammer){
    var config= {
        isAnimate: true,
        animateContentStyle: false,
        startOff: 0,
        topOff: 0,
        currentOff: 0
    };
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

        var touch= Hammer(config.obj);
        touch.on('panstart', function(ev){
            console.log(ev);
            config.obj.style['-webkit-transition-duration']= '0s';
            config.startOff= ev.changedPointers[0].clientY;
        });
        touch.on('panmove', function(ev){
            var currentY= ev.changedPointers[0].clientY;
            config.currentOff= currentY - config.startOff;
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+config.currentOff+'px, 0px)';

           // console.log(ev.changedPointers[0].target)
        });
        touch.on('panend', function(ev){
            config.obj.style['-webkit-transition-duration']= '0.3s';
            config.obj.style['-webkit-transform']= 'translate3d(0px,-30px,0) translateZ(0)';
        });
        console.log(config)
    };
    return {
        init: init
    }
});