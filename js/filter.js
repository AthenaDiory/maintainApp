//过滤日期
Youcoffee.filter('dateFormatted',function(){
    return function(str){
        return str.substring(5,16);
    }
})