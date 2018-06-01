apiready = function(){
    var info = api.pageParam;
    var history = info.history;
    info.history = "main";

    //将当前的页面设置为占用手机就全屏内容。
    var mainH = api.winHeight - $api.offset($api.byId("header")).h - $api.offset($api.byId("footer")).h;
    $api.byId("main").setAttribute("style", "height:" + mainH + "px;");      
    

    //存储选择的巡检任务人员，存储其ID以及名称。
    var checkList = [];
    var url = "";


    //添加用户选择列表项目,并未其添加点击选择事件。
    var addPersons = function(userId, headPic, name, info, classes){
    	var str = "<img src='../icon/checkbox.png' class='checkbox'/>"+
            "<img src='../icon/checkbox-check.png' class='checkbox-check' id="+("checkbox"+userId)+" hidden='hidden'/>" +
            "<img src='" + ("" + headPic) + "' class='list-header'></img>" +
            "<span class='list-worker-name'>"+ ("" + name) + "</span>" +
            "<span class='list-worker-info'>" + ("" + info) + "</span>";
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
    			alert(JSON.stringify(ret));
    			if(ret.data){
    				url = ret.data;
    			}
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
    		},
    		function(err){
    			alert(JSON.stringify(err));
    		})
    	});
    }

    addPersons("p1", "../icon/atm.png", "p1", "p1");
    addPersons("p2", "../icon/atm.png", "p2", "p2", "list-info2");
    addPersons("p3", "../icon/atm.png", "p3", "p3");
    addPersons("p4", "../icon/atm.png", "p4", "p4", "list-info2");
    dynamicWeb();
}
    