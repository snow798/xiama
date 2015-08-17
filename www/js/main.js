/**
 * Created by Administrator on 2015/7/3.
 */

!function(){
    window.app= app= {
        module: {},
        currentMusic: {     //当前播放信息
            nowID: 0,
            preID: 0,
            nextID: 0,
            listName: ''
        },
        musicList:{
            newMusicList:{
                $$location: 0
            }
        },
        musicSrc: 'http://172.16.7.100:4000/ko/xiama/www/'
    };
    var initApp= function(){
        return window.app= util.extend(window.app, {
            w: window.innerWidth,
            h: window.innerHeight,
            platform: (function(){
                var webview= false;
                var p= '';
                if(window.navigator.platform.indexOf('arm')>-1){
                    webview= true;
                    p= 'arm';
                }
                return {
                    webview: webview,
                    plat: p
                }
            })()
        });
    };
    initApp();
    window.addEventListener('resize', function(){
        location.reload();
        initApp();
    });
    window.addEventListener('resize', function(){
        for(var i in app.module){
            app.module[i].init();
        }
    });

    var audio = window.audio= new Audio();
    var bus = window.bus= new EventBus();
    var bus_play= window.bus_play= bus.branch('$play');   //用于播放信息传递


}();

// 播放及数据
!function(){
    var proxyUrl= 'http://172.16.7.100:1991';  //本地代理地址
    var dsrj= proxyUrl+'/web?v=2.0&app_key=1&page=1&limit=30&_ksTS=1438219275495_46&callback=jsonp47&r=song/new';

    util.ajax('http://spark.api.xiami.com/api?api_key=263b63d85992a30cc6030aff03c9dfd0&call_id=1438235493143&av=android_101&v=5.0&app_v=5010100&os_v=19_4.4.2&ch=700145&network=1&device_id=353918056359637&platform_id=1&lg=1&utdid=VY0KxJl2HXADAKUwViVKiJ1A&resolution=1280*768&method=rank.music-detail&type=newmusic_all&time=&proxy=0&api_sig=8093269b5591a2c02031bc7c2c970bf4&access_token=9b80ccb16761a524603f6ec4ad37f5ac', function(data){
        app.musicList.newMusicList= JSON.parse(data);
        app.musicList.newMusicList.$$location= 0;
        app.currentMusic.nowID= app.musicList.newMusicList.data.songs[0].song_id;
        app.currentMusic.listName= 'newMusicList';
        bus_play.put('$musicLoaded' );
    });

    var song= window.song= {
        _getSongInfo: function(song_id, fn){     //歌曲信息获取
            var url= proxyUrl+'/web?v=2.0&app_key=1&id='+song_id+'&_ksTS=1438235667562_75&r=song/detail';
            util.ajax(url, fn, {callback: 'jsonp76'});
        },
        _getSongMusic: function(song_id){

        },
        _getSongLyric: function(song_id){

        },
        _playSong: function(url){    //音乐播放
            console.log(url);
            audio.pause();
            audio.src= url;
            //audio.currentTime= 0;
            audio.play();
        },
        nextSong: function(){
            var base= this;
            var song_id= app.currentMusic.nextID || app.currentMusic.nowID;
            this._getSongInfo(song_id, function(data){      //调用获取歌曲信息
                console.log(data);
                if(data.state== 0){
                    data= data.data.song;
                    base._playSong(data.listen_file);
                    bus_play.put('$changMusic', data);
                }else{
                    console.log('获取曲目信息出错！')
                }
                /*console.log(JSON.parse(data));
                data= JSON.parse(data);
                audio.currentTime= 0;
                audio.pause();
                audio.src= data.data.listen_file;
                audio.play();*/
            });
            app.currentMusic.nextID= function(){
                var listPlayerLocation= ++app.musicList[app.currentMusic.listName].$$location;   //播放列表位置
                var t= app.musicList[app.currentMusic.listName].data.songs[listPlayerLocation].song_id;
                console.log(t);
                return t;   //下一首音乐ID
            }()
        },
        prevSong: function(){
            var base= this;
            var song_id= app.currentMusic.preID || app.currentMusic.nowID;
            this._getSongInfo(song_id, function(data){      //调用获取歌曲信息
                console.log(data);
                if(data.state== 0){
                    data= data.data.song;
                    base._playSong(data.listen_file);
                    bus_play.put('$changMusic', data);
                }else{
                    console.log('获取曲目信息出错！')
                }
            });
            app.currentMusic.preID= function(){
                if(app.musicList[app.currentMusic.listName].$$location==0){                 //播放列表位置
                    listPlayerLocation=0;
                }else{
                    listPlayerLocation= --app.musicList[app.currentMusic.listName].$$location
                }
                var t= app.musicList[app.currentMusic.listName].data.songs[listPlayerLocation].song_id;
                return t;   //下一首音乐ID
            }()
        }
    };

}();

