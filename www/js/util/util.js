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
                        console.log(data)
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