
Youcoffee.controller('mainNavCtrl',function($scope,$http,$rootScope,$cookieStore){
    $scope.selOption_0=function(i){
        $scope.optionSel[0]=i;
        $rootScope.optionSel[0]=i;
        if(i==3){
           $http({
              method:'POST',
              url:'yy_tpl/logout.php'
           }).then(function successCallback(response){
               console.log(response);
           },function errorCallback(responses){
               console.log(response);
           })
        }
    }
  
})
Youcoffee.controller('loginCtrl' , function($scope, $http){
    $scope.submit = function() {
    var username  = $scope.idLogPhs;
    var password = $scope.idLogPwd;
    if(!username){alert('请填写账号');return;}
    if(!password){alert('请填写密码');return;}
    $http({
      method: 'POST',
      url: 'yy_tpl/login.php',
      data: {username:username, password:password},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(function successCallback(response) {
        console.log(response);
        if(response.data.code == 200){
          location.href = response.data.href;
        }else{
          alert(response.data.tip);
        }
      }, function errorCallback(response){
        // 请求失败执行代码
        alert('服务器请求失败');
        console.log(response);
    });
  }
});

Youcoffee.controller('homeCtrl' , function($scope, $http,$rootScope){
    $scope.optionSel=new Array();
    //到服务器请求数据
    $http({
      method:'POST',
      url:'yy_tpl/home.php'
    }).then(function successCallback(response){
          if(response.data.status == 0){
            alert(response.data.tip);
            location.href=response.data.href;
          }else{
            new Highcharts.Chart('lineChart', {
                    chart:{
                        height:250,
                    },
                    credits:{
                      enabled:false
                    },
                    colors:['#999','orange','#FF0033'],
                    title: {
                        text: null
                    },
                    xAxis:{
                        categories:['1','2','3','4','5','6','7','8','9','10','11',
                        '12','13','14','15','16','17','18','19','20','21','22','23',
                        '24','25','26','27','28','29','30','31'],
                        labels: {  
                            step: 2,  
                        }
                    },
                    yAxis: {
                        title: {
                            text:null
                        },
                        lineColor: 'blue',
                        lineWidth: 1,
                        alternateGridColor: '#eee',
                        tickAmount:7
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 0,
                        itemStyle:{
                          'color':'#999',
                          'fontSize':'12px'
                        }
                    },
                    series: [
                        {
                          name: response.data.monthList.date3,
                          data: response.data.monthList.month3 
                        },
                        {
                          name: response.data.monthList.date2,
                          data: response.data.monthList.month2 
                        },
                        {
                          name: response.data.monthList.date1,
                          data: response.data.monthList.month1 
                        }
                    ],
                    plotOptions: {  
                        series: {
                              marker: {
                                  enabled: true,  
                                  radius: 0,   
                              },
                              lineWidth:1
                          } 
                    } 
                                           
                });
            $scope.maintain={
              'urge':response.data.maintain.weihu_jinji,
              'pending':response.data.maintain.weihu
            }
            $scope.alarm={
              'urge':response.data.maintain.baojin_jinji,
              'pending':response.data.maintain.baojin
            }
            $scope.saleTotal={
              qty0:response.data.saleTotal.qty0,
              qty1:response.data.saleTotal.qty1,
              qty2:response.data.saleTotal.qty2,
              qty3:response.data.saleTotal.qty3,
              qty4:response.data.saleTotal.qty4,
              cpusAve:response.data.saleTotal.cpusAve,
              macTotal:response.data.saleTotal.macTotal
            }  
            $scope.detaiList=response.data.detailList;    
          }
          //跳转至维护页面
          $scope.boldmaintain=function(){
               $scope.optionSel[0]=1;
               $rootScope.optionSel[0]=1;
          }

        },function errorCallback(response){
            console.log(response);
        })
  }) 



Youcoffee.controller('maintainListCtrl',function($scope,$http,Reddit,$timeout,$rootScope,$timeout,$window){  
        $scope.searDetail=true;
        $scope.focusIndex=1;
        $scope.remindTimes=0;
        $scope.currCity='';
        $scope.currPro={};
        $http({
            method:'POST',
            url:'yy_tpl/maintainList.php'
        }).then(function successCallback(response){
            console.log(response);       //获取全部维护清单         
            $scope.maintain_all=response.data.maintain_all;
            $scope.maintain_pending=response.data.maintain_pending;
            $scope.maintain_urgent=response.data.maintain_urgent;
            $scope.maintain_pending_count=response.data.maintain_pending_count;
            $scope.maintain_all_id=response.data.maintain_all_id;
            $scope.maintain_pending_id=response.data.maintain_pending_id;
            $scope.maintain_urgent_id=response.data.maintain_urgent_id;
            $scope.currId=$scope.maintain_all_id;
            for(var i=0;i<$scope.maintain_all.length;i++){
                if($scope.maintain_all[i].MacName.indexOf(']')==-1){
                   $scope. maintain_all[i].MacName+='['+$scope. maintain_all[i].MacNo+']';
                }
            }
            for(var i=0;i<$scope.maintain_pending.length;i++){
                if($scope.maintain_pending[i].MacName.indexOf(']')==-1){
                   $scope. maintain_pending[i].MacName+='['+$scope. maintain_pending[i].MacNo+']';
                }
            }
            for(var i=0;i<$scope.maintain_urgent.length;i++){
                if($scope.maintain_urgent[i].MacName.indexOf(']')==-1){
                   $scope. maintain_urgent[i].MacName+='['+$scope. maintain_urgent[i].MacNo+']';
                }
            }
            //触发滚动事件
            $scope.reddit=new Reddit($scope.focusIndex,$scope.currId);

            //撤单操作
            $scope.cancelOrder=function(index){
                $scope.confirm=confirm('确认撤单？');
                if($scope.confirm){
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{flag:4,id:index}
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){                   
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }
           //催单操作
          $scope.remindOrder=function(UID,MacNo,MacName,Error,Addr){
              $scope.confirm=confirm('确认催单？');
                if($scope.confirm){
                    $scope.operateFlag=5;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{
                          flag:$scope.operateFlag,
                          id:UID,
                          MacNo:MacNo,
                          MacName:MacName,
                          Error:Error,
                          Addr:Addr
                        }
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){                   
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }


               $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php'
                }).then(function successCallback(response){
                      if(response.data.status == 0){
                          alert(response.data.tip);
                          location.href=response.data.href;
                      }else{
                        $scope.flag=false;               //下拉列表隐藏与显示
                        $scope.province=[];
                        $scope.toggle=function(){
                          $scope.flag=!$scope.flag;
                        }
                       //加载省市下拉列表
                      $scope.province=response.data.ProvinceList;
                         $scope.allPro={
                              Province:"全部",
                              chirldren:[]
                         }
                         $scope.shifCity={
                            City:'全部'
                         }
                         $scope.province.unshift($scope.allPro);
                         for(var i=0;i<$scope.province.length;i++){
                            $scope.province[i].chirldren.unshift($scope.shifCity);
                         }

                      }
                },function errorCallback(response){
                    console.log(response);
                })  
     
           //动态选择导航栏
            $scope.navSwitch=function(index,currId){
                $scope.focusIndex=index;
                switch($scope.focusIndex){
                    case 1:
                        $scope.currId=$scope.maintain_all_id;
                        break;
                    case 2:
                        $scope.currId=$scope.maintain_pending_id;
                        break;
                    case 3:
                        $scope.currId=$scope.maintain_urgent_id;
                       break; 
             }              
              $scope.reddit=new Reddit($scope.focusIndex,$scope.currId);  
              //撤单操作
            $scope.cancelOrder=function(index){
                $scope.confirm=confirm('确认撤单？');
                if($scope.confirm){
                    $scope.operateFlag=4;
                    $scope.operateId=index;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{flag:$scope.operateFlag,id:$scope.operateId}
                    }).then(function successCallback(response){  
                        alert(response.data.tip);
                        $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                      },function errorCallback(response){
                        console.log(response);
                      })
                      
                }
              }

               //催单操作
          $scope.remindOrder=function(UID,MacNo,MacName,Error,Addr){
              $scope.confirm=confirm('确认催单？');
                if($scope.confirm){
                    $scope.operateFlag=5;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{
                          flag:$scope.operateFlag,
                          id:UID,
                          MacNo:MacNo,
                          MacName:MacName,
                          Error:Error,
                          Addr:Addr
                        }
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }

            }
        },function errorCallback(response){
              console.log(response);
        });
        //提交表单，查询相关维护订单
        $scope.submit=function(){
           $scope.tdata={
                Province:$scope.currPro.Province,
                City:$scope.currCity.City,
                MaintainName:$scope.mtStuff,
                Key:$scope.pointInfo
            } 
            $scope.flag=!$scope.flag;
            $http({
               method:'POST',
               url:'yy_tpl/maintainList.php',
               data:$scope.tdata
            }).then(function successCallback(response){
                console.log(response);
                $scope.searDetail=false;
                $scope.focusIndex=1;
                $scope.maintain_all=response.data.maintain_all;
                $scope.maintain_pending=response.data.maintain_pending;
                $scope.maintain_urgent=response.data.maintain_urgent;
                $scope.maintain_pending_count=response.data.maintain_pending_count;
                $scope.maintain_all_id=response.data.maintain_all_id;
                $scope.maintain_pending_id=response.data.maintain_pending_id;
                $scope.maintain_urgent_id=response.data.maintain_urgent_id;
                $scope.currId=$scope.maintain_all_id;
                for(var i=0;i<$scope.maintain_all.length;i++){
                    if($scope.maintain_all[i].MacName.indexOf(']')==-1){
                       $scope. maintain_all[i].MacName+='['+$scope. maintain_all[i].MacNo+']';
                    }
                }
                for(var i=0;i<$scope.maintain_pending.length;i++){
                    if($scope.maintain_pending[i].MacName.indexOf(']')==-1){
                       $scope. maintain_pending[i].MacName+='['+$scope. maintain_pending[i].MacNo+']';
                    }
                }
                for(var i=0;i<$scope.maintain_urgent.length;i++){
                    if($scope.maintain_urgent[i].MacName.indexOf(']')==-1){
                       $scope. maintain_urgent[i].MacName+='['+$scope. maintain_urgent[i].MacNo+']';
                    }
                }
                //触发滚动事件
                $scope.reddit=new Reddit($scope.focusIndex,$scope.currId);
                //撤单操作
                $scope.cancelOrder=function(index){
                    $scope.confirm=confirm('确认撤单？');
                    if($scope.confirm){
                        $scope.operateFlag=4;
                        $scope.operateId=index;
                        $http({
                          method:'POST',
                          url:'yy_tpl/maintainList.php',
                          data:{flag:$scope.operateFlag,id:$scope.operateId}
                        }).then(function successCallback(response){  
                            alert(response.data.tip);
                            $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                          },function errorCallback(response){
                            console.log(response);
                          })
                          
                    }
                } 

                 //催单操作
            $scope.remindOrder=function(UID,MacNo,MacName,Error,Addr){
              $scope.confirm=confirm('确认催单？');
                if($scope.confirm){
                    $scope.operateFlag=5;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{
                          flag:$scope.operateFlag,
                          id:UID,
                          MacNo:MacNo,
                          MacName:MacName,
                          Error:Error,
                          Addr:Addr
                        }
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }

                //加载数据后获取子页面ID
                switch($scope.focusIndex){
                        case 1:
                            $scope.currId=$scope.maintain_all_ID;
                            break;
                        case 2:
                            $scope.currId=$scope.maintain_pending_ID;
                            break;
                        case 3:
                            $scope.currId=$scope.maintain_urgent_ID;
                           break; 
               }   
            //动态选择导航栏
            $scope.navSwitch=function(index,currId){
                $scope.focusIndex=index;
                switch($scope.focusIndex){
                    case 1:
                        $scope.currId=$scope.maintain_all_id;
                        break;
                    case 2:
                        $scope.currId=$scope.maintain_pending_id;
                        break;
                    case 3:
                        $scope.currId=$scope.maintain_urgent_id;
                       break; 
               }  
            $scope.reddit=new Reddit($scope.focusIndex,$scope.currId);   
            //撤单操作
            $scope.cancelOrder=function(index){
                $scope.confirm=confirm('确认撤单？');
                if($scope.confirm){
                    $scope.operateFlag=4;
                    $scope.operateId=index;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{flag:$scope.operateFlag,id:$scope.operateId}
                    }).then(function successCallback(response){  
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                      },function errorCallback(response){
                        console.log(response);
                      })
                      
                }
            }  
             //催单操作
          $scope.remindOrder=function(UID,MacNo,MacName,Error,Addr){
              $scope.confirm=confirm('确认催单？');
                if($scope.confirm){
                    $scope.operateFlag=5;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{
                          flag:$scope.operateFlag,
                          id:UID,
                          MacNo:MacNo,
                          MacName:MacName,
                          Error:Error,
                          Addr:Addr
                        }
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }      
            }             
                $scope.flag=false;
                $scope.toggle=function(){
                  $scope.flag=!$scope.flag;
                }
            },function errorCallback(response){
              console.log(response);
            }) 
               
      }
})



Youcoffee.controller('maintainDetailCtrl',function($scope,$http,$routeParams){
      $scope.currID=$routeParams.id;
      $http({
        method:'POST',
        url:'yy_tpl/maintainDetail.php',
        data:{id:$scope.currID}
      }).then(function successCallback(response){
          console.log(response);
          //填充数据
          $scope.detailData={
              MacNo:response.data.data.MacNo,
              MacName:response.data.data.MacName,
              stock:response.data.data.stock,
              Number:response.data.data.Number,
              fault:response.data.data.fault,
              Times:response.data.data.Times,
              AskTime:response.data.data.AskTime,
              CreateName:response.data.data.CreateName,
              Priority:response.data.data.Priority,
              MaintainName:response.data.data.MaintainName,
              ID:response.data.data.ID,
              ErrorDesc:response.data.data.ErrorDesc,
              CreateTime:response.data.data.CreateTime,
              ReminderTime:response.data.data.ReminderTime
          }
          //撤单操作
           $scope.cancelOrder=function(){
                $scope.confirm=confirm('确认撤单？');
                if($scope.confirm){
                    $scope.operateFlag=1;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainDetail.php',
                      data:{flag:$scope.operateFlag,id:$scope.detailData.ID}
                    }).then(function successCallback(response){  
                          console.log(response);
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                      },function errorCallback(response){
                          console.log(response);
                      })             
                }
            }   
             //催单操作
          $scope.remindOrder=function(){
              $scope.confirm=confirm('确认催单？');
                if($scope.confirm){
                    $scope.operateFlag=5;
                    $http({
                      method:'POST',
                      url:'yy_tpl/maintainList.php',
                      data:{
                          flag:$scope.operateFlag,
                          id:$scope.detailData.ID,
                          MacNo:$scope.detailData.MacNo,
                          MacName:$scope.detailData.MacName,
                          Error:$scope.detailData.ErrorDesc,
                        }
                    }).then(function successCallback(response){  
                        console.log(response);
                        if(response.data.status==1){
                          alert(response.data.tip);
                          $scope.maintain_all=response.data.maintain_all;
                          $scope.maintain_pending=response.data.maintain_pending;
                          $scope.maintain_urgent=response.data.maintain_urgent;
                        }
                      },function errorCallback(response){
                        console.log(response);
                      })         
                }
            }
      },function errorCallback(response){
          console.log(response);
      })
    
})