//播放器
!function(app){
    var inited= false;
    function Player(){
        var playStatus= 0;
        var base= this;
        this.config= {
            coverSrc: './img/X.jpg',
            musicInfo: {
                current: 2,
                offsetW: 0
            }
        };

        this.player_el= document.querySelector('.player');

        this.playerContent_el= {};
        this.playerControl_el={};
        this.maxCover_el= {};
        this.min_cover_el= {};
        this.playerControl_ev= {};

        this.playerBack_el={};
        this.playHeader_el= {};
        this.maxControl_el={};
        this.minPlayControl_el= {};
        this.music_info_content= {};

    }
    Player.prototype.getPlayStatus=function(n){
        playStatus= parseInt(n);
    };
    Player.prototype.setPlayStatus= function(n){
        playStatus= parseInt(n);
    };
    //获取图片颜色
    Player.prototype.getBgGradient= function(){

    };


    //播放器模块初始化
    Player.prototype.init= function(){   //初始化主要负责DOM结构生成
        var base= this;

        //生成player content
        this.player_el.innerHTML= '';
        var ih= app.h-app.h*0.09430;
        var pc_tpl= '<div class="album_bg"></div><div class="player-header"><div class="player-back"><svg class="icon-playerHrader-back"><use xlink:href="#icon-playerHrader-back"></use></svg></div><div class="player-Page-tag"></div><div class="player-similar"></div></div><ul class="music_info_content"><li class="myList"><div class="mylist_item"><div class="m_title">I Really Like You</div><div class="m_author">Carly Rae Jepsen</div><div class="m_time">4:25</div></div></li><li class="lyrics"><div class="max_cover"></div><div class="music_subjoin" style="height: '+app.h*0.1390+'px"><div class="max-progress"></div><div class="max-music-tip"><div class="tip-love"><svg class="icon icon-maxPlayer-love"><use xlink:href="#icon-maxPlayer-love"></use></svg></div><div class="tip-title"><div class="titleText" id="max_title">a sky full of stars</div><div class="author" id="max_author">coldplay</div></div><div class="tip-remark"><svg class="icon icon-maxPlayer-comment"><use xlink:href="#icon-maxPlayer-comment"></use></svg><span>247</span></div></div></div><div class="lyrics_text" style="height: '+app.h*0.2699186+'px;">Look at the stars; look how they shine for you</div></li><li class="album"></li></ul>';
        var pc_content= document.createElement('div');
        pc_content.className= 'playerContent';
        pc_content.style['-webkit-transform']= 'translate3d(0,'+ih+'px,0)';
        pc_content.innerHTML= pc_tpl;
        this.player_el.appendChild(pc_content);

        //player control
        var sh= app.h*0.09430;
        var pt_tpl= '<div class="minControl"><div class="progress"><div class="buffer"></div><div class="progress_handle"></div></div><div class="musicInfo" style=" height: '+sh+'px;"><div class="cover" style="width: '+sh+'px; height: '+sh+'px;"></div><div class="name">Eat Youself</div><div class="author">Goldfapp</div></div><div class="control"><div id="min_next"><svg class="icon icon-player-right"><use xlink:href="#icon-player-right"></use></svg></div><div id="min_play"><svg class="icon icon-player"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-player"></use></svg></div></div></div><div class="maxControl"><div class="maxControl_content"><div class="s_type"><svg class="icon icon-maxPlayer-random"><use xlink:href="#icon-maxPlayer-random"></use></svg></div><div class="s_btn"><div class="sv_left" id="max_prev"><svg class="icon icon-maxPlayer-left"><use xlink:href="#icon-maxPlayer-left"></use></svg></div><div class="sv_centre"><svg class="icon max-player"><use xlink:href="#max-player"></use></svg></div><div class="sv_right" id="max_next"><svg class="icon icon-player-right"><use xlink:href="#icon-maxPlayer-right"></use></svg></div></div><div class="s_more"><svg class="icon icon-maxPlayer-more"><use xlink:href="#icon-maxPlayer-more"></use></svg></div></div></div>';
        var pt_content= document.createElement('div');
        pt_content.className= 'playerControl';
        pt_content.style.height= sh+'px';
        pt_content.innerHTML= pt_tpl;
        this.player_el.appendChild(pt_content);

        /*var album= document.createElement('div');
        album.className= 'album_bg';
        this.player_el.appendChild(album);*/

        this.playerContent_el= document.querySelector('.playerContent');
        this.playerControl_el= document.querySelector('.playerControl');
        this.maxCover_el= document.querySelector('.max_cover');
        //min
        this.showMore_el= document.querySelector('.musicInfo');
        this.min_cover_el= document.querySelector('.musicInfo>.cover');
        this.min_name_el= document.querySelector('.musicInfo>.name');
        this.min_author_el= document.querySelector('.musicInfo>.author');
        //max
        this.playerBack_el=document.querySelector('.player-back');
        this.maxControl_el= document.querySelector('.maxControl');
        this.playHeader_el= document.querySelector('.player-header');
        this.minPlayControl_el= document.querySelector('.minControl');
        this.music_info_content= document.querySelector('.music_info_content');


    };

    //与播放器无关 曲目信息
    Player.prototype.control= function(){
        var base= this;
        var cuverStr= 'url('+this.config.coverSrc+')';    //设置封面
        this.maxCover_el.style.backgroundImage= this.min_cover_el.style.backgroundImage= cuverStr;
        var img= new Image();
        img.src= this.config.coverSrc;

        function setBgGradient(src){
            RGBaster.colors(src, {
                paletteSize: 30, // 调色板大小
                exclude: [ 'rgb(255,255,255)','rgb(0,0,0)','rgb(1,1,1)'],
                success: function(payload) {
                    // payload.dominant是主色，RGB形式表示
                    // payload.secondary是次色，RGB形式表示
                    // payload.palette是调色板，含多个主要颜色，数组
                    console.log(payload.dominant);
                    console.log(payload.secondary);
                    console.log(payload.palette);
                    base.playerContent_el.style.backgroundImage= 'linear-gradient(to left,'+payload.dominant+'0%,'+payload.secondary+'50%,'+payload.dominant+'100%)';
                }
            });
        }
       // setBgGradient(this.config.coverSrc);

        this.playBack();

        //播放列表生成
        var song_list= document.querySelector('.myList');
        bus_play.subscribe('$musicLoaded', function(ev, data){
            var currentList= app.musicList[app.currentMusic.listName].data.songs;
            var html= '';
            for(var i in currentList){
                html += '<div class="mylist_item"><div class="m_title">'+ currentList[i].song_name+'</div><div class="m_author">'+ currentList[i].singers+'</div><div class="m_time">4:25</div></div>'
            }
            song_list.innerHTML= html;
            //console.log(333344,currentList);
        });

        // min
        bus_play.subscribe('$changMusic', function(type, data){
            console.log(23423,type, data, base.min_cover_el);
            base.min_cover_el.style.backgroundImage= 'url('+data.logo+')';
            base.min_name_el.innerText= data.song_name;
            base.min_author_el.innerText= data.singers;
        });
        //  max
        var album_bg= document.querySelector('.album_bg');
        var max_music_title= document.querySelector('#max_title');
        var max_music_author= document.querySelector('#max_author');
        bus_play.subscribe('$changMusic', function(type, data){
            max_music_title.innerText= data.song_name;
            max_music_author.innerText= data.singers;
            // max专辑封面
            var site= app.musicList[app.currentMusic.listName].$$location-1;
            var album_loago= app.musicList[app.currentMusic.listName].data.songs[site].album_logo;
            album_loago= album_loago.replace(/_115w_115h/i, "_768w_768h");
            var buffer_img= new Image();
            buffer_img.src= album_loago;
            buffer_img.addEventListener('load', function(e){
                base.maxCover_el.style.backgroundImage= 'url('+this.src+')';
                album_bg.style.backgroundImage= 'url('+this.src+')';

            });
            //设置背景渐变
           // setBgGradient(album_loago);

        })

    };
    //  退出more状态 效果
    Player.prototype.playBack= function(){
        var base= this;
        var playerBack_ev = new Hammer(this.playerBack_el);
        playerBack_ev.on('tap', function(ev) {
            var ih= app.h-app.h*0.09430;
            base.playerContent_el.style['-webkit-transform']= 'translate3d(0,'+ih+'px,0)';
            base.playerControl_el.style.height= app.h*0.09430+ 'px';
            base.maxControl_el.style.visibility= 'hidden';
            base.playHeader_el.style.visibility= 'hidden';
            base.minPlayControl_el.style.display= 'block';
        });

    };

    //展开more状态
    Player.prototype.showMore= function(){
        var base= this;
        var minControl= document.querySelector('.musicInfo');
        showMore_ev = new Hammer(minControl);

        this.setPlayStatus(0);
        showMore_ev.on('tap', function(ev) {
            //alert(23423);
            var sh= app.h*0.214711;
            base.playerContent_el.style['-webkit-transform']= 'translate3d(0,0,0)';
            base.playerControl_el.style.height= sh+'px';
            base.maxControl_el.style.visibility= 'visible';
            base.playHeader_el.style.visibility= 'visible';
            base.minPlayControl_el.style.display= 'none';
            // base.playerControl_ev.off('tap');   //解除tap事件绑定
        });

    };


    //展开状态content 效果
    Player.prototype.musicInfoContent= function(){
        var base= this;
        var musicInfo= new Hammer(this.music_info_content);
        var init_offset= 0;
        var init_w= -app.w;
        var init_transform= 0;     //更新后为当前（上一次操作后）的位置
        base.config.musicInfo.offsetW= -app.w;
        var o= 0;    //触摸中心点

        function setPan(n){
            init_offset= n-o;
            var s= (init_transform + init_offset);     //最终偏移位置
            if(s> 100){
                return false;
            }
            if(s< init_w*2-100){
                return false;
            }
            base.music_info_content.style['-webkit-transform']= 'translate3d('+s+'px, 0, 0)';
            o= n;
            base.config.musicInfo.offsetW= init_transform=  s;
        }
        musicInfo.on('panstart', function(ev){
            o= 0;
            init_transform= base.config.musicInfo.offsetW;
            base.music_info_content.style['-webkit-transition-duration']= '0s';
        });
        musicInfo.on('panmove', function(ev){
            // console.log(ev);
            setPan(ev.deltaX);
        });
        musicInfo.on('panend', function(ev){
            base.music_info_content.style['-webkit-transition-duration']= '0.3s';
            if(base.config.musicInfo.current == 2){
                if(base.config.musicInfo.offsetW<(init_w+init_w/2)){
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+init_w*2+'px,0,0)';
                    base.config.musicInfo.current= 3;
                    base.config.musicInfo.offsetW= init_w*2;
                }else if(base.config.musicInfo.offsetW>(init_w/2)){
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+0+'px,0,0)';
                    base.config.musicInfo.current= 1;
                    base.config.musicInfo.offsetW= 1;
                }
                else{

                    base.music_info_content.style['-webkit-transform']= 'translate3d('+init_w+'px,0,0)';
                    base.config.musicInfo.offsetW= init_w;
                }
                return false
            }


            if(base.config.musicInfo.current == 3){
                if(base.config.musicInfo.offsetW>(init_w+init_w/2)){
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+init_w+'px,0,0)';
                    base.config.musicInfo.current= 2;
                    base.config.musicInfo.offsetW= init_w;
                }else{
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+init_w*2+'px,0,0)';
                    base.config.musicInfo.offsetW= init_w*2;
                }
                return false
            }

            if(base.config.musicInfo.current == 1){
                if(base.config.musicInfo.offsetW<(init_w/2)){
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+init_w+'px,0,0)';
                    base.config.musicInfo.current= 2;
                    base.config.musicInfo.offsetW= init_w;
                }else{
                    base.music_info_content.style['-webkit-transform']= 'translate3d('+0+'px,0,0)';
                    base.config.musicInfo.offsetW= 0;
                }
                return false
            }

            init_transform= base.config.musicInfo.offsetW;    //更新偏移值
            return false
        });
    };
    //播放器相关 进度条 事件绑定
    Player.prototype.musicPlayer= function(){
        var min_play_el= document.querySelector('#min_play');
        var buffer= document.querySelector('.buffer');
        var handle= document.querySelector('.progress_handle');
        var min_next_el= document.querySelector('#min_next');
        min_play_ev= new Hammer(min_play_el);
        min_next_ev= new Hammer(min_next_el);

        var mConfig={
            played: false,
            duration: 0,      //当前曲目总时长
            currentTime: 0,   //当前曲目播放位置

            currentSrc: '',   //当前资源
            currentSite: 0,   //当前在播放列表位置
            currentList: 'qq_hit_all',  //当前播放列表
            firstPlay: true   //是否首次点击播放
        };


        audio.addEventListener('loadedmetadata', function(ev){     //成功获取资源长度
            mConfig.duration= audio.duration;
        }, false);

        audio.addEventListener('loadstart', function(ev){
                var upBuffer= function(){
                    var bufferIndex = audio.buffered.length;
                    if (bufferIndex > 0 && audio.buffered != undefined) {
                        var bufferValue = (1-(audio.buffered.end(bufferIndex-1)/audio.duration))*100;
                        buffer.style['-webkit-transform']= 'translate3d('+-bufferValue+'%,0,0)';
                        if(bufferValue == 0){
                            clearInterval(bingo)
                        }
                    }
                };
            var bingo= setInterval(upBuffer, 1000);
        }, false);
        
        audio.addEventListener('timeupdate', function(){
            mConfig.currentTime= audio.currentTime;
            var currentValue= (1-audio.currentTime/audio.duration)*100;
            handle.style['-webkit-transform']= 'translate3d('+-currentValue+'%,0,0)';
        }, false);

        //min max 暂停/播放SVG切换 及播放状态控制
        var max_centre= document.querySelector('.sv_centre');
        bus_play.subscribe("$play", function(type, payload){
            console.log(type, payload);
            mConfig.played= payload ? true : !mConfig.played;   //播放状态
            if(mConfig.played){   //tap暂停
                audio.play();
                min_play_el.innerHTML= '<svg class="icon icon-pause"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pause"></use></svg>';
                max_centre.innerHTML= '<svg class="icon icon-player-pause"><use xlink:href="#icon-player-pause"></use></svg>';
                mConfig.played= true;
            }else{                  //tap开始播放
                audio.pause();
                min_play_el.innerHTML= '<svg class="icon icon-player"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-player"></use></svg>';
                max_centre.innerHTML= '<svg class="icon max-player"><use xlink:href="#max-player"></use></svg>';
                mConfig.played= false;
            }

        });


        //min暂停/播放
        min_play_ev.on('tap', function(){
            bus_play.put('$play', false);
        });

        //max暂停/播放
        var max_play_ev= document.querySelector('.sv_centre');
        max_play_ev= new Hammer(max_play_ev);
        max_play_ev.on('tap', function(){
            bus_play.put('$play', false);
        });

        //min下一曲
        min_next_ev.on('tap', function(){
            song.nextSong();
            bus_play.put('$play', true);   //强制播放状态
        });

        //max 下一曲
        var max_next= document.querySelector('#max_next');
        max_next_ev= new Hammer(max_next);
        max_next_ev.on('tap', function(){
            song.nextSong();
            bus_play.put('$play', true);   //强制播放状态
        });

        //max 上一曲
        var max_prev= document.querySelector('#max_prev');
        max_prev_ev= new Hammer(max_prev);
        max_prev_ev.on('tap', function(){
            song.prevSong();
            bus_play.put('$play', true);   //强制播放状态
        });
    };



    function init(){
        if(inited) return false;
        var player= new Player();
        player.init();
        inited= true;     //加锁
        app.module.player= player;
        player.control();
        player.showMore();
        player.musicInfoContent();
        player.musicPlayer();
        console.log(player,app, app.module)
    }
    //执行模块初始化
    document.addEventListener('DOMContentLoaded', function(){
            init();
    }, false);


/*    window.addEventListener('resize', function(){
        musicPlay.init();
    })*/
}(window.app);

