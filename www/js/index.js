/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//自适应REM设置
!function(){
    var isChange= false, oldScreenWidth= 375, oldRem= 50;   // 默认iPhone6为基准[屏款375，默认根字体大小50px]
    var html= document.getElementsByTagName('html')[0];
    var getStyle = function (element,attr) {
        if(typeof window.getComputedStyle!='undefined'){
            return parseFloat(window.getComputedStyle(element,null)[attr]);
        }else if(element.currentStyle){
            return parseFloat(element.currentStyle[attr]);
        }
    };
    function initRem(){
        console.log(document.body.clientWidth, getStyle(html, 'font-size'));
        html.style.fontSize= document.body.clientWidth*oldRem/oldScreenWidth+'px';
        oldScreenWidth= document.body.clientWidth;
        oldRem= getStyle(html, 'font-size');
        isChange= false;
    }
    document.addEventListener('DOMContentLoaded', function(){
        initRem();
    });
    window.addEventListener('resize', function(){
        if(!isChange){
            isChange= true;
            setTimeout(initRem, 700);
            //musicPlay.init();
        }
    })

}();

// http://2015.kookw.sinaapp.com/demo/xiama/server/
//
window.GLOBAL_URL= '/demo/xiama/server/index.php';
window.EXTEND= '.jpg';
setInterval(function(){
    window.scrollTo(0,0);
},500);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        navigator.splashscreen.hide();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);


    }
};

app.initialize();


