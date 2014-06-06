/*
 * 封装openapi的所有ajax初始化请求。
 *
 * Url类，封装了对url的解读，能从当前url里面获取
 * openid、openkey、pf等参数
 *
 * @函数 getAppFriends:ajax请求获取使用此应用的好
 * 友，在ajax获取个人信息后立即调用。
 *
 * @函数 findGroups:ajax请求获取用户的所有分组，在
 * getAppFriends调用成功后立即调用。
 *
 * @函数 findFriendByFid:根据fopenid获取好友的信息
 * 说明一点，在getAppFriends调用后，所有的好友信息
 * 的json对象都保存在全局变量friends里面。
 *
 */
function Url(){
	url = location.href;
	this.getHttpParams = function(name)
	{
        var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
        var m = url.match(r);
        return decodeURIComponent(!m?"":m[2]);
	}
}
urlObj = new Url();
openid = urlObj.getHttpParams("openid");
openkey = urlObj.getHttpParams("openkey");
pf = urlObj.getHttpParams("pf");
if(pf == ""){
	pf = "qzone";
}

var friends;

function appendFriend(gid, friend){
	var liId = gid+"_"+friend.openid;
	var groupId = "#allfriends";
	var elementHtml = "<li id='"+liId+"' class='lbs_friend ui-widget-content ui-corner-tr ui-draggable'>";
	elementHtml += 		"<img src='"+friend.figureurl+"'/>";
	elementHtml += 		"<span>"+friend.nickname+"</span>";
	if(gid != 0) {
		elementHtml += 	"<a class='removefriend' href='#'>&times;</a>";
		groupId = "#group_" + gid;
	}
	elementHtml += 	  "</li>";
	$(groupId).append(elementHtml);
}

function appendFriendToGroup($item, $dist, $distUl){
	$dist.find( ".placeholder" ).remove();
	var fopenid = $item.attr("id").split('_')[1];
	var figureurl = $item.find("img").attr("src");
	var nickname = $item.find("span").text();
	var gid = $dist.attr("id").split('_')[1];
	var user = {
		"openid":fopenid,
		"figureurl":figureurl,
		"nickname":nickname,
	};
	appendFriend(gid, user);
	enableDragAndDrop();
}

function appendGroupByIdAndName(groupId, groupName){
	var elementHtml = "<li class='grouping' id='groupid_"+groupId+"'>";
	elementHtml += 		"<span class='friendtitle'>";
	elementHtml += 		   groupName
	elementHtml += 		"</span>";
	elementHtml += 		"<ul class='list' id='group_"+groupId+"'></ul>";
	elementHtml += 	  "</li>";
	$("#friendlist ul:first").append(elementHtml);
}

function appendGroup(group){
	appendGroupByIdAndName(group.id, group.name);
}


function appendMe(me){
	me.openid = openid;
	appendFriend(0, me);
}

function addFriendOnServer(gid, fopenid, $dist, $distUl){
	var ret = true;
	$.ajax({
		async:false,
		url:"p/group/addfriend.php",
		method:"POST",
		data:{"gid":gid, "fopenid":fopenid},
		success:function(data){
			ret = true;
		},
		error:function(jqXHR, textStatus, errorThrown){
			ret = false;	
		}
	});
	return ret;
}

function enableDragAndDrop(){
	$("ul.list > li").draggable({
		revert: "invalid",
		appendTo: "body",
		opacity: 0.35,
		containment: $( "#demo-frame" ).length ? "#demo-frame" : "document",
		helper: "clone",
		cursor: "move"
	});
	
	$("#friendUl > li").droppable({
		accept: "ul.list li",
		drop: function( event, ui ) {
			var fromId = $(ui.draggable).parent()[0].id;
			var $this = $(this);
			var $thisUl = $this.find("ul")[0];
			var toId = $thisUl.id;
			var userOpenid = ui.draggable[0].id.split('_')[1];
			
			var isToAllFriendsGroup = (toId == "allfriends");
			var isMeMoved = (userOpenid == openid);
			if(isToAllFriendsGroup || isMeMoved) return;

			var i;
			var children = $($thisUl).children("li");
			for(i = 0; i < children.length; i++){
				var wasExistInGroup = userOpenid == children[i].id.split('_')[1];
				if(wasExistInGroup) return;
			}
			
			var groupid = toId.split('_')[1];
			var isSuccessful = addFriendOnServer(groupid, userOpenid, $this, $thisUl);
			if(isSuccessful){
				appendFriendToGroup($(ui.draggable), $this, $thisUl);
			} else {
				alert("服务器忙，请稍候尝试！");
			}
		}
	});
}

function getGroups(callback){
	$.ajax({
		url:"p/group/findGroups.php",
		method:"POST",
		data:{"myopenid":openid},
		dataType:"json",
		success:function(groups){
			var i, j;
			for(i = 0; i < groups.length; i++){
				appendGroup(groups[i]);		
				for(j = 0; j < groups[i].friends.length; j++){
					var friend = findFriendByFid(groups[i].friends[j].openid);
					appendFriend(groups[i].id, friend);
				}
			}
			if(typeof callback == "function"){
				callback();
			}
			enableDragAndDrop();
		},
		error:function(){
			alert("error");
		}
	});
}

function getAppFriends(callback){
	$.ajax({
		url:"openapi-3.0.2/get_app_friends.php",
		method:"GET",
		data:{
			"openid":openid, 
			"openkey":openkey, 
			"pf":pf
		},
		dataType:"json",
		success:function(data){
			if(data.ret != 0){
				alert(data.ret);
				getAppFriends(function(){
					getGroups();
				});
				return;
			}
			friends = data;
			var i;
			for(i=0; i< friends.items.length; i++){
				appendFriend(0, friends.items[i]);
			}
			if(typeof callback == "function"){
				callback();
			}
		}
	});
}

function findFriendByFid(fid){
	var i;
	for(i = 0; i < friends.items.length; i++){
		if(friends.items[i].openid == fid){
			return friends.items[i];
		}
	}
}

function punblishtapp(content){
		$.ajax({
			url:"openapi-3.0.2/add_tapp.php",
			method:"GET",
			data:{
				"openid":openid, 
				"openkey":openkey, 
				"pf":"tapp",
				"content":content + "#听别人的歌#"
			},
			success:function(data){
				alert("微博发表成功！");
			}
		});
		return false;
}


function getMyInfo(callback){
	$.ajax({
		url:"openapi-3.0.2/get_user_info.php",
		method:"GET",
		data:{
			"openid":openid, 
			"openkey":openkey, 
			"pf":pf
		},
		dataType:"json",
		success:function(myinfo){
			if(myinfo.ret != 0){
				getMyInfo(function(){
					getAppFriends(function(){
						getGroups();
					});
				});
				return;
			}
			appendMe(myinfo);
			if(typeof callback == "function"){
				callback();
			}
		}
	});
}

getMyInfo(function(){
	getAppFriends(function(){
		getGroups();
	});
});
	
$(document).ready(function(){
	$("#invite").click(function(){
		fusion2.dialog.invite({
			msg:"邀请你来玩~",
			context:"invite",
			onSuccess:function(opt){
				alert("邀请成功"+opt.context);
			}
		});
	});
});
