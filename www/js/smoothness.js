/**
 * Created by Administrator on 2015/8/20.
 * smoothness
 */

define(['../lib/hammer.min'], function(Hammer){
    //水平滑动分页
    function smoothness(obj,initPage, parentsWidth){
        if(typeof obj !== 'string') return false;
        var currentObj= document.querySelector(obj);
        var parentsW= parentsWidth? parentsWidth: document.documentElement.clientWidth;
        //if(!window['Hammer']){console.log('no Hammer plus!'); return false;}
        var base= this;
        var currentObj_ev= new Hammer(currentObj);
        this.currentPage= initPage? initPage: 0;     //当前页
        this.leftOffset= -this.currentPage* parentsW;     //当前偏移

        this.param= {
            started: 0,
            currentMovePage: 0,     //当前页
            initOffset: 0,          //默认偏移
            leftMoveOffset: 0       //当前偏移
        };
        //初始化偏移位置
        currentObj.style['-webkit-transform']= 'translate3d('+this.leftOffset+'px,0,0) translateZ(0)';
        currentObj.style['-webkit-transition-timing-function']= 'ease-out';

        currentObj_ev.on('panstart', function(ev){

            currentObj.style['-webkit-transition-duration']= '0s';
            base.param.currentMovePage= base.currentPage;
            base.param.initOffset= base.leftOffset;
            base.param.started= 1;
        });
        currentObj_ev.on('panmove', function(ev){
            if(!(ev.offsetDirection== 2 || ev.offsetDirection == 4)) return false;
            base.param.leftMoveOffset= base.param.initOffset+ ev.deltaX;
            if(base.param.leftMoveOffset>0 || base.param.leftMoveOffset<-parentsW*2){   //是否超出边界
                base.param.started= -1;
                return false;
            }
            currentObj.style['-webkit-transform']= 'translate3d('+base.param.leftMoveOffset+'px,0,0) translateZ(0)';
        });
        currentObj_ev.on('panend', function(ev){
            if(base.param.started== -1){
                return false;
            }
            base.param.started= 0;
            //归位
            if(ev.offsetDirection== 2){
                if(base.param.leftMoveOffset> base.param.initOffset-(-parentsW/5*3)){
                    base.param.leftMoveOffset= base.param.initOffset+parentsW;
                    base.leftOffset= base.param.leftMoveOffset;
                }else{
                    base.param.leftMoveOffset= base.param.initOffset;
                }
            }else if(ev.offsetDirection == 4){
                if(base.param.leftMoveOffset< base.param.initOffset-parentsW/5*3){
                    base.param.leftMoveOffset= base.param.initOffset-parentsW;
                    base.leftOffset= base.param.leftMoveOffset;
                }else{
                    base.param.leftMoveOffset= base.param.initOffset;
                }
            }else{
                base.param.leftMoveOffset= base.param.initOffset;
            }
            currentObj.style['-webkit-transition-duration']= '0.3s';
            currentObj.style['-webkit-transform']= 'translate3d('+base.param.leftMoveOffset+'px,0,0) translateZ(0)';
        });
    }

    return {
        init: smoothness
    }
});