//首页中间 referrals模块
!function(app){
    //水平滑动
    smoothness('.sos-show', 1);
    var flex_container= document.querySelector('.referrals');
    var flex_cont= document.querySelector('#ref_content');
    var flex_container_height= flex_container.offsetHeight;
    var flex_cont_height= flex_cont.offsetHeight;
    var Loaded= false;
    flex_container.addEventListener('scroll', function(ev){
        var offset= this.scrollTop;
        flex_cont_height= flex_cont.offsetHeight;
        if(offset+ flex_container_height+10 >= flex_cont_height){
            if(!Loaded){
                Loaded= true;
                getRef_data();
            }
        }
    }, false);

    function getRef_data(){
        util.ajax('http://spark.api.xiami.com/api?api_key=263b63d85992a30cc6030aff03c9dfd0&call_id=1439255024287&av=android_101&v=5.0&app_v=5010100&os_v=19_4.4.2&ch=700145&network=1&device_id=353918056359637&platform_id=1&lg=1&utdid=VY0KxJl2HXADAKUwViVKiJ1A&resolution=1280*768&method=music.start&page=4&device_type=Nexus+4&gps=115.17296503%2C30.96320678&ssid=%22KX-WLAN%22&bssid=1c%3A1d%3A86%3Ace%3Aff%3A60&proxy=0&api_sig=a212dfe537e5f36807f14b0e701d7734&access_token=9b80ccb16761a524603f6ec4ad37f5ac', function(data){
            bus_play.put('$ref_dataed', JSON.parse(data));
            Loaded= false;
        });
    }


    bus_play.subscribe('$ref_dataed', function(ev, data){
        console.log(77777, data);
        var ref_cont= document.querySelector('#ref_content');
        //类型模板
        ref_tpl={
          banner: function(data){
              var html = '';
              var ref_banner= document.createElement('div');
              ref_banner.className= 'ref_banner';
              html += '<div class="swiper-container"><div class="swiper-wrapper">';
              for(var s in data.banner){
                  html += '<div class="swiper-slide" data-title="'+data.banner[s].title+'" data-href="'+data.banner[s].url+'"> <img src="'+data.banner[s].logo+'"> </div>';
              }
              html += '</div></div><div class="pagination"></div>';
              ref_banner.innerHTML= html;
              ref_cont.innerHTML= '';
              ref_cont.appendChild(ref_banner);
              var mainContentSmoothness= document.querySelector('.sos-show');
              var banner = new Swiper('.swiper-container',{
                  pagination: '.pagination',
                  loop:true,
                  autoplay: 2500,
                  grabCursor: true,
                  paginationClickable: true,
                  onSlideTouch: function(ev){
                      /*console.log(ev)
                      ev.stopPropagation;
                      ev.preventDefault;
                      mainContentSmoothness.style.pointerEvents= 'none';
                      return false
                      //ev.stopPropagation();*/
                  },
                  onTouchEnd: function(ev){
                      /*mainContentSmoothness.style.pointerEvents= 'auto';*/
                  }
              });
          },
          radios: function(data){
                var html = '';
                var radios= document.createElement('div');
                radios.className= 'ref_topLinks';
                for(var s in data.radios){
                    var sel= data.radios[s];
                    html += '<div data-href="'+sel.url+'" class="topLinks_item" style="background-image: url('+sel.logo+');">'+sel.title+'</div>';
                }
                radios.innerHTML= html;
              ref_cont.appendChild(radios);
          },
          musicTopList: function( data){  //今日歌曲推介类型
              var html= '';
              var topEle= document.createElement('div');
              topEle.className= 'sq_list';

              if(data.user_name){
                  html += '<div class="author">'+data.user_name+'</div>';
              }
              html += '<div class="title">'+data.title+'</div><ul class="sq_list_cont">';
              for(var s in data.songs){
                var sel= data.songs[s];
                  html += '<li class="item"><div class="album"style="background-image: url('+sel.album_logo+');"></div><div class="song"><div class="song_title">'+sel.song_name+'</div><div class="song_author">'+sel.singers+'</div></div><div class="more"><svg class="icon sos-more"><use xlink:href="#sos-more"></use></svg></div></li>';
              }
              html += '</ul>';
              topEle.innerHTML= html;
              ref_cont.appendChild(topEle);
          },
            musicTopList_srot: function( data){    //热门歌曲推介类型
                var html= '';
                var topEle= document.createElement('div');
                topEle.className= 'sq_list';

                if(data.user_name){
                    html += '<div class="author">'+data.user_name+'</div>';
                }
                html += '<div class="title">'+data.title+'</div><ul class="sq_list_cont">';
                for(var s in data.songs){
                    var sel= data.songs[s];
                    html += '<li class="item"><div class="album"style="background-image: url('+sel.album_logo+');"></div><div class="song"><div class="song_title">'+sel.song_name+'</div><div class="song_author">'+sel.singers+'</div></div><div class="more"><svg class="icon sos-more"><use xlink:href="#sos-more"></use></svg></div></li>';
                }
                html += '</ul>';
                topEle.innerHTML= html;
                ref_cont.appendChild(topEle);
            },
          newMusic: function(data){   //新碟首发
              var html = '';
              var newMusicEle= document.createElement('div');
              newMusicEle.className= 'sq_newMusic';
              html += '<div class="sq_newMusic_title">'+data.title+'</div><ul class="sq_newMusic_cont">';
              for(var s in data.collections){
                var sel = data.collections[s];
                  html += '<li data-href="'+sel.url+'"><div class="cover" style="background-image:url('+sel.logo+');"></div><div class="title">'+sel.name+'</div><div class="author">'+sel.author+'</div></li>';
              }
              html += '</ul>';
              newMusicEle.innerHTML= html;
              ref_cont.appendChild(newMusicEle);

          },
            action: function(data){      //专辑简短推介
                var action= document.createElement('div');
                action.className= 'operation';
                var html;
                var views=data.views.toString();
                var views1;
                if(views && views.length>4){
                    views1= views.substring(0, views.length-4);
                    views1= views1+'.'+views.substring(views.length-4, views.length);
                    views1= parseFloat(views1).toFixed(2);
                    views= views1+ '万';
                }
                html= '<div class="view">'+views+'</div><div class="title">'+data.title+'</div><div class="content">'+data.sub_title+'</div>';
                action.innerHTML= html;
                action.style.backgroundImage= 'url('+data.logo+')';
                action.setAttribute('data-href', data.url);
                ref_cont.appendChild(action);
            },
            mv: function(data){
                var html= '';
                var mv= document.createElement('div');
                mv.className= 'sq_mv';
                var sel= data.mv;
                html += '<div class="view">'+sel.play_count+'</div><div class="mask_play"><svg><use xlink:href="#max-player"/></svg></div><div class="itemBody" style="background-image:url('+sel.mv_cover+');"></div><div class="title">'+sel.title+'</div><div class="author">'+sel.artist+'</div>';
                mv.innerHTML= html;
                mv.setAttribute('data-href', sel.url);
                mv.setAttribute('mv_id', sel.mv_id);
                ref_cont.appendChild(mv);
            },
            rec_song: function(data){
                var html= '';
                var sel= data.rec_song;
                var views=sel.play_count.toString();
                var views1;
                if(views && views.length>4){
                    views1= views.substring(0, views.length-4);
                    views1= views1+'.'+views.substring(views.length-4, views.length);
                    views1= parseFloat(views1).toFixed(2);
                    views= views1+ '万';
                }
                var rec= document.createElement('div');
                rec.className= 'sq_rec_song';
                rec.setAttribute('data-href', sel.url);
                html += '<div class="view">'+views+'</div><div class="title">'+sel.reason+'</div><div class="cover" style="background-image: url('+sel.album_logo+');"></div><div class="pinyin">'+sel.song_name+'</div><div class="author">'+sel.singers+'</div><div class="more"><svg class="icon sos-more"><use xlink:href="#sos-more"></use></svg></div>';
                rec.innerHTML= html;
                ref_cont.appendChild(rec);
            },
            featured: function(data){
                var html= '';
                var sel= data.collect;
                var featured= document.createElement('div');
                featured.className= 'sq_featured';
                featured.setAttribute('data-href', sel.url);
                var views=sel.play_count.toString();
                var views1;
                if(views && views.length>4){
                    views1= views.substring(0, views.length-4);
                    views1= views1+'.'+views.substring(views.length-4, views.length);
                    views1= parseFloat(views1).toFixed(2);
                    views= views1+ '万';
                }
                html += '<div class="view">'+views+'</div><div class="cover" style="background-image:url('+sel.collect_logo+');"></div><div class="title">'+sel.collect_name+'</div><div class="title_sub">'+sel.author_name+'</div><div class="tag"></div><div class="content">'+sel.description+'</div>';
                featured.innerHTML= html;
                ref_cont.appendChild(featured);
            },
            rec_song2: function(data){
                var html= '';
                var sel= data.album;
                var views=sel.play_count.toString();
                var views1;
                if(views && views.length>4){
                    views1= views.substring(0, views.length-4);
                    views1= views1+'.'+views.substring(views.length-4, views.length);
                    views1= parseFloat(views1).toFixed(2);
                    views= views1+ '万';
                }
                var rec= document.createElement('div');
                rec.className= 'sq_rec_song2';
                rec.setAttribute('data-href', sel.source_url);
                html += '<div class="view">'+views+'</div><div class="title">'+sel.reason+'</div><div class="cover" style="background-image: url('+sel.album_logo+');"></div><div class="pinyin">'+sel.album_name+'</div><div class="author">'+sel.artist_name+'</div><div class="more"></div>';
                rec.innerHTML= html;
                ref_cont.appendChild(rec);
            },
            featured2: function(data){
                var html= '';
                var sel= data.rec_collect;
                var featured= document.createElement('div');
                featured.className= 'sq_featured2';
                featured.setAttribute('data-href', sel.url);
                var views=sel.play_count.toString();
                var views1;
                if(views && views.length>4){
                    views1= views.substring(0, views.length-4);
                    views1= views1+'.'+views.substring(views.length-4, views.length);
                    views1= parseFloat(views1).toFixed(2);
                    views= views1+ '万';
                }
                html += '<div class="view">'+views+'</div><div class="cover" style="background-image:url('+sel.collect_logo+');"></div><div class="title">'+sel.reason+'</div><div class="title_sub">'+sel.collect_name+'</div><div class="author_name">'+sel.author_name+'</div><div class="tag"></div><div class="content">'+sel.description+'</div>';
                featured.innerHTML= html;
                ref_cont.appendChild(featured);
            }
        };

        //数据填充
        for(var i in data.data.list){
            var colle= data.data.list[i];
            switch (colle.layout)
             {
                case 1:
                    ref_tpl.banner(colle);     //布局类型
                break;
                case 16:
                    ref_tpl.radios(colle);
                    break;
                case 15:
                    ref_tpl.musicTopList(colle);
                    break;
                case 10:
                    ref_tpl.newMusic(colle);
                    break;
                case 9:
                    ref_tpl.musicTopList_srot(colle);
                    break;
                case 13:
                    ref_tpl.action(colle);
                    break;
                case 12:
                    ref_tpl.mv(colle);
                    break;
                case 4:
                    ref_tpl.rec_song(colle);
                    break;
                case 7:
                    ref_tpl.featured(colle);
                    break;
                case 8:
                    ref_tpl.rec_song2(colle);
                    break;
                case 6:
                    ref_tpl.featured2(colle)
            }
        }

    });


    //缓存数据载入
    if(!window.localStorage){
        console.log('no localStorage')
    }
    function getBannerData(){
        util.ajax('http://spark.api.xiami.com/api?api_key=263b63d85992a30cc6030aff03c9dfd0&call_id=1438914458351&av=android_101&v=5.0&app_v=5010100&os_v=19_4.4.2&ch=700145&network=1&device_id=353918056359637&platform_id=1&lg=1&utdid=VY0KxJl2HXADAKUwViVKiJ1A&resolution=1280*768&method=music.start&page=1&device_type=Nexus+4&gps=115.17296503%2C30.96320678&ssid=%22KX-WLAN%22&bssid=1c%3A1d%3A86%3Acf%3A0a%3A70&proxy=0&api_sig=85d03053806d90e21faa3bc75aaccb5e&access_token=9b80ccb16761a524603f6ec4ad37f5ac', function(data){
            data= JSON.parse(data);
            data._time= new Date().getTime();
            localStorage.setItem('home_one', JSON.stringify(data));
            bus_play.put('$ref_dataed', data);
        });
    }
    var lo_data= localStorage.getItem('home_one');
    if(!lo_data){   //为空时
        getBannerData();
    }else{
        lo_data= JSON.parse(localStorage.getItem('home_one'));
        bus_play.put('$ref_dataed', lo_data);
        if(new Date().getTime()> lo_data._time+2*60*1000){     //本地缓存是否过期过期更新 过期时间2s
            getBannerData();
        }
    }


}(window.app);

//弹出层相关
!function(){
    var popup= new Popup('.popup', '.main-sos');
    var t= document.querySelector('.main-sos');
    t.addEventListener('click', function(){
        popup.show()
    }, false);
}(window.app);

