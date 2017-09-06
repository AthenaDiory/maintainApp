"use strict";

var Youcoffee = angular.module("youcoffee",["ngRoute", "ngCookies","infinite-scroll"]);

Youcoffee.config(['$routeProvider',function($routeProvider){
	var timestamp = Date.parse(new Date());
	$routeProvider
	.when("/", {
    	redirectTo: "/login"
  	})
	.when('/login',{
		templateUrl : 'yy_login.html?t='+timestamp,
	})
	.when('/home',{
		templateUrl : 'yy_home.html?t='+timestamp,
	})
	.when('/pointList',{
		templateUrl : 'yy_point_list.html?t='+timestamp,
	})
	.when('/maintainList',{
		templateUrl: 'yy_maintain_list.html?t='+timestamp,
	})
	.when('/reportError/macNo=:macNo',{
		templateUrl: 'yy_report_error.html?t='+timestamp,
	})

	.when('/startMaintain/id=:id',{
		templateUrl:'yy_start_maintain.html?t='+timestamp,
	})
    .when('/maintainDetail/id=:id',{
        templateUrl:'yy_maintain_detail.html?t='+timestamp,
    })
    .when('/pointDetail/id=:id',{
        templateUrl:'yy_point_detail.html?t='+timestamp,
    })
    .when('/maintainSheet/MacNo=:MacNo',{
        templateUrl:'yy_maintain_sheet.html?t='+timestamp,
    })
    .when('/reportError',{
        templateUrl:'yy_report_error.html?t='+timestamp,
    })
	.otherwise({redirectTo:'/login'});

}]);

 
Youcoffee.run(function($rootScope){
    $rootScope.optionSel=new Array();
})



 

//过滤日期
Youcoffee.filter('dateFormatted',function(){
    return function(str){
        return str.substring(5,16);
    }
})
//点击事件实现输入框自动聚焦
Youcoffee.factory('inputFocus',function($timeout,$window){
    return function(id){
        $timeout(function(){
            var element=$window.document.getElementById(id);
            element.focus();
        })
    }
})

//图片压缩
Youcoffee.service('compressImg', function($q,$timeout) {
       var dataURItoBlob = function(dataURI) {  
        var byteString;  
        if (dataURI.split(',')[0].indexOf('base64') >= 0)  
            byteString = atob(dataURI.split(',')[1]);  
        else  
            byteString = unescape(dataURI.split(',')[1]);  
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];           
        var ia = new Uint8Array(byteString.length);  
        for (var i = 0; i < byteString.length; i++) {  
            ia[i] = byteString.charCodeAt(i);  
        }  
        return new Blob([ia], {  
            type: mimeString  
        });  
    };  
  
    var resizeFile = function(file) {  
        var deferred = $q.defer();  
        var img = document.createElement("img");
        var width;
        var height;  
        try {  
            var reader = new FileReader();
            var count=0;  
            reader.onload = function(e) {
                img.src = e.target.result;          
                var canvas = document.createElement("canvas");  
                var ctx = canvas.getContext("2d");  
                ctx.drawImage(img, 0, 0);  
                var MAX_WIDTH = 800;  
                var MAX_HEIGHT = 800;  
               $timeout(function(){
                    width=img.width;
                    height=img.height;
                if (width > height) {  
                    if (width > MAX_WIDTH) {  
                        height *= MAX_WIDTH / width;  
                        width = MAX_WIDTH;  
                    }  
                } else {  
                    if (height > MAX_HEIGHT) {  
                        width *= MAX_HEIGHT / height;  
                        height = MAX_HEIGHT;  
                    }  
                }  
                canvas.width = width;  
                canvas.height = height;  
                var ctx = canvas.getContext("2d");  
                ctx.drawImage(img, 0, 0, width, height);   
                var dataURL = canvas.toDataURL('image/jpeg');  
                var blob = dataURItoBlob(dataURL);  
                deferred.resolve(blob); 
               })   
            };  
            reader.readAsDataURL(file);  
        } catch (e) {  
            deferred.resolve(e);  
        }  
        return deferred.promise;  
  
    };  
    return {  
        resizeFile: resizeFile  
    };  
     
});

 
 //maintainList下拉获取数据
 Youcoffee.factory('Reddit', function($http) {
  var Reddit = function(currIndex,currId,seleData) {
    this.items = [];
    this.busy = false;
    this.after = '';
    this.currIndex=currIndex;
    this.currId=currId;
  };

  Reddit.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        $http({
            method:'POST',
            url:'yy_tpl/maintainList.php',
            data:{flag:this.currIndex,id:this.currId}
        }).then(function successCallback(response){
             if(this.currId==0)return;
              var items=[];
              switch(this.currIndex){
                   case 1:
                        items=response.data.maintain_all;
                         
                        this.currId=response.data.maintain_all_id;
                        break;
                    case 2:
                        items=response.data.maintain_urgent;
                        this.currId=response.data.maintain_pending_id;
                        break;
                     case 3:
                        items=response.data.maintain_pending;
                        this.currId=response.data.maintain_urgent_id;
                        break;   
              }
              for (var i = 0; i < items.length; i++) {
                    if(items[i].MacName.indexOf(']')==-1){
                        items[i].MacName+='['+items[i].MacNo+']';
                    } 
                    this.items.push(items[i]);
              }
              this.busy = false;
        }.bind(this),function errorCallback(response){
            console.log(response);
        })
    };
  return Reddit;
});


//pointList下拉加载数据
Youcoffee.factory('ptLoad', function($http) {
  var ptLoad = function(currIndex,currId,seleData) {
    this.items = [];
    this.busy = false;
    this.after = '';
    this.currIndex=currIndex;
    this.currId=currId;
  };

  ptLoad.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        $http({
            method:'POST',
            url:'yy_tpl/pointList.php',
            data:{flag:this.currIndex,id:this.currId}
        }).then(function successCallback(response){
             if(this.currId==0)return;
              var items=[];
              switch(this.currIndex){
                   case 1:
                        items=response.data.point_all;
                        this.currId=response.data.point_all_id;
                        break;
                    case 2:
                        items=response.data.point_normal;
                        this.currId=response.data.point_normal_id;
                        break;
                     case 3:
                        items=response.data.point_fault;
                        this.currId=response.data.point_fault_id;
                        break;   
              }
              for (var i = 0; i < items.length; i++) {
                if(items[i].MacName.indexOf(']')==-1){
                    items[i].MacName+='['+items[i].MacNo+']';
                } 
                this.items.push(items[i]);
              }
              this.busy = false;
        }.bind(this),function errorCallback(response){
            console.log(response);
        })
    };
  return ptLoad;
});