Youcoffee.controller('startMaintainCtrl',function($scope,$http,$interval,$filter,$routeParams,$window,inputFocus){
      $scope.currID=$routeParams.id;
      $scope.flag=true;
      $scope.timeStart=0;
      $scope.remoOpen=false;
      $scope.remoRest=false;
      $scope.mtSel=false;
      $scope.relock=false;
      $scope.scshot=false;
      $scope.txtpsw='';
      $scope.respsw='';
      $scope.checkboxid=[];
      $http({
        method:'POST',
        url:'yy_tpl/startMaintain.php',
        data:{id:$scope.currID}
      }).then(function successCallback(response){
          console.log(response);
          $scope.MacName=response.data.data.MacName;
          $scope.stock=response.data.data.stock;
          $scope.fault=response.data.data.fault;
          $scope.Priority=response.data.data.Priority;
          $scope.Types=response.data.data.Types;
          $scope.StartTime=response.data.data.StartTime;
          $scope.MacNo=response.data.data.MacNo;

          //动态显示耗时时间
          if($scope.StartTime){
              $interval.cancel($scope.timer);
              $scope.timer=$interval(function(){
              $scope.currTime=new Date().getTime();
              $scope.startTime=new Date($scope.StartTime).getTime();
              $scope.timeCost=$scope.currTime-$scope.startTime;             //时间戳毫秒差
              $scope.showDays=parseInt($scope.timeCost/(24*3600*1000));       //剩余天数
              $scope.leave1=$scope.timeCost%(24*3600*1000);              //计算天数后剩余的毫秒数
              $scope.showHours=parseInt($scope.leave1/(3600*1000));           //计算出小时数
              $scope.leave2=$scope.leave1%(3600*1000);
              $scope.showMinutes=parseInt($scope.leave2/(1000*60));       //计算秒数
              $scope.leave3=$scope.leave2%(1000*60);
              $scope.showSeconds=Math.floor($scope.leave3/1000);
              },1000)
          }

          //点击开始维护
          $scope.stmaintain=function(){
              $http({
                method:'POST',
                url:'yy_tpl/startMaintain.php',
                data:{flag:1,id:$scope.currID}
              }).then(function successCallback(response){
                  console.log(response);
                  if(response.data.status==1){
                      $scope.StartTime=response.data.time;
                      $interval.cancel($scope.timer);
                      $scope.timer=$interval(function(){
                      $scope.currTime=new Date().getTime();
                      $scope.startTime=new Date($scope.StartTime).getTime();
                      $scope.timeCost=$scope.currTime-$scope.startTime;             //时间戳毫秒差
                      $scope.showDays=Math.floor($scope.timeCost/(24*3600*1000));       //剩余天数
                      $scope.leave1=$scope.timeCost%(24*3600*1000);              //计算天数后剩余的毫秒数
                      $scope.showHours=Math.floor($scope.leave1/(3600*1000));           //计算出小时数
                      $scope.leave2=$scope.leave1%(3600*1000);
                      $scope.showMinutes=Math.floor($scope.leave2/(1000*60));       //计算秒数
                      $scope.leave3=$scope.leave2%(1000*60);
                      $scope.showSeconds=Math.floor($scope.leave3/1000);
                    },1000)     
                  }
                      
              },function errorCallback(response){
                    console.log(response);
              })
          }  
          $scope.operate=function(mt){
             $scope.flag=!$scope.flag;
             if(mt){
                $scope.addMt=0;
                $scope.Materials=mt.Materials;
                $scope.Stock=mt.Stock;
                $scope.stockid=mt.ID;
                $scope.adjustCon=parseInt($scope.addMt)+parseInt($scope.Stock); //更新输入框
                $scope.addSt=function(){
                    $scope.adjustCon=parseInt($scope.addMt)+parseInt($scope.Stock);         
                }
                //调整库存
                $scope.submit=function(){
                  $scope.adjustCon=parseInt($scope.addMt)+parseInt($scope.Stock);
                  $scope.flag=!$scope.flag;      
                  if(String(Number($scope.adjustCon)) !== 'NaN'){
                      $http({
                        method:'POST',
                        url:'yy_tpl/startMaintain.php',
                        data:{flag:4,stock:$scope.adjustCon,stockid:$scope.stockid,id:$scope.currID}
                      }).then(function successCallback(response){
                            console.log(response);
                            $scope.stock=response.data.data.stock;
                            if(response.data.status == 0){
                                alert(response.data.tip);
                            }
                      },function errorCallback(response){
                            console.log(response);
                      })
                  }
                }
             }
          }
          $scope.remoteOpen=function(){
              $scope.remoOpen=!$scope.remoOpen;
              inputFocus('opdInput');
          }
          $scope.remoteRest=function(){
              $scope.remoRest=!$scope.remoRest;
              inputFocus('rstInput');
          }
          $scope.mtfinish=function(){
              $scope.mtSel=!$scope.mtSel;
          }
          $scope.reLock=function(){
              $scope.relock=!$scope.relock;
              inputFocus('reloInput');
          }
          //远程开门
          $scope.remoteOpenSub=function(){
              if(!$scope.txtpsw){
                alert('请输入密码！');
              }else{
                $scope.remoOpen=!$scope.remoOpen;
                $http({
                  method:'POST',
                  url:'yy_tpl/startMaintain.php',
                  data:{Pwd:$scope.txtpsw,MacNo:$scope.MacNo}
                }).then(function(response){
                    console.log(response);
                    alert(response.data.tip);
                })
              }
          }

          //远程重启
          $scope.remoteResSub=function(){
            if(!$scope.respsw){
                alert('请输入密码');
            }else{
                $scope.remoRest=!$scope.remoRest;
                $http({
                  method:'POST',
                  url:'yy_tpl/startMaintain.php',
                  data:{flag:2,Pwd:$scope.respsw,MacNo:$scope.MacNo}
                }).then(function(response){
                    console.log(response);
                    alert(response.data.tip);
                })
            }
          }
           //重锁杯门
          $scope.reLockSub=function(){
             if(!$scope.relopsw){
                alert('请输入密码');
              }else{
                $scope.relock=!$scope.relock;
                $http({
                  method:'POST',
                  url:'yy_tpl/startMaintain.php',
                  data:{flag:6,Pwd:$scope.relopsw,MacNo:$scope.MacNo}
                }).then(function(response){
                    console.log(response);
                    alert(response.data.tip);
                })
              }
          }
          //清除错误
          $scope.cleanError=function(){
              $http({
                method:'POST',
                url:'yy_tpl/startMaintain.php',
                data:{flag:7,MacNo:$scope.MacNo}
              }).then(function successCallback(response){
                    console.log(response);
                    alert(response.data.tip);
              },function errorCallback(response){
                    console.log(response);
              })
          }
          //截屏
          $scope.screenShot=function(){
            $http({
              method:'POST',
              url:'yy_tpl/startMaintain.php',
              data:{flag:8,MacNo:$scope.MacNo}
            }).then(function successCallback(response){
                console.log(response);
                $scope.resUrl=response.data.url;
                $scope.scshot=!$scope.scshot;
            },function errorCallback(response){
                console.log(response);
            })
          }

          $scope.isChecked=function(ev,id){
              if(ev.target.checked){
                $scope.checkboxid.push(id);
              }else{
                $scope.checkboxid.pop(id); 
              }
          }
          //选择已完成的故障
          $scope.mtfinishSub=function(){
            console.log($scope.checkboxid);
            $scope.mtSel=!$scope.mtSel;
            if($scope.checkboxid.length != 0){       
                $http({
                  method:'POST',
                  url:'yy_tpl/startMaintain.php',
                  data:{errorId:$scope.checkboxid,id:$scope.currID,flag:5}
                }).then(function successCallback(response){
                      console.log(response);
                      alert(response.data.tip);
                      location.href=response.data.href;
                },function errorCallback(response){
                      console.log(response);
                })
             } 
          }
      },function errorCallback(response){
          console.log(response);
      })
})

