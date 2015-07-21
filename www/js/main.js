/**
 * Created by Administrator on 2015/7/3.
 */

!function(){
    window.app= app= {
        module: {}
    };
    var initApp= function(){
        return window.app= util.extend(window.app, {
            w: window.innerWidth,
            h: window.innerHeight
        });
    };
    initApp();
    window.addEventListener('resize', function(){
        initApp();
    });
    window.addEventListener('resize', function(){
        for(var i in app.module){
            app.module[i].init();
        }
    })
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
        var pc_tpl= '<div class="player-header"><div class="player-back"><svg class="icon-playerHrader-back"><use xlink:href="#icon-playerHrader-back"></use></svg></div><div class="player-Page-tag"></div><div class="player-similar"></div></div><ul class="music_info_content"><li class="myList"></li><li class="lyrics"><div class="max_cover"></div><div class="music_subjoin" style="height: '+app.h*0.1390+'px"><div class="max-progress"></div><div class="max-music-tip"><div class="tip-love"><svg class="icon icon-maxPlayer-love"><use xlink:href="#icon-maxPlayer-love"></use></svg></div><div class="tip-title"><div class="titleText">a sky full of stars</div><div class="author">coldplay</div></div><div class="tip-remark"><svg class="icon icon-maxPlayer-comment"><use xlink:href="#icon-maxPlayer-comment"></use></svg><span>247</span></div></div></div><div class="lyrics_text" style="height: '+app.h*0.2699186+'px;">Look at the stars; look how they shine for you</div></li><li class="album"></li></ul>';
        var pc_content= document.createElement('div');
        pc_content.className= 'playerContent';
        pc_content.style['-webkit-transform']= 'translate3d(0,'+ih+'px,0)';
        pc_content.innerHTML= pc_tpl;
        this.player_el.appendChild(pc_content);

        //player control
        var sh= app.h*0.09430;
        var pt_tpl= '<div class="minControl"><div class="progress"><div class="progress_handle"></div></div><div class="musicInfo"><div class="cover" style="width: '+sh+'px; height: '+sh+'px;"></div><div class="name">Eat Youself</div><div class="author">Goldfapp</div></div><div class="control"><svg class="icon icon-player-right"><use xlink:href="#icon-player-right"></use></svg><svg class="icon icon-pause"><use xlink:href="#icon-pause"></use></svg></div></div><div class="maxControl"><div class="maxControl_content"><div class="s_type"><svg class="icon icon-maxPlayer-random"><use xlink:href="#icon-maxPlayer-random"></use></svg></div><div class="s_btn"><div class="sv_left"><svg class="icon icon-maxPlayer-left"><use xlink:href="#icon-maxPlayer-left"></use></svg></div><div class="sv_centre"><svg class="icon icon-player-pause"><use xlink:href="#icon-player-pause"></use></svg></div><div class="sv_right"><svg class="icon icon-player-right"><use xlink:href="#icon-maxPlayer-right"></use></svg></div></div><div class="s_more"><svg class="icon icon-maxPlayer-more"><use xlink:href="#icon-maxPlayer-more"></use></svg></div></div></div>';
        var pt_content= document.createElement('div');
        pt_content.className= 'playerControl';
        pt_content.style.height= sh+'px';
        pt_content.innerHTML= pt_tpl;
        this.player_el.appendChild(pt_content);

        this.playerContent_el= document.querySelector('.playerContent');
        this.playerControl_el= document.querySelector('.playerControl');
        this.maxCover_el= document.querySelector('.max_cover');
        this.min_cover_el= document.querySelector('.musicInfo>.cover');
        this.playerBack_el=document.querySelector('.player-back');
        this.maxControl_el= document.querySelector('.maxControl');
        this.playHeader_el= document.querySelector('.player-header');
        this.minPlayControl_el= document.querySelector('.minControl');
        this.music_info_content= document.querySelector('.music_info_content');



    };

    Player.prototype.control= function(){
        var base= this;
        var cuverStr= 'url('+this.config.coverSrc+')';    //设置封面
        this.maxCover_el.style.backgroundImage= this.min_cover_el.style.backgroundImage= cuverStr;
        var img= new Image();
        img.src= this.config.coverSrc;
        RGBaster.colors(this.config.coverSrc, {
            paletteSize: 30, // 调色板大小
            exclude: [ 'rgb(255,255,255)','rgb(0,0,0)','rgb(1,1,1)'],
            success: function(payload) {
                // payload.dominant是主色，RGB形式表示
                // payload.secondary是次色，RGB形式表示
                // payload.palette是调色板，含多个主要颜色，数组
                console.log(payload.dominant);
                console.log(payload.secondary);
                console.log(payload.palette);
                base.playerContent_el.style.backgroundImage= 'linear-gradient(to left,'+payload.palette[0]+'0%,'+payload.palette[1]+'50%,'+payload.palette[0]+'100%)';
            }
        });
        this.playerControl();
        this.playBack();

    };

    Player.prototype.playBack= function(){
        var base= this;
        var playerBack_ev = new Hammer(this.playerBack_el);
        playerBack_ev.on('tap', function(ev) {
            var ih= app.h-app.h*0.09430;
            base.playerContent_el.style['-webkit-transform']= 'translate3d(0,'+ih+'px,0)';
            base.playerControl_el.style.height= app.h*0.09430+ 'px';
            base.maxControl_el.style.visibility= 'hidden';
            base.playHeader_el.style.visibility= 'hidden';
            base.minPlayControl_el.style.visibility= 'visible';
        });

    };

    //控制盘
    Player.prototype.playerControl= function(){
        var base= this;
        this.playerControl_ev = new Hammer(this.playerControl_el);
        var minControl= document.querySelector('.control');

        this.setPlayStatus(0);
        this.playerControl_ev.on('tap', function(ev) {
            var sh= app.h*0.214711;
            base.playerContent_el.style['-webkit-transform']= 'translate3d(0,0,0)';
            base.playerControl_el.style.height= sh+'px';
            base.maxControl_el.style.visibility= 'visible';
            base.playHeader_el.style.visibility= 'visible';
            base.minPlayControl_el.style.visibility= 'hidden';
           // base.playerControl_ev.off('tap');   //解除tap事件绑定
        });

    };

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
        });
        musicInfo.on('panmove', function(ev){
            // console.log(ev);
            setPan(ev.deltaX);
        });
        musicInfo.on('panend', function(ev){
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


    function init(){
        if(inited) return false;
        var player= new Player();
        player.init();
        inited= true;     //加锁
        app.module.player= player;
        player.control();
        player.musicInfoContent();
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
