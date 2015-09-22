/**
 * Created by Administrator on 2015/8/20.
 * 首页中间 referrals模块
 */
define(['smoothness'], function(smoothness){
    function getRef_data(){
        util.ajax('http://spark.api.xiami.com/api?api_key=263b63d85992a30cc6030aff03c9dfd0&call_id=1439255024287&av=android_101&v=5.0&app_v=5010100&os_v=19_4.4.2&ch=700145&network=1&device_id=353918056359637&platform_id=1&lg=1&utdid=VY0KxJl2HXADAKUwViVKiJ1A&resolution=1280*768&method=music.start&page=4&device_type=Nexus+4&gps=115.17296503%2C30.96320678&ssid=%22KX-WLAN%22&bssid=1c%3A1d%3A86%3Ace%3Aff%3A60&proxy=0&api_sig=a212dfe537e5f36807f14b0e701d7734&access_token=9b80ccb16761a524603f6ec4ad37f5ac', function(data){
            bus_play.put('$ref_dataed', JSON.parse(data));
            Loaded= false;
        });
    }
    var initref= function(){
        //水平滑动
        smoothness.init('.sos-show', 0);
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
                        html += '<div class="swiper-slide" > <img src="'+data.banner[s].logo+'" data-title="'+data.banner[s].title+'" data-href="'+data.banner[s].url+'"> </div>';
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
                    html += '<div class="title" data-popupType="album" data-href="'+data.source_url+'">'+data.title+'</div><ul class="sq_list_cont">';
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
                    html= '<div class="view">'+views+'</div><div data-href="'+ data.url+'" class="title">'+data.title+'</div><div class="content"  data-href="'+ data.url+'" >'+data.sub_title+'</div>';
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

    };

    return {
        initref: initref,
        getRef_data: getRef_data
    }
});