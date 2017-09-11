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

 
Youcoffee.run(function($rootScope,$location){
    $rootScope.optionSel=new Array();
})

