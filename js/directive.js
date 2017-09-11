//获取登录id
Youcoffee.directive('openId',function($http){
    return{
        restrict:'A',
        link:function(scope,elem,attrs){
            $http({
                method:'POST',
                url:'yy_tpl/openID.php',
                data:{cfOpenID:attrs.value}
            }).then(function successCallback(response){
                console.log(response);
            })
        }
    }
})