Youcoffee.controller('maintainSheetCtrl',function($scope,$http,$filter,$routeParams,$rootScope){
      $scope.day_1=new Date().valueOf();
      $scope.day_2=$scope.day_1+1*24*60*60*1000;
      $scope.day_3=$scope.day_1+2*24*60*60*1000;
      $scope.day_4=$scope.day_1+3*24*60*60*1000;
      $scope.day_5=$scope.day_1+4*24*60*60*1000;
      $scope.day_6=$scope.day_1+5*24*60*60*1000;
      $scope.day_7=$scope.day_1+6*24*60*60*1000;
      $scope.day_8=$scope.day_1+7*24*60*60*1000;
      $scope.day_9=$scope.day_1+8*24*60*60*1000;
      $scope.day_10=$scope.day_1+9*24*60*60*1000;
      $scope.dates=[
          '今天',
          $filter('date')($scope.day_2,'yyyy-MM-dd'),
          $filter('date')($scope.day_3,'yyyy-MM-dd'),
          $filter('date')($scope.day_4,'yyyy-MM-dd'),
          $filter('date')($scope.day_5,'yyyy-MM-dd'),
          $filter('date')($scope.day_6,'yyyy-MM-dd'),
          $filter('date')($scope.day_7,'yyyy-MM-dd'),
          $filter('date')($scope.day_8,'yyyy-MM-dd'),
          $filter('date')($scope.day_9,'yyyy-MM-dd'),
          $filter('date')($scope.day_10,'yyyy-MM-dd')
      ];
      $scope.options=['紧急','一般','延迟'];
      $scope.ErrorDesc='';
      $scope.submit=function(){
          if($scope.selDate == '今天'){
              $scope.AskTime=$filter('date')($scope.day_1,'yyyy-MM-dd');
          }else{
              $scope.AskTime=$scope.selDate;
          }
          switch($scope.selePri){
              case '一般':
                    $scope.Priority=2;
                    break;
              case '紧急':
                    $scope.Priority=1;
                    break;
              case '延迟':
                    $scope.Priority=3;
                    break;
          }
          if($scope.ErrorDesc.length<3){
              alert('请简要描述遇到的问题（至少三个字）');
          }else{
              $http({
                  method:'POST',
                  url:'yy_tpl/maintainSheet.php',
                  data:{
                    flag:true,
                    Priority:$scope.Priority,
                    MacNo:$routeParams.MacNo,
                    AskTime:$scope.AskTime,
                    ErrorDesc:$scope.ErrorDesc
                  }
                }).then(function successCallback(response){
                      console.log(response);
                      if(response.data.status==1){
                            alert(response.data.tip);
                            location.href=response.data.href;
                            $scope.optionSel[0]=1;
                            $rootScope.optionSel[0]=1;
                      }else{
                        alert(response.data.tip);
                      }
                },function errorCallback(response){
                      console.log(response);
                })
              }
      }
})





