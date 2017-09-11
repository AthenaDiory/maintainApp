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
    this.tdata=seleData;
  };

  Reddit.prototype.nextPage = function(){
        var data={}; 
        if(this.tdata){
            this.tdata.flag=this.currIndex
            this.tdata.id=this.currId;
            data=this.tdata;
        }else{
            data.flag=this.currIndex;
            data.id=this.currId;
        }
        if (this.busy) return;
        this.busy = true;
        $http({
            method:'POST',
            url:'yy_tpl/maintainList.php',
            data:data
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
                        items[i].MacName='['+items[i].MacNo+']'+items[i].MacName;
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
    this.tdata=seleData;
  };

  ptLoad.prototype.nextPage = function(){
        var data={};
        if(this.tdata){
            this.tdata.flag=this.currIndex
            this.tdata.id=this.currId;
            data=this.tdata;
        }else{
            data.flag=this.currIndex;
            data.id=this.currId;
        }
        if (this.busy) return;
        this.busy = true;
        $http({
            method:'POST',
            url:'yy_tpl/pointList.php',
            data:data
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
                    items[i].MacName='['+items[i].MacNo+']'+items[i].MacName;
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