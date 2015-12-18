/**
 * Created by Administrator on 2015/8/20.
 * 播放及数据
 */

define(["./util/util"], function(util){
    util= util.init;
    var initData= function(){
    var proxyUrl= 'http://172.16.7.100:1991';  //本地代理地址
    var dsrj= proxyUrl+'/web?v=2.0&app_key=1&page=1&limit=30&_ksTS=1438219275495_46&callback=jsonp47&r=song/new';

    util.ajax(GLOBAL_URL, function(data){
        app.musicList.newMusicList= JSON.parse(data);
        app.musicList.newMusicList.$$location= 0;
        app.currentMusic.nowID= app.musicList.newMusicList.data.songs[0].song_id;
        app.currentMusic.listName= 'newMusicList';
        bus_play.put('$musicLoaded' );
    }, {
        type: 'POST',
        data: {
            url: 'http://spark.api.xiami.com/api?api_key=263b63d85992a30cc6030aff03c9dfd0&call_id=1438235493143&av=android_101&v=5.0&app_v=5010100&os_v=19_4.4.2&ch=700145&network=1&device_id=353918056359637&platform_id=1&lg=1&utdid=VY0KxJl2HXADAKUwViVKiJ1A&resolution=1280*768&method=rank.music-detail&type=newmusic_all&time=&proxy=0&api_sig=8093269b5591a2c02031bc7c2c970bf4&access_token=9b80ccb16761a524603f6ec4ad37f5ac'
        }
    });

    var song= window.song= {
        _getSongInfo: function(song_id, fn){     //歌曲信息获取
            var url= ' http://api.xiami.com/web?v=2.0&app_key=1&id='+song_id+'&_ksTS=1438235667562_75&r=song/detail';
            //util.ajax(url, fn, {callback: 'jsonp76'});

            util.ajax(GLOBAL_URL, fn, {
                type: 'POST',
                data: {
                    url: url
                }
            });
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
                data= JSON.parse(data);
                console.log(555555555555,data);
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

    };

    return {
        initData: initData
    }
});