Youcoffee.controller('reportErrorCtrl',function($scope,$http,$routeParams,compressImg){
      $scope.macNo=$routeParams.macNo;
      $scope.problemDesc='';
      $scope.problemTypes=['卡杯','断网','机器故障'];
      $scope.selPriority=['严重','一般','正常'];
 
    //   //图片上传
      $scope.reader = new FileReader();     //h5新API用于读取文件中的数据 
      $scope.thumb = {};
      $scope.form={
        image:{}
      }; 
      $scope.count=0;
      $scope.img_upload = function(files){ 
            if($scope.count>2){
                  alert('最多只能上传三张图片！');
            }else{       
              $scope.count++;
              compressImg.resizeFile(files[0]).then(function(blob_data){
                  var formData=new FormData();
                  formData.append('img',blob_data);
                  $http({
                      method:'POST',
                      url:'yy_tpl/ngupload.php',
                      data:formData,
                      headers: {'Content-Type': undefined },  
                      transformRequest: angular.identity
                  }).then(function successCallback(response){
                      console.log(response);         
                      $scope.guid=(new Date()).valueOf();
                      $scope.thumb[$scope.guid]={
                            imgSrc:response.data.url
                      };
                      $scope.form.image[$scope.guid]=response.data.url;
                      //图片删除操作
                      $scope.img_del=function(index){
                          $scope.guidArr=[];
                          for(var i in $scope.thumb){
                              $scope.guidArr.push(i);
                          }
                          delete $scope.thumb[$scope.guidArr[index]];
                          delete $scope.form.image[$scope.guidArr[index]];
                          $scope.count--;
                      }
                  },function errorCallback(response){
                      console.log(response);
                  })
                },function(errorReason){
                    console.log('uploaded error...');
                })
             }
        }  
     
    $scope.submitError=function(){
        $scope.imgArr=[];
        for(var p in $scope.form.image){
          $scope.imgArr.push($scope.form.image[p]);
        }
        switch($scope.priority){
              case '严重':
                    $scope.PriorityNum=1;
                    break;
              case '一般':
                    $scope.PriorityNum=2;
                    break;
              case '正常':
                    $scope.PriorityNum=3;
                    break;
        }
        console.log($scope.PriorityNum);
        if($scope.problemDesc.length<3){
          alert('问题描述填写至少三个字符！');
        }else{
          
          $http({
              method:'POST',
              url:'yy_tpl/reportError.php',
              data:{
                QuestionType:$scope.selectedName,
                ErrorDesc:$scope.problemDesc,
                MacNo:$scope.macNo,
                Priority:$scope.PriorityNum,
                img:$scope.imgArr
              }
          }).then(function(response){
              console.log(response);
              alert(response.data.tip);
              location.href=response.data.href;

          },function(response){
              console.log(response);
          })
        }   
    }
});


