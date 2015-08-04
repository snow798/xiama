/**
 * Copyright © kacper.wang 
 * http://jaywcjlove.github.io
 */
;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.cookie = factory();
    }
}(this, function(root, undefined) {
	var Cookie = {
		cookieAPI:{
			get: function(name){
				var nameEQ = name + "=";    
				var ca = document.cookie.split(';');//把cookie分割成组    
				for(var i=0;i < ca.length;i++) {    
					var c = ca[i];//取得字符串    
					while (c.charAt(0)==' ') {//判断一下字符串有没有前导空格    
						c = c.substring(1,c.length);//有的话，从第二位开始取    
					}    
					if (c.indexOf(nameEQ) == 0) {//如果含有我们要的name    
						return unescape(c.substring(nameEQ.length,c.length));//解码并截取我们要值    
					}    
				}    
				return false;
			},
			set: function(name, value, options){
				if (Cookie.isPlainObject(name)) {
					for (var k in name) {
						if (name.hasOwnProperty(k)) this.set(k, name[k], value);
					}
				}else{
					var opt = Cookie.isPlainObject(options) ? options : { expires: options },
						expires = opt.expires !== undefined ? opt.expires : '',
			    		expiresType = typeof(expires),
			    		path = opt.path !== undefined ? ';path=' + opt.path : ';path=/',
			    		domain = opt.domain ? ';domain=' + opt.domain : '',
			    		secure = opt.secure ? ';secure' : '';

			    	//过期时间
					if (expiresType === 'string' && expires !== '') expires = new Date(expires);
					else if (expiresType === 'number') expires = new Date(+new Date + 1000 * 60 * 60 * 24 * expires);
					if (expires !== '' && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();


					document.cookie = name+"="+escape(value)+expires+path+domain+secure;   //转码并赋值    
				}
			},
			remove: function(names){
				names = Cookie.isArray(names) ? names : Cookie.toArray(arguments);
				for (var i = 0, l = names.length; i < l; i++) {
					this.set(names[i], '', -1);
				}
				return names;  
			},
			clear: function(name){
				return this.remove(Cookie.getKeys(this.all()));
			},
			all:function () {
				if (document.cookie === '') return {};
				var cookies = document.cookie.split('; '),result = {};
				for (var i = 0, l = cookies.length; i < l; i++) {
					var item = cookies[i].split('=');
					result[unescape(item[0])] = unescape(item[1]);
				}
				return result;
			}
		},
		getKeys: Object.names || function (obj) {
			var names = [],name = '';
			for (name in obj) {
				if (obj.hasOwnProperty(name)) names.push(name);
			}
			return names;
		},
		isPlainObject:function (value) {
			return !!value && Object.prototype.toString.call(value) === '[object Object]';
		},
		isArray:function (value) { return value instanceof Array },
		toArray:function (value) {
			return Array.prototype.slice.call(value);
		}
	}
	cookie=function (name, value, options){
		console.log(this)
		var argm = arguments,
		_cookie=function(){
			if (argm.length === 0) return cookie.clear();
        	if (Cookie.isPlainObject(name) || (argm.length>1&&name&&value))
        		return cookie.set(name, value, options);
        	if (value === null) return cookie.remove(name);
        	if (argm.length === 1) return cookie.get(name);
        	return cookie.all();
		}
		return _cookie()
	}
	for (var a in Cookie.cookieAPI) cookie[a]=Cookie.cookieAPI[a];
    return cookie
}));