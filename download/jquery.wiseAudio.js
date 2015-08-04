/**
 * wiseAudio V 1.0 - Based on HTML5 audio player
 *
 * Author	:WISE.KIM
 * Date		:2014/12/18
 * E-mail	:129@jinzhe.net
 * Demo 	:http://jinzhe.net/demo/wiseSlider/
 */
(function($){
	var isTouch = ('ontouchstart' in window),click = isTouch ? 'touchstart' : 'click';
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	var hash=location.hash;
	$.wiseAudio=function(options){
		var options=$.extend({
			keyboard:true,
			autoplay:true,
			loop:true,
			mode:'list',//list random
			volume:10, //1~10
			bind:{
				play:".play",
				pause:".pause",
				next:".next"
			},
			list:function(){},
			oninit:function(){},
			onend:function(){},
			onplay:function(){},
			onpause:function(){},
			onstop:function(){},
			onvolume:function(){},
			onprev:function(){},
			onnext:function(){},
		},options);
		var $audio=$("<audio />"),audio={},data=[],dataLength=0;
		audio.current=0;
		// 初始化
		audio.init=function(){
			$($audio).appendTo('body');
			audio.load(function(json){
		    	if(options.list)options.list(options,audio,json);
			    if(isTouch)options.autoplay=false;
				if(options.autoplay){
					if(options.mode=='random'){
						if($.trim(hash)!=''){
							hash=hash.replace("#!","");
							console.log(hash);
							audio.current=$(".playlist[data-title^='"+hash+"']").data("id");
						}else{
							audio.current=Math.ceil(Math.random()*(dataLength-1));	
						}
					}
					audio.set();
					audio.play();
					if(options.list)$(".playlist[data-id='"+audio.current+"']").addClass("active");
				}
				audio.volume(options.volume);
				if(options.loop){
				    $audio.on("ended",function () {
			        	audio.next();
			    	});
				}
		    	if(options.bind.play){
			    	$(document).on("click",".play",function(){
			    		audio.play();
			    	});
		    	}
		    	if(options.bind.pause){	
			    	$(document).on("click",".pause",function(){
			    		audio.pause();
			    	});
		    	}
		    	if(options.bind.next){
			    	$(document).on("click",".next",function(){
			    		audio.next();
			    	});
			    }
			    if(options.list){
					$(document).on("click",".playlist:not(.active)",function(){
						var $this=$(this);
							$(".playlist.active").removeClass("active");
							$this.addClass("active");
						audio.current=$this.data("id");
						audio.set();
						audio.play();
					});
				}
				if(options.keyboard){
					$(document).keydown(function(e){
						if(e.keyCode==38||e.keyCode==37){
			 				audio.prev();
						}else if(e.keyCode==40||e.keyCode==39){
							audio.next(); 
						}					
					});
				}
			    // 音频进度条事件（进度增加）
			    $(document).on("click",".playlist.active~.progress",function (e) {
			    	var $this=$(this);
					var width=$this.width();
			        var left=$this.offset().left;
			        var current = e.clientX - left;
			        $this.find("span").css("width",current);//改变进度UI
			        $audio[0].currentTime = (current/width) * $audio[0].duration;
			    });
			});
			options.oninit(audio);
		};
		// 加载数据
		audio.load=function(callback){
			$.getJSON(options.data,function(json){
				data=json;
				dataLength=json.length;
				if(options.mode=='random')data=audio.shuffle(data);
				callback(data);
			});
		};
		//随机改变数组的排序
		audio.shuffle = function(array) {
		    for (var rnd, tmp, i = array.length; i; rnd = parseInt(Math.random() * i), tmp = array[--i], array[i] = array[rnd], array[rnd] = tmp);
		    return array;
		};
		// 寻找上一个音乐
		audio.prev=function(){
			if(options.mode=='list'){
				audio.current--;
				if(audio.current<0)audio.current=(dataLength-1);
			}else if(options.mode=='random'){
				audio.current=Math.ceil(Math.random()*(dataLength-1));
			}
			console.log(audio.current)
			audio.set();
			audio.play();
			options.onprev(audio);
			if(options.list){
				$(".playlist.active").removeClass("active");
				$(".playlist[data-id='"+audio.current+"']").addClass("active");	
			}
		};
		// 寻找下一个音乐
		audio.next=function(){
			if(options.mode=='list'){
				audio.current++;
				if(audio.current>=dataLength)audio.current=0;
			}else if(options.mode=='random'){
				audio.current=Math.ceil(Math.random()*(dataLength-1));
			}
			audio.set();
			audio.play();
			options.onnext(audio);
			if(options.list){
				$(".playlist.active").removeClass("active");
				$(".playlist[data-id='"+audio.current+"']").addClass("active");	
			}
		};
		// 音乐频谱
		// audio.spectrum=function(url){
		// 	var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
		// 	    xhr.open('GET', url, true);
		// 	    xhr.withCredentials = true;
		// 	    xhr.responseType = 'arraybuffer';
		// 	    xhr.onload = function(e) { //下载完成
		// 			var canvas = document.getElementById('spectrum');
		//             var fr = new FileReader();
		// 	            fr.onload = function(e) {
		// 					var audioContext = new AudioContext();
		// 		   			if (audioContext === null) {
		// 		                return;
		// 		            };
		// 		    		audioContext.decodeAudioData(fileResult, function(buffer) {
		// 						var audioBufferSouceNode = audioContext.createBufferSource(),
		// 						 	analyser = audioContext.createAnalyser(),
		// 						 	that = this;
		// 					        //connect the source to the analyser
		// 					        audioBufferSouceNode.connect(analyser);
		// 					        //connect the analyser to the destination(the speaker), or we won't hear the sound
		// 					        analyser.connect(audioContext.destination);
		// 					        //then assign the buffer to the buffer source node
		// 					        audioBufferSouceNode.buffer = buffer;
		// 					        //play the source
		// 					        if (!audioBufferSouceNode.start) {
		// 					            audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
		// 					            audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOn method
		// 					        };
		// 					        audioBufferSouceNode.start(0);
		// 					        // end
		// 					        audioBufferSouceNode.onended = function() {
		// 						        if (this.forceStop) {
		// 						            this.forceStop=false;
		// 						            return false;
		// 						        };
		// 						        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		// 					        };
		// 					        //stop the previous sound if any
		// 					        if (this.source !== null) {
		// 					            this.forceStop = true;
		// 					            this.source.stop(0);
		// 					        }
		// 					        this.source = audioBufferSouceNode;
							 
		// 					        var canvas = document.getElementById('spectrum'),
		// 					            cwidth = canvas.width,
		// 					            cheight = canvas.height - 2,
		// 					            meterWidth = 10, //width of the meters in the spectrum
		// 					            gap = 2, //gap between meters
		// 					            capHeight = 2,
		// 					            capStyle = '#fff',
		// 					            meterNum = 800 / (10 + 2), //count of the meters
		// 					            capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
		// 					        ctx = canvas.getContext('2d'),
		// 					        gradient = ctx.createLinearGradient(0, 0, 0, 300);
		// 					        gradient.addColorStop(1, '#0f0');
		// 					        gradient.addColorStop(0.5, '#ff0');
		// 					        gradient.addColorStop(0, '#f00');
		// 					        var drawMeter = function() {
		// 					            var array = new Uint8Array(analyser.frequencyBinCount);
		// 					            analyser.getByteFrequencyData(array);
		// 					            var step = Math.round(array.length / meterNum); //sample limited data from the total array
		// 					            ctx.clearRect(0, 0, cwidth, cheight);
		// 					            for (var i = 0; i < meterNum; i++) {
		// 					                var value = array[i * step];
		// 					                ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
		// 					                ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight /*2 is the gap between meter and cap*/ , meterWidth, cheight); //the meter
		// 					            }
		// 					            requestAnimationFrame(drawMeter);
		// 					        }
		// 					        requestAnimationFrame(drawMeter);
							 

		// 		            }, function(e) {
		// 		                console.log(e);
		// 		            });
		// 		    	};
		// 				fr.onerror = function(e) {
		// 	            	console.log(e);
		// 	        	};
		// 	        	fr.readAsArrayBuffer(this.response);
		// 	      	};
		//     	xhr.send();
		// };
 
		// 设置播放路径
		audio.set=function(){
			$audio.attr("src",data[audio.current].url);
		};
		// 播放
		audio.play=function(){
			$audio[0].play();
			audio.progress();
			options.onplay(audio);
		};
		// 停止
		audio.stop=function(){
			options.onpause();
		};
		// 暂停
		audio.pause=function(){
			$audio[0].pause();
			options.onpause(audio);
		};
		// 音量
		audio.volume=function(number){
			$audio[0].volume = number / 10;
			options.onvolume(audio);
		};
		// 进度
		audio.progress=function(){
			clearInterval(audio.interval);
			audio.interval=setInterval(function(){
	        	$(".playlist.active").siblings(".progress").find("span").css("width",$audio[0].currentTime/$audio[0].duration*100+"%");
	        	$(".playlist.active").siblings(".time").html(audio.timeFormat($audio[0].currentTime));
			},1000);
		};
		// 格式化时间
		audio.timeFormat=function(number) {
		    var minute = parseInt(number / 60);
		    var second = parseInt(number % 60);
			    minute = minute >= 10 ? minute : "0" + minute;
			    second = second >= 10 ? second : "0" + second;
		    return minute + ":" + second;
		};
		audio.init();
	};
	return this;
})(jQuery);