Youcoffee.controller('pointListCtrl',function($scope,$http,ptLoad){
        $scope.searDetail=true;
        $scope.focusIndex=1;
        $scope.remindTimes=0;
        $http({
            method:'POST',
            url:'yy_tpl/pointList.php'
        }).then(function successCallback(response){
            console.log(response);       //获取全部维护清单         
            $scope.point_all=response.data.point_all;
            $scope.point_normal=response.data.point_normal;
            $scope.point_fault=response.data.point_fault;
            $scope.point_fault_count=response.data.point_fault_count;
            $scope.point_all_id=response.data.point_all_id;
            $scope.point_normal_id=response.data.point_normal_id;
            $scope.point_fault_id=response.data.point_fault_id;
            $scope.currId=$scope.point_all_id;
            for(var i=0;i<$scope.point_all.length;i++){
                if($scope.point_all[i].MacName.indexOf(']')==-1){
                   $scope. point_all[i].MacName+='['+$scope. point_all[i].MacNo+']';
                }
            }
            for(var i=0;i<$scope.point_normal.length;i++){
                if($scope.point_normal[i].MacName.indexOf(']')==-1){
                   $scope. point_normal[i].MacName+='['+$scope. point_normal[i].MacNo+']';
                }
            }
            for(var i=0;i<$scope.point_fault.length;i++){
                if($scope.point_fault[i].MacName.indexOf(']')==-1){
                   $scope. point_fault[i].MacName+='['+$scope. point_fault[i].MacNo+']';
                }
            }
            //触发滚动事件
            $scope.ptLoad=new ptLoad($scope.focusIndex,$scope.currId);
         
            //动态选择导航栏
            $scope.navSwitch=function(index,currId){
                $scope.focusIndex=index;
                switch($scope.focusIndex){
                    case 1:
                        $scope.currId=$scope.point_all_id;
                        break;
                    case 2:
                        $scope.currId=$scope.point_normal_id;
                        break;
                    case 3:
                        $scope.currId=$scope.point_fault_id;
                       break; 
             }              
              $scope.ptLoad=new ptLoad($scope.focusIndex,$scope.currId);  
            }
        },function errorCallback(response){
              console.log(response);
        });
      
        $scope.flag=false;
        $scope.toggle=function(){
          $scope.flag=!$scope.flag;
        }
        //获取市区下拉列表
        $http({
              method:'POST',
              url:'yy_tpl/pointList.php'
        }).then(function successCallback(response){
              if(response.data.status == 0){
                  alert(response.data.tip);
                  location.href=response.data.href;
              }else{
                  //加载省市下拉列表
                 $scope.province=response.data.ProvinceList;
                 $scope.allPro={
                      Province:"全部",
                      chirldren:[]
                 }
                 $scope.shifCity={
                    City:'全部'
                 }
                 $scope.province.unshift($scope.allPro);
                 for(var i=0;i<$scope.province.length;i++){
                    $scope.province[i].chirldren.unshift($scope.shifCity);
                 }
              }
        },function errorCallback(response){
            console.log(response);
        })
        //提交表单，查询相关维护订单
        $scope.submit=function(){         
            $scope.tdata={
                Province:$scope.currPro.Province,
                City:$scope.currCity.City,
                MaintainName:$scope.mtStuff,
                Key:$scope.pointInfo
            } 
            $scope.flag=!$scope.flag;
            $http({
               method:'POST',
               url:'yy_tpl/pointList.php',
               data:$scope.tdata
            }).then(function successCallback(response){
                console.log(response);
                $scope.searDetail=false;
                $scope.focusIndex=1;
                $scope.point_all=response.data.point_all;
                $scope.point_normal=response.data.point_normal;
                $scope.point_fault=response.data.point_fault;
                $scope.point_fault_count=response.data.point_fault_count;
                $scope.point_all_id=response.data.point_all_id;
                $scope.point_normal_id=response.data.point_normal_id;
                $scope.point_fault_id=response.data.point_fault_id;
                $scope.currId=$scope.point_all_id;
                for(var i=0;i<$scope.point_all.length;i++){
                if($scope.point_all[i].MacName.indexOf(']')==-1){
                       $scope. point_all[i].MacName+='['+$scope. point_all[i].MacNo+']';
                    }
                }
                for(var i=0;i<$scope.point_normal.length;i++){
                    if($scope.point_normal[i].MacName.indexOf(']')==-1){
                       $scope. point_normal[i].MacName+='['+$scope. point_normal[i].MacNo+']';
                    }
                }
                for(var i=0;i<$scope.point_fault.length;i++){
                    if($scope.point_fault[i].MacName.indexOf(']')==-1){
                       $scope. point_fault[i].MacName+='['+$scope. point_fault[i].MacNo+']';
                    }
                }
                //触发滚动事件
                $scope.ptLoad=new ptLoad($scope.focusIndex,$scope.currId);  
            //动态选择导航栏
            $scope.navSwitch=function(index,currId){
                $scope.focusIndex=index;
                switch($scope.focusIndex){
                    case 1:
                        $scope.currId=$scope.point_all_id;
                        break;
                    case 2:
                        $scope.currId=$scope.point_normal_id;
                        break;
                    case 3:
                        $scope.currId=$scope.point_fault_id;
                       break; 
               }        
            $scope.ptLoad=new ptLoad($scope.focusIndex,$scope.currId);        
            }             
            $scope.flag=false;
            $scope.toggle=function(){
              $scope.flag=!$scope.flag;
            }
            },function errorCallback(response){
              console.log(response);
            }) 
               
      }
})


