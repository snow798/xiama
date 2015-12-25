/**
 * Created by Administrator on 2015/8/26.
 * 下拉刷新
 */
define(["js/util/util", 'lib/hammer.min'], function(util, Hammer){
    util= util.init;
    var config= {
        isAnimate: true,
        animateContentStyle: false,
        startOff: 0,
        topOffset: -30,
        currentOff: 0,
        scrollObj: '.referrals',
        currentSite: 0,
        contentEle: 0,             //内容元素
        contentHeight: 1,          //内容高度
        bufferCoefficient: 0.3,    //缓冲系数
        isScrollLoad: false,       //是否在加载
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
        config.contentEle= config.obj.children[0];
        config.contentHeight= config.contentEle.offsetHeight;
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
            var currentY= ev.deltaY;
            currentY= parentsH*(currentY/parentsH*config.bufferCoefficient);
            config.obj.style['-webkit-transform']= 'translate3d(0px, '+currentY+'px, 0px)';
            config.status= 0;
        };
        var scrollLoad= function(){
            config.contentHeight= config.contentEle.offsetHeight;
            if(Math.abs(config.currentSite-120)>= parseInt(config.contentHeight) && !config.isScrollLoad){
                if(config.scrollEnd){
                    config.scrollEnd();
                    config.isScrollLoad= true;    //滑动过程中只触发一次请求
                }
            }
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
            scrollLoad();
            //config.contentHeight= config.contentEle.offsetTop;
            //console.log(config.contentHeight, config.contentEle.offsetTop);
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
            scrollLoad();
            config.isScrollLoad= false;
        });
    };
    return {
        init: init
    }
});