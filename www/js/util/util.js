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

//动画回收/归位 return init [最终结束坐标点]
function animationRecycle(ev, offW, startW, parentsW){
    var direc= 1;
    if(ev.offsetDirection== 2){
        if(offW> startW-(-parentsW/5*3)){
            offW= startW+parentsW;
            direc= 2;
        }else{
            offW= startW;
            direc= 1;
        }
    }else if(ev.offsetDirection == 4){
        if(offW< startW-parentsW/5*3){
            offW= startW-parentsW;
            direc= 2;
        }else{
            offW= startW;
            direc= 1;
        }
    }else{
        offW= startW;
        direc= 1;
    }
    return {
        offw: offW,
        direc: direc
    };
}



//弹出层





define(['../../lib/hammer.min'], function(Hammer){

    util={
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        getStyle: function (element,attr) {
            if(typeof window.getComputedStyle!='undefined'){
                return parseFloat(window.getComputedStyle(element,null)[attr]);
            }else if(element.currentStyle){
                return parseFloat(element.currentStyle[attr]);
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
                type: 'GET',
                data: {}
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
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    if(fn && fn instanceof Function){
                        if(isJsonp){
                            var data= JSON.parse(xmlHttp.responseText.substring(config.callback.length+1, xmlHttp.responseText.length-1));
                            console.log(3333333333333333,data);
                            fn(data);
                        }else{
                            fn(xmlHttp.responseText);
                        }
                    }
                }
            };

            var serializeParam = function ( param ) {
                if ( !param ) return '';
                var qstr = [];
                for ( var key in  param ) {
                    qstr.push( encodeURIComponent(key) + '=' + encodeURIComponent(param[key]) );
                };
                return  qstr.join('&');
            };
            config.data= serializeParam(config.data);
            xmlHttp.send(config.data);
        }
    };
    window.util= util;

   return {
       init: util
   }
});