Youcoffee.controller('pointDetailCtrl',function($http,$scope,$routeParams,inputFocus){
  $scope.open=false;
  $scope.rest=false;
  $scope.ptdrelock=false;
  $scope.scshot=false;
    $http({
      method:'POST',
      url:'yy_tpl/pointDetail.php',
      data:{id:$routeParams.id}
    }).then(function(response){
        console.log(response);
        $scope.MacName=response.data.data.MacName;
        $scope.stock=response.data.data.stock;
        $scope.today_sale=response.data.data.today_sale;
        $scope.seven_sale=response.data.data.seven_sale;
        $scope.month_sale=response.data.data.month_sale;
        $scope.LastTouchTime=response.data.data.LastTouchTime;
        $scope.LastOrderTime=response.data.data.LastOrderTime;
        $scope.OptName=response.data.data.OptName; //维护员
        $scope.Area=response.data.data.Area;
        $scope.UserName=response.data.data.UserName; //业务员
        $scope.job=response.data.data.job;      //开始维护还是新建维护
        $scope.ID=response.data.data.ID;
        $scope.MacNo=response.data.data.MacNo;
        if($scope.today_sale.Q == 0){
          $scope.tsPrice=0;
        }else{
          $scope.tsPrice=parseInt($scope.today_sale.M)/parseInt($scope.today_sale.Q);
        }
        if($scope.month_sale.Q == 0){
          $scope.msPrice=0;
        }else{
          $scope.msPrice=parseInt($scope.month_sale.M)/parseInt($scope.month_sale.Q);
        }
        if($scope.seven_sale.Q == 0){
          $scope.ssPrice=0;
        }else{
          $scope.ssPrice=parseInt($scope.seven_sale.M)/parseInt($scope.seven_sale.Q);
        }
        $scope.pdtOpen=function(){
              $scope.open=!$scope.open;
              inputFocus('opdInput');
        }
        $scope.pdtRest=function(){
            $scope.rest=!$scope.rest;
            inputFocus('rstInput');
        }
        $scope.ptdRelock=function(){
          $scope.ptdrelock=!$scope.ptdrelock;
          inputFocus('reloInput');
        }
        //远程开门
          $scope.pdtOpenSub=function(){
              if(!$scope.txtpsw){
                alert('请输入密码！');
              }else{
                $scope.open=!$scope.open;
                $http({
                  method:'POST',
                  url:'yy_tpl/pointDetail.php',
                  data:{flag:1,Pwd:$scope.txtpsw,MacNo:$scope.MacNo}
                }).then(function(response){
                    console.log(response);
                    alert(response.data.tip);
                })
              }
          }
          //远程重启
          $scope.pdtRestSub=function(){
            if(!$scope.respsw){
                alert('请输入密码');
            }else{
                $scope.rest=!$scope.rest;
                $http({
                  method:'POST',
                  url:'yy_tpl/pointDetail.php',
                  data:{flag:2,Pwd:$scope.respsw,MacNo:$scope.MacNo}
                }).then(function(response){
                    console.log(response);
                    alert(response.data.tip);
                })
            }
          }
          //重锁杯门
          $scope.ptdRelockSub=function(){
            if(!$scope.relopsw){
                alert('请输入密码');
              }else{
                $scope.ptdrelock=!$scope.ptdrelock;
                $http({
                  method:'POST',
                  url:'yy_tpl/pointDetail.php',
                  data:{flag:3,Pwd:$scope.relopsw,MacNo:$scope.MacNo}
                }).then(function successCallback(response){
                    console.log(response);
                    alert(response.data.tip);
                },function errorCallback(response){
                    console.log(response);
                })
            }
          }
           //清除错误
          $scope.ptdCleError=function(){
              $http({
                method:'POST',
                url:'yy_tpl/pointDetail.php',
                data:{flag:4,MacNo:$scope.MacNo}
              }).then(function successCallback(response){
                    console.log(response);
                    alert(response.data.tip);
              },function errorCallback(response){
                    console.log(response);
              })
          }
          //截屏
          $scope.ptdScshot=function(){
            $http({
              method:'POST',
              url:'yy_tpl/pointDetail.php',
              data:{flag:5,MacNo:$scope.MacNo}
            }).then(function successCallback(response){
                console.log(response);
                $scope.resUrl=response.data.url;
                $scope.scshot=!$scope.scshot;
            },function errorCallback(response){
                console.log(response);
            })
          }



    },function(response){
        console.log(response);
    })
})

































































































