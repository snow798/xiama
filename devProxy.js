/*	devProxy.js 0.1
 *	通过将数据请求转发到远程服务器, 来在本地开发环境中模拟服务器环境, 以实现完整的网站功能
 *	脚本执行时会从当前目录载入proxyConfig.js
 *	proxyConfig.js模版参见:
 *
 *	'use strict';
 *	module.exports={
 *
 *		// 远程服务器地址
 *		remote:'https://www.yiqihao.com',
 *
 *		// 以下配置为本地静态文件模式
 *		// 当配置为静态文件模式时, 所有get请求都将优先从本地获取, 若本地找不到对应文件才将请求转发至远程服务器
 *		// 但所有post请求仍会转发至远程服务器
 *		// prefix: root对应的url前缀, 如果请求中不包含此前缀则会被转发至远程服务器(根路径除外)
 *		//         利用这个配置可以实现将 http://www.yiqihao.com/mweb 映射到 root 中指定的 ./
 *		local:{
 *			prefix:'/mweb',
 *			root:'./',
 *			index:'/index.html'
 *		},
 *
 *		// local也可以配置为代理模式, 以便于启用php模版或其他功能
 *		// 当配置为代理模式时, 所有包含query string的get请求和所有post请求都将被转发至远程服务器
 *		//local:'http://somelocalhost:8080',
 *
 *		// 本地监听端口
 *		port:1990
 *	};
 */

'use strict';
var http = require('http');
var https = require('https');
var util = require('util');
var path = require('path');
var fs = require('fs');
var dir = process.argv.length > 2 ? process.argv[2] : process.cwd();
var config = require(path.join(dir, 'proxyConfig.js'));
console.log(config);

config.remote = parseServer(config.remote);

if (typeof config.local === 'string') {
	config.local = parseServer(config.remote);
} else {
	if (!config.local.prefix) {
		config.local.prefix = '/';
	}
}

var mimes = {
	'': 'application/octet-stream',
	'html': 'text/html',
	'js': 'text/javascript',
	'css': 'text/css',
	'jpg': 'image/jpeg',
	'png': 'image/png',
	'gif': 'image/gif',
	'svg': 'image/svg+xml'
};

http.createServer(function(req, res) {
	if ((req.url.indexOf('?') > 0 && config.local instanceof Array) || req.method === 'POST' || (req.url !== '/' && req.url.indexOf(config.local.prefix) !== 0)) {
		httpproxy(req, res, true);
	} else {
		if (config.local instanceof Array) {
			httpproxy(req, res, false);
		} else {
			staticfile(req, res);
		}
	}
}).listen(config.port, '0.0.0.0');

function staticfile(req, res) {
	var u = req.url.replace(/\?.*$/, '');
	if (u === '/') {
		u = config.local.prefix + config.local.index;
	}
	var p, v = u.indexOf(config.local.prefix);
	if (v < 0) {
		httpproxy(req, res, true);
	} else {
		p = path.join(dir, config.local.root, u.substr(v + config.local.prefix.length));
		fs.stat(p, function(err, stat) {
			if (err) {
				httpproxy(req, res, true);
			} else {
				if (stat.isDirectory()) {
					httpproxy(req, res, true);
				} else {
					var m = mimes[path.extname(p).substr(1)];
					if (!m) {
						m = mimes[''];
					}
					var f = fs.createReadStream(p);
					res.writeHeader(200, 'OK', {
						'Content-Type': m,
						'Content-Length': stat.size,
						'Last-Modified': stat.mtime,
						'Referer': 'http://m.xiami.com/'
					});
					f.pipe(res);
					console.log('static: ' + req.url);
				}
			}
		});
	}
}

function httpproxy(req, res, isremote) {
	
	var h, n, proxy, info = {
			path: req.url,
			method: req.method
		};
	if (isremote) {
		info.host = config.remote[1];
		info.port = config.remote[2];
		h = config.remote[0];
	} else {
		info.host = config.local[1];
		info.port = config.local[2];
		h = config.local[0];
	}
	proxy = h.request(info, function(res2) {
		var cookie = res2.headers['set-cookie'];
		var bf, pos;
		if (cookie instanceof Array) {
			for (var i = 0; i < cookie.length; i++) {
				cookie[i] = cookie[i].replace(/; domain=[^;]+/, '');
			}
		}
		delete res2.headers['access-control-allow-origin'];
		
		res.writeHeader(res2.statusCode, res2.headers);
		res2.pipe(res);
		console.log((isremote ? 'remote: ' : 'local: ') + req.url);
	});
	proxy.on('error', function(err) {
		console.log(err);
		res.end();
	});
	for (n in req.headers) {
		if (['host', 'origin', 'referer'].indexOf(n) < 0) {
			//console.log(n + ': ' + req.headers[n]);
			proxy.setHeader(n, req.headers[n]);
		}
		//console.log(n);
	}
    proxy.setHeader('referer','http://m.xiami.com/');
	req.pipe(proxy);
}

function parseServer(str) {
	var r = str.match(/^http(s?):\/\/([^\/:]+)(?::(\d+))?/);
	if (r) {
		delete r.index;
		delete r.source;
		r.shift();
		r[2] = r[2] ? parseInt(r[2]) : r[0] ? 443 : 80;
		r[0] = r[0] ? https : http;
	}
	return r;
}