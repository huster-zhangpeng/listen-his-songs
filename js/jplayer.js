var myPlayerlist;
var searchRet;

var dbSid = -1;
var newSongIndex = -1;
var newSongSrcUrl = "";

var isNowMySongsList;
/*!定义用户收听（或者说播放）新歌的三中方式*/
var TYPE = {
	FROM_SELF:0,
	FROM_SOSO:1,
	FROM_DB:2.
};
var addSongType = TYPE.FROM_SELF;

var currendFriend = 0;

/*!获取当前播放歌曲的歌名和歌手名，返回Object类型*/
function getCurrentSong(){
	var text = $("#playlist ul li.jp-playlist-current")
					.find("a.jp-playlist-current").text();
	var info = text.split('-');
	var song = {
				"name":$.trim(info[0]),
				"singer":$.trim(info[1]),
			};
	return song;
}

/*
*是否在当前播放列表里面，不考虑专辑信息，如果存在返回index
*直接从ul列表里面获得，以准确获取歌曲是第几首歌
*/
function isInCurrentPlaylist(sname, singer){
	var $ul = $("#playlist ul").children("li");
	var i;
	for(i = 0; i < $ul.length; i ++){
		var content = $ul.eq(i).find("a").text();
		if(content.indexOf(sname) >=0 
			&& content.indexOf(singer) >= 0){
			return i;
		}
	}
	return -1;
}

/*
*从SOSO搜索结果中收听一首歌
*此歌直接加进用户播放列表
*/
function addSongFromSOSO(){
	if(newSongIndex == -1 || newSongSrcUrl == ""){
		return -1;
	}
	var sname = searchRet.soso[newSongIndex].name;
	var singer = searchRet.soso[newSongIndex].singer;
	var album = "none";
	if(typeof searchRet.soso[newSongIndex].album != "undefined"){
		album = searchRet.soso[newSongIndex].album;
	}
	var srcUrl = newSongSrcUrl;
	newSongIndex = -1;
	newSongSrcUrl = "";
	addSongType = TYPE.FROM_SELF;
	$.ajax({
		url:"p/song/addSongFromSOSO.php",
		method:"POST",
		data:{
			"sname":sname,
			"singer":singer,
			"album":album,
			"src":srcUrl,
			"openid":openid,
		},
		success:function(data){
			alert(data);
		}
	});
}

/*
*从DB的搜索结果收听一首歌
*此歌也直接加进用户播放列表,但后台处理不一样
*/
function addSongFromDB(){
	if(dbSid < 0) return;
	var sid = dbSid;
	dbSid = -1;
	addSongType = TYPE.FORM_SELF;
	$.ajax({
		url:"p/song/addSongFromDB.php",
		method:"POST",
		data:{
			"sid":sid,
			"openid":openid,
		},
		success:function(data){
			alert(data);
		}
	});
}

/*
*当这首歌已经在用户的播放列表中存在时，直接让收听次数+1
*/
function addSongFromSelf(){
	var song = getCurrentSong();
	$.ajax({
		url:"p/song/addSongFromSelf.php",
		method:"POST",
		data:{
			"sname":song.name,
			"singer":song.singer,
			"openid":openid,
		},
		success:function(data){
			//TODO Nothing
		}
	});
}

/*
*收听搜索结果中的一首歌的总控程序，默认情况下总是从自己的播放列表中听歌
*/
function saveSongListenedRecordOnServer(songname){
	switch(addSongType){
	case TYPE.FROM_SELF:
		addSongFromSelf();
		break;
	case TYPE.FROM_DB:
		addSongFromDB();
		break;
	case TYPE.FROM_SOSO:
		addSongFromSOSO();
		break;
	}
	addSongType = TYPE.FROM_SELF;
}

/*!删除一首歌，此功能尚未完善，只能通过×删除，没有批量删除*/
function deleteSong(sname, singer){
	$.ajax({
		url:"p/song/deleteSong.php",
		method:"POST",
		data:{
			"sname":sname,
			"singer":singer,
			"openid":openid,
		},
		success:function(data){
			alert(data);
		}
	});
}

/*
*显示搜索结果，封装成一个函数，对从数据库、从SOSO上得到的结果进行展示
*/
function displaySearchResult(songs, tag){
	var albumFiller = "";
	for(var i=0; i<songs.num; i++){
		if(songs[i].album != undefined){
			albumFiller = "" + songs[i].album;
			if(albumFiller.length > 5){
				albumFiller = albumFiller.substr(0,4) + "...";
			}
		} else {
			albumFiller = "";
		}
		$("#list_all > ul").append("<li class='jp-playlist-item'  id='" +tag+"_"+i+"'>"
								+"<span class='list1'>"+songs[i].name+"</span>"
								+"<span class='list2'>"+songs[i].singer+"</span>"
								+"<span class='list3' alt='"+songs[i].album+"'>"+albumFiller+"</span>" +
							"</li>");  
	}
}

