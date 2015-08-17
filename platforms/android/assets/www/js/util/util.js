/**
 * Created by Administrator on 2015/7/3.
 */

function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}
var hasClass, addClass, removeClass;
if ( 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
        return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
        elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
        elem.classList.remove( c );
    };
}
else {
    hasClass = function( elem, c ) {
        return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
        if ( !hasClass( elem, c ) ) {
            elem.className = elem.className + ' ' + c;
        }
    };
    removeClass = function( elem, c ) {
        elem.className = elem.className.replace( classReg( c ), ' ' );
    };
}
function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
}

//水平滑动分页
function smoothness(obj,initPage, parentsWidth){
    if(typeof obj !== 'string') return false;
    var currentObj= document.querySelector(obj);
    var parentsW= parentsWidth? parentsWidth: document.documentElement.clientWidth;
    if(!window['Hammer']){console.log('no Hammer plus!'); return false;}
    var base= this;
    var currentObj_ev= new Hammer(currentObj);
    this.currentPage= initPage? initPage: 0;     //当前页
    this.leftOffset= -currentPage* parentsW;     //当前偏移

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

//弹出层
function Popup(obj, follow){
    if(typeof obj !== 'string') return false;
    if(!window['Hammer']){console.log('no Hammer plus!'); return false;}
    var base= this;
    follow= typeof follow == 'string' ? follow: false;
    this.obj= document.querySelector(obj);
    this.close_btn= this.obj.querySelector('.popup-title');
    var parent= this.obj.parentNode;
    var parentsW= parent.offsetWidth? parent.offsetWidth: document.documentElement.clientWidth;

    console.log(42,parentsW);

    this.obj_ev= new Hammer(this.obj);
    this.param={
        width: parentsW,
        offsetWidth: parentsW,
        leftMoveOffset:0,
        follow: follow
    };
    this.obj.style['-webkit-transform']= 'translate3d('+this.param.offsetWidth+'px,0,0) translateZ(0)';
    /*obj_ev.on('panstart', function(ev){

    });
    obj_ev.on('panmove', function(ev){
        base.param.leftMoveOffset= base.param.initOffset+ ev.deltaX;
        obj.style['-webkit-transform']= 'translate3d('+base.param.leftMoveOffset+'px,0,0) translateZ(0)';
    });
    obj_ev.on('panend', function(ev){

    })*/
    this.close_ev= new Hammer(this.close_btn);
    this.close_ev.on('tap', function(ev){
        base.close();
    })
}
Popup.prototype.show= function(){
    console.log(66,this.param.follow);
    this.obj.style['-webkit-transition-duration']= '0.4s';
    this.obj.style['-webkit-transform']= 'translate3d(0px,0,0) translateZ(0)';
    if(this.param.follow){
        var obj_see= document.querySelector(this.param.follow);
        obj_see.style['-webkit-transition-duration']= '0.4s';
        obj_see.style['-webkit-transform']= 'translate3d(-100px,0,0) translateZ(0)';
    }
};
Popup.prototype.close= function(){
    this.obj.style['-webkit-transition-duration']= '0.4s';
    this.obj.style['-webkit-transform']= 'translate3d('+this.param.offsetWidth+'px,0,0) translateZ(0)';
    if(this.param.follow){
        var obj_see= document.querySelector(this.param.follow);
        obj_see.style['-webkit-transition-duration']= '0.4s';
        obj_see.style['-webkit-transform']= 'translate3d(0px,0,0) translateZ(0)';
    }
};



util={
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    getStyle: function (element,attr) {
        if(typeof window.getComputedStyle!='undefined'){
            return window.getComputedStyle(element,null)[attr];
        }else if(element.currentStyle){
            return element.currentStyle[attr];
        }
    },
    extend: function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    },
    loadJs: function(url, fn){
        var head= document.head;
        var ele= document.createElement('script');
        ele.src= url;
        head.appendChild(ele);
        if(fn instanceof Function){
            ele.addEventListener('load', function(){
                fn()
            }, false)
        }
    },
    ajax: function(url, fn, ops){
        var isJsonp= false;
        if(typeof url !== "string") return false;
        var config= {
            type: 'GET'
        };


        if(ops && ops instanceof Object){
            util.extend(config, ops);
        }


        if(typeof config.callback == 'string' && config.callback.length>0){
            isJsonp= true;
            if(url.indexOf('?')>-1){
                url += '&callback='+config.callback;
            }else{
                url += '?callback='+config.callback;
            }
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(config.type, url);

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                if(fn && fn instanceof Function){
                    if(isJsonp){
                        var data= JSON.parse(xmlHttp.responseText.substring(config.callback.length+1, xmlHttp.responseText.length-1));
                        console.log(data);
                        fn(data);
                    }else{
                        fn(xmlHttp.responseText);
                    }

                }
            }
        };

        xmlHttp.send(null);
    }
};
window.util= util;