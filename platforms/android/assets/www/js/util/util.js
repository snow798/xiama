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
    }
};
window.util= util;