/*!激活搜索结果的点击效果*/
function enableSearchItemDoubleClicked(){
	$("#list_all ul li").click(function(){
		var info = this.id.split('_');
		var index = info[1];
		if(info[0] == "db") {
			var ret = isInCurrentPlaylist(
				searchRet.db[index].name, 
				searchRet.db[index].singer
			);
			if(ret >= 0){
				myPlayerlist.play(ret);
				return;
			}
			myPlayerlist.add({
				artist:searchRet.db[index].singer,
				title:searchRet.db[index].name,
				free: true,
				mp3:searchRet.db[index].src,
			});
			dbSid = searchRet.db[index].sid;
			addSongType = TYPE.FROM_DB;
			myPlayerlist.play(-1);
			$("#list_all ul li.jp-playlist-current").removeClass("jp-playlist-current");
		}
	});
}

/*!获取我的播放列表*/
function getMySongList(){
	$.ajax({
		url:"p/song/getSongsOfMine.php",
		method:"post",
		data:{'openid':openid},
		dataType:"json",
		success:function(ret){
			//alert(data);
			//ret = eval('(' + data + ')');
			if(ret.num == 0){
				$("#playlist").append("<li id='not' class='jp-playlist-item' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"对不起 ！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 您还没有播放列表！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>");			   
			} else {
				for(var i=0; i<ret.num; i++){
					myPlayerlist.add({
						title:ret.songs[i].name,
						artist:ret.songs[i].singer,
						free: true,
						mp3:ret.songs[i].src,
					});
				}
				var temp = $("a.jp-playlist-current").html();
				$("div#jp-music-title h2").html(temp);
				$("#return").attr({"disabled":"disabled"});
				$("#last").attr({"disabled":"disabled"});
			}
		}
	});
}

/*!用户点击返回列表时*/
function returnBack(){
	$('#list_all').hide();
	$('#playlist').show();
	$("#return").unbind('click');
	$("#last").attr({"disabled":"disabled"});
	isNowMySongList = true;
}

/*!
*当用户点击他的好友时，获取好友的播放列表
*/
function getSongsOfFriend(days){
	if(currentFriend == 0 || currentFriend == openid) return;
	$.ajax({		
		url:"p/song/getSongsOfFriend.php",
		type:"POST",
		data:{"days":days,"openid":currentFriend},
		dataType:"json",
		success:function(ret){
			searchRet = ret;
			if(ret.db.num==0){
				$("#list_all > ul").append("<li class='jp-playlist-item' id='not' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"对不起 ！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 该好友这几天未听歌！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>");			   
			}else{
				$("#list_all > ul").append("<li id='listtitle' class='jp-playlist-item' >"
												+"<span class='list1'>歌名</span>"
												+"<span class='list2'>歌手</span>"
												+"<span class='list3'>专辑</span>"+
											"</li>");
				displaySearchResult(ret.db, "db");
				enableSearchItemDoubleClicked();
			}
		}
	});
}

$(document).ready(function(){
	myPlayerlist = new jPlayerPlaylist(
	{
		jPlayer: "#jquery_jplayer_1",
		cssSelectorAncestor: "#jp_container_1"
	}, 
	[], 
	{
		playlistOptions: {
			autoPlay: false,
			loopOnPrevious: true,
			shuffleOnLoop: true,
			enableRemoveControls: true,
		},
		swfPath: "js/Jplayer.swf",
		supplied: "mp3",
		verticalVolume: true,
		volume: 0.75,
		preload: "auto",
		wmode: "window"
	});
	
	getMySongList();
	isNowMySongsList = true;
	
	oldSongSrc = "";
	/*! 为歌曲播放事件绑定功能
	*	每次记录收听歌曲都是从一首歌播放时激发的
	*/
	$("#jquery_jplayer_1").bind($.jPlayer.event.play,function(event){
	    var newSongSrc = event.jPlayer.status.src;
		if(newSongSrc==oldSongSrc){
			return;
		}
		var temp = $("a.jp-playlist-current").html();
		$("div#jp-music-title h2").html(temp);
		$("#list_all ul li.jp-playlist-current").removeClass("jp-playlist-current");
		saveSongListenedRecordOnServer();
		oldSongSrc = newSongSrc;
	});
	
	/*!
	*	当url不能播放时的错误处理程序
	*/
	$("#jquery_jplayer_1").bind($.jPlayer.event.error, function(event) {
		alert("Error Event: type = " + event.jPlayer.error.type + "\n" + event.jPlayer.error.message); // The actual error code string. Eg., "e_url" for $.jPlayer.error.URL error.
		switch(event.jPlayer.error.type) {
		case $.jPlayer.error.URL:
			alert("Url:"+event.jPlayer.status.src+"无效!");
			addSongType = TYPE.FROM_SELF;
			break;
		case $.jPlayer.error.NO_SOLUTION:
			// Do something
			break;
		case $.jPlayer.error.NO_SUPPORT:
			// Do something
			alert(dump(playerSettings.files));
			break;
		}
	});
	
	/*!点击好友时，获取好友的歌，从这里激发*/
	$("li.lbs_friend").live('click', function(){
		currentFriend = this.id.split('_')[1];
		if(currentFriend == openid){
			if(!isNowMySongsList)
				returnBack();
			return;
		}
		$("#return").click(returnBack);
		$("#playlist").hide();
		$("#list_all").show();
		$("#list_all > ul").empty();
		$("#return").removeAttr("disabled");
		$("#last").removeAttr("disabled");
		var daysOpt = $("#last").find("option:selected").val();
		getSongsOfFriend(daysOpt);
		isNowMySongsList = false;
	});
	
	/*!用户最近几天的选项改变时*/
	$("#last").change(function(){
		var daysOpt = $("#last").find("option:selected").val();
		$("#list_all > ul").empty();
		getSongsOfFriend(daysOpt);
	});
	
	/*!要输入搜索内容*/
	$("#search-text").focus(function(){
		var content = $("#search-text").val();
		if(content == "输入你想要的音乐"){
			$("#search-text").val("");
		}
		return;
	});
	
	/*!提交搜索内容，获取搜索结果，并显示*/
	$("#search-sub").click(function(){
		var searchContent = $("#search-text").val();
		if(searchContent == "" || searchContent == "输入你想要的音乐")
		{
			alert("请输入搜索内容！");
			return;
		}
		$("#playlist").hide();
		$("#list_all").show();
		$("div#list_all").find("li#not").remove();
		$.ajax({
			url:"p/soso/searchsong.php",
			type:"POST",
			data:{"searchContent":searchContent},
			dataType:"json",
			success:function(data){
				var songsInDB = data.db;
				var songs = data.soso;
				$("#list_all > ul").empty();
				if(songs.num == 0){
					$("#list_all > ul").append("<li id='not' class='jp-playlist-item' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
						"对不起 ！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 未搜索到相关歌曲！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>");
				} else {
					searchRet = data;
					$("#list_all > ul").append("<li id='listtitle' class='jp-playlist-item' >"
											+"<span class='list1'>歌名</span>"
											+"<span class='list2'>歌手</span>"
											+"<span class='list3'>专辑</span>"+
										"</li>");		
					displaySearchResult(data.db, "db");
					displaySearchResult(data.soso, "soso");
					enableSearchItemDoubleClicked();
					$("#return").removeAttr("disabled");
				}
			}
		});
	});

	$("a.jp-playlist-item-remove").live('click', function(){
		var text = $(this).next().next().text();
		var info = text.split('-');
		deleteSong(
			$.trim(info[0]),
			$.trim(info[1])
		);
	});
	
	/*!删除一首歌*/
	$("#delete").click(function(){
		var o=document.getElementById("list_all");
		var num=o.children.length;
		var idarray="";
		var k=0;
		for(var i=0;i<num;i++){
			if(o.children[i].className=="onthis"){
				k++;
				idarray=idarray+"|"+o.children[i].id
			}
		}
		if(k==0){
			alert("请在列表中选择您要删除的歌曲！");
		} else {
			var keyword = document.getElementById("list_all");
			var name=keyword.firstChild.id;
			$.ajax({
				url:"p/deletesong.php",
				method:"post",
				data:{"idarray":idarray,"name":name,"k":k},
				success:function(data){
				}
			});
			var string=idarray.split("|");
			var array= new Array();
			for(i=0;i<k;i++) {
				array[i]=string[i+1];  //把点击了的歌曲的id收集起来，并每个放在数组array中
			}

			var  m=document.getElementById("list_all");
			var  l=m.children.length;
			for(var i=0;i<l;i++) {
				if(m.children[i].className=="onthis") {
					m.removeChild(m.children[i]);
					l--;
				}			   
			}	
		}
	});
});
