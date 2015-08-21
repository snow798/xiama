/**
 * Created by Administrator on 2015/8/20.
 * 弹出层
 */

define(['../lib/hammer.min'], function(Hammer){
    function Popup(obj, follow){
        if(typeof obj !== 'string') return false;
        //if(!window['Hammer']){console.log('no Hammer plus!'); return false;}
        var base= this;
        if(typeof follow == 'string'){
            follow= document.querySelector(follow);
        }else{
            follow= false;
        }
        this.obj= document.querySelector(obj);
        this.close_btn= this.obj.querySelector('.popup-return');
        this.head= this.obj.querySelector('.popup-title');
        this.headHeight= this.head.offsetHeight;
        this.content= this.obj.querySelector('.popup-content');
        var parent= this.obj.parentNode;
        var parentsW= parent.offsetWidth? parent.offsetWidth: document.documentElement.clientWidth;

        console.log(42,parentsW);

        this.obj_ev= new Hammer(this.obj);
        this.param={
            width: parentsW,    //不改变
            offsetWidth: parentsW,

            initOffset: 0,
            leftMoveOffset: 0,
            follow: follow,
            followOffLeft: 0,
            followOffEnd: -200
        };
        this.obj.style.opacity= 1;
        this.obj.style['-webkit-transform']= 'translate3d('+this.param.offsetWidth+'px,0,0) translateZ(0)';
        this.obj_ev.on('panstart', function(ev){
            base.obj.style['-webkit-transition-duration']= '0s';
        });
        this.obj_ev.on('panmove', function(ev){
            base.param.leftMoveOffset= base.param.initOffset+ ev.deltaX;
            if(base.param.leftMoveOffset<0) return false;
            base.obj.style['-webkit-transform']= 'translate3d('+base.param.leftMoveOffset+'px,0,0) translateZ(0)';
            //更随元素缓冲动画
            if(base.param.follow){
                base.param.follow.style['-webkit-transition-duration']= '0s';
                var offend= parseInt(base.param.followOffLeft)+ parseInt(ev.deltaX);
                if(offend>0) return false;
                var part= Math.abs(offend/base.param.followOffEnd);
                base.param.follow.style['-webkit-transform']= 'translate3d('+offend*part+'px,0,0) translateZ(0)';
            }
        });
        this.obj_ev.on('panend', function(ev){
            //归位
            var st;
            var move= animationRecycle(ev, base.param.leftMoveOffset, base.param.initOffset, parentsW);
            base.param.leftMoveOffset= move.offw;
            base.obj.style['-webkit-transition-duration']= '0.3s';
            base.obj.style['-webkit-transform']= 'translate3d('+base.param.leftMoveOffset+'px,0,0) translateZ(0)';
            if(move.direc== 1){
                st= base.param.followOffEnd;
            }else if(move.direc== 2){
                st= 0;
            }
            base.param.follow.style['-webkit-transition-duration']= '0.3s';
            base.param.follow.style['-webkit-transform']= 'translate3d('+st+'px,0,0) translateZ(0)';
        });
        this.close_ev= new Hammer(this.close_btn);
        this.close_ev.on('tap', function(ev){
            base.close();
        })
    }
    Popup.prototype.animation= function(){
        this.obj.style['-webkit-transition-duration']= '0.4s';
        this.obj.style['-webkit-transform']= 'translate3d('+this.param.offsetWidth+'px,0,0) translateZ(0)';
        if(this.param.follow){
            this.param.follow.style['-webkit-transition-duration']= '0.4s';
            this.param.follow.style['-webkit-transform']= 'translate3d('+this.param.followOffLeft+'px,0,0) translateZ(0)';
        }
    };
    Popup.prototype.show= function(src, obj){
        this.param.offsetWidth= 0;
        this.param.followOffLeft= this.param.followOffEnd;
        this.animation();
        obj.call(this, src);

    };
    Popup.prototype.close= function(){
        this.param.offsetWidth= this.param.width;
        this.param.followOffLeft= 0;
        this.animation();
    };

    return {
        init: Popup
    }
});
