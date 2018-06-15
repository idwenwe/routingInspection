apiready = function(){
    var info = api.pageParam.info;
    var history = info.history;
    info.history.page = "main";
    info.history.url = "../html/main.html";

    //将当前的页面设置为占用手机就全屏内容。
    var mainH = api.winHeight - $api.offset($api.byId("header")).h - $api.offset($api.byId("footer")).h;
    $api.byId("main").setAttribute("style", "height:" + mainH + "px;");


    //存储选择的巡检任务人员，存储其ID以及名称。
    var checkList = [];
    var url = "";


    //添加用户选择列表项目,并未其添加点击选择事件。
    var addPersons = function(userId, name, classes, choose, unchoose){
    	var str = "<img src='../icon/checkbox.png' class='checkbox'/>"+
            "<img src='../icon/checkbox-check.png' class='checkbox-check' id="+("checkbox"+userId)+" hidden='hidden'/>" +
            "<span class='list-worker-name'>"+ ("" + name) + "</span>" ;
            // "<span class='list-worker-info'>" + ("" + info) + "</span>";
    	var ele = document.createElement("div");
    	if(classes){
    		ele.setAttribute("class", "" + classes);
    	}
    	else{
    		ele.setAttribute("class", "list-info");
    	}
    	ele.innerHTML = str;
    	$api.byId("listContent").appendChild(ele);
    	ele.addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		var eles = $api.byId("checkbox"+userId);
    		if(eles.getAttribute("hidden")){
    			eles.removeAttribute("hidden");
    			checkList.unshift({id:userId, name:name});
    		}
    		else {
    			eles.setAttribute("hidden", "hidden");
    			for(var i = 0 ; i < checkList.length; i++){
    				if(checkList[i].id == userId && checkList[i].name == name){
    					checkList.splice(i, 1);
    					break;
    				}
    			}
    		}
    	})
    }

    var dynamicWeb = function(){

    	$api.byId("starTaskBtn").addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		$api.byId("signIn").removeAttribute("style");
    		setTimeout(function(){
    			$api.byId("finalCheck").setAttribute("style", "display:none;");
    		},1000);
    	});

      $api.byId("blackMode").addEventListener("click", function(e){
			  e.preventDefault();
    		e.stopPropagation();
    		$api.byId("blackMode").setAttribute("style", "display:none;");
    		$api.byId("chooseConn").setAttribute("style", "display:none;");
    	});

    	$api.byId("toChooseConnect").addEventListener("click", function(e){
			  e.preventDefault();
    		e.stopPropagation();
    		$api.byId("blackMode").removeAttribute("style");
    		$api.byId("chooseConn").removeAttribute("style");
    	});

    	$api.byId("checkout").addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		$api.byId("blackMode").setAttribute("style", "display:none;");
    		$api.byId("chooseConn").setAttribute("style", "display:none;");
    		var showMessage = "";
    		for(var i = 0 ; i < checkList.length ; i++){
    			if(i == 0){
    				showMessage += checkList[i].name;
    			}
    			else {
    				showMessage += ("," + checkList[i].name);
    			}
    		}
    		$api.byId("persons").innerHTML = "" + showMessage;
    	});

    	$api.byId("signInBtn").addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		info.start = true;
        // uploadData(function(){
        //  info.start = true;
        //  animationStart(function(){}, "taskMap" , "../html/taskMap.html", info, true);
        // })
    		animationStart(function(){}, "taskMap" , "../html/taskMap.html", info, true);
    	});

    	$api.byId("routingMapBtn").addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		info.start = false;
    		animationStart(function(){}, "taskMap" , "../html/taskMap.html", info, true);
    	});

    	$api.byId("addPic").addEventListener("click", function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		getPic(function(ret){
    			if(ret.data){
    				url = ret.data;
            var height = $api.offset($api.byId("main")).h -
      				$api.offset($api.byId("chooseWorker")).h -
      				$api.offset($api.byId("taskMessage")).h -
      				$api.offset($api.byId("signInBtn")).h - 65;
      			$api.byId("pictureUp").setAttribute("src", url);
      			$api.byId("pictureUp").removeAttribute("hidden");
      			$api.byId("pictureUp").setAttribute("style", "display:table;");
      			$api.byId("hintForSelector").setAttribute("hidden", "hidden");
      			$api.byId("hintPic").setAttribute("hidden", "hidden");
      			$api.byId("addPic").setAttribute("style", "height:" + height + "px;");
    			}
    		},
    		function(err){
    			alert(JSON.stringify(err));
    		})
    	});
    }

    var showingDataDetail = function(data){
      var id = data.id;
      var name = data.name;
      var starttime = data.planstartime;
      var endtime = data.planendtime;
      var state = data.state;
      var statename = data.statename;
      var path = data.path;
      $api.byId("startTime").innerHTML = starttime;
      $api.byId("endTime").innerHTML = endtime;
      $api.byId("routingName").innerHTML = name;
      $api.byId("taskStatus").innerHTML = statename;
      $api.byId('tName').innerHTML = name;
      $api.byId('tRouting').innerHTML = path;
    }

    var requestData = function(){
      //TODO:获取当前的数据内容的通过出阿尼用户ID 和taskID来进行获取。
      connectToService(commonURL + "?action=taskdetail",
        {
          values:{"id": info.taskid}
        }
        ,function(ret){
          //TODO:获取相关的数据之后进行内容展示和编写。
          if(ret.result){
            showingDataDetail(ret.data);
          }
        },
        function(ret, err){
          alert(JSON.stringify(err));
        }
      );

      connectToService(commonURL + "?action=taskuserlist",
        {
          values:{"userid": info.user.userid}
        }
        ,function(ret){
          //TODO:获取相关的数据之后进行内容展示和编写。
          if(ret.result){
            memberList(ret.data);
          }
        },
        function(ret, err){
          alert(JSON.stringify(err));
        }
      );
    }

    //传递人员数组内容。
    var memberList = function(list){
      //TODO:调用addPersons来进行列表内容添加。
      var stylecheck = "list-info";
      for(var i = 0 ; i < list.length ; i++){
        if(list[i].id == info.user.userid){
          continue;
        }
        if(!(i%2)){
          stylecheck = "list-info2";
        }
        else {
          stylecheck = 'list-info';
        }
        addPersons(list[i].id, list[i].name, stylecheck);
      }
    }

    //上传相关的数据内容
    var uploadData = function(success, fail){
      var member = [];
      for(var i = 0 ; i < checkList.length; i++){
        member.push(checkList[i].id);
      }
      if(!url){
        alert("请上传签到照片!");
      }
      connectToService(commonURL + "?action=accepttask",
        {
          values:{"userid": info.user.userId, "member": member, "taskid": info.taskid, "photo":url}
        }
        ,function(ret){
          success && success();
        },
        function(ret, err){
          fail & fail();
        }
      );
    }

    // addPersons("p1", "吴玉碧");
    // addPersons("p2", "李武志", "list-info2");
    // addPersons("p3", "王婷婷");
    // addPersons("p4", "李翔",  "list-info2");
    requestData();
    dynamicWeb();
}
