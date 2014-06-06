function checkUrl(url){
	regExp = /^(http|https|ftp):\/\/[^;]+.mp3/gi;
    if (regExp.test(url)) 
		return true;
	return false;
}

/*!创建分组*/
function createGroupOnServer(groupname){
	$.ajax({
		url:"p/group/addgroup.php",
		method:"POST",
		data:{'openid':openid, 'groupname':groupname},
		success:function(groupid){
			appendGroupByIdAndName(groupid, groupname);
			enableDragAndDrop();
		},
		error:function(){
			alert("服务器忙，请稍候重试！");
		}
	});
}

/*!重命名分组*/
function renameGroupOnServer(groupid,newGroupName){
	$.ajax({
		url:"p/group/renamegroup.php",
		method:"POST",
		data:{
			"openid":openid,
			"newgroup":newGroupName,
			"groupid":groupid
		},
		success:function(data){
			$("#groupid_"+groupid+ " span:first").html(newGroupName);
		}
	});
}

/*!从一个分组中删除一个好友*/
function removeFriendOnServer(friendElemId){
	var removeid = friendElemId.split("_");
	$.ajax({
		url:"p/group/removefriend.php",
		method:"GET",
		data:{
			"gid":removeid[0],
			"fid":removeid[1]
		},
		success:function(data){
			$("#"+friendElemId).remove();
		}
	});
}

$(document).ready(function(){
	$('.friendtitle').live('click', function(){
		if($(this).next('.list').css("display") == "block"){
			$(this).removeClass('choose').next('.list').hide(300);
		}else{
			$(this).addClass('choose').next('.list').show(300);
		}		
	});
	
	$("#addgroup input").hide();	
	$("#addgroup").click(function(){
		$(this).find("span").hide();
		$(this).find("input").show();
		$(this).find("input").focus()
	});
	
	$("#groupname").blur(function(){
		$(this).hide()
			   .parent().find("span").show();
	});
	
	$("#groupname").change(function(){
		$(this).hide()
			   .parent().find("span").show();
		var groupname = $(this).val();
		$(this).val("");
		if(groupname == ""){
			return;
		}
		createGroupOnServer(groupname);
	});
	
	$('li.grouping').contextMenu('myMenu1', {
		bindings: {
        'group_rename': function(t) {
			var groupid=t.id.substring(8);
			var oldgroup=$("#"+t.id+ " span:first").html();
			var newGroupName=prompt("重命名改组名称",oldgroup);
			if(newGroupName==""||newGroupName==oldgroup)
				return ;
			renameGroupOnServer(groupid, newGroupName);	
        },
        'group_delete': function(t) {
			var groupid=t.id.split('_')[1];
			if(!confirm("确定删除这一组吗？"))
				return ;
			$.ajax({
				url:"p/group/deletegroup.php",
				method:"POST",
				data:{"openid":openid,"groupid":groupid},
				success:function(data){
					$("#"+t.id).remove();
				}
			});
        }
      }
    });
	
	$('#repeat').click(function(){
		$('.jp-toggles-list').slideDown();
	});
	
	$('.jp-toggles-list a').click(function(){
		$('.jp-toggles-list').slideUp();
		$('#repeat img').attr('src','image/'+$(this).attr('class')+'.png');
	});
	
	$('#search input')
		.focus(function(){
			$(this).attr('value', '');
		})
		.blur(function(){
			if($(this).attr('value') == ''){
				$(this).attr('value', '输入你想要的音乐');
			}
		});
	
	$('.removefriend').live('click',function(){
		if(!confirm("确定删除?"))
			return ;
		var selectid = $(this).parent().attr('id');
		removeFriendOnServer(selectid);
	});
	
	$( "#ownSong")
		.button()
		.click(function() {
			$( "#provideSong").dialog("open");
		});
	
	$("#uploadFile").uploadify({
		'auto'			: false,
		'multi'			: true,
		'fileTypeDesc' : 'MP3 Files',
        'fileTypeExts' : '*.mp3', 
        'formData'      : {'name' : "test", 'singer' : "test"},
        'swf'           : 'js/uploadify.swf',
        'uploader'      : 'p/uploadify.php',
		'queueSizeLimit': '1',
		'buttonText'	: "选择一个Mp3文件",
		'onSelect' : function(file) {
			$("#songName").val(file.name.split('.')[0]);
        },
		'onUploadSuccess' : function(file, data, response) {
            alert('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
			var ret = eval('(' + data + ')');
			if(ret.ret == 0){
				myPlayerlist.add({
					title:ret.sname,
					artist:ret.singer,
					free: true,
					mp3:ret.src,
				});
				myPlayerlist.play(-1);
			} else {
				alert(ret.msg)
			}
        },
		'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
    });

	$("#provideSong").dialog({
		autoOpen: false,
		height: 324,
		width: 350,
		//modal: true,
		title: "欢迎您分享您的新歌曲！",
		buttons: {
			"我要上传": function() {
				$( this ).dialog( "close" );
				$("#uploadSong").dialog("open");
			},
			"我有歌曲链接": function() {
				$( this ).dialog( "close" );
				$( "#linkSong" ).dialog("open");
			}
		},
	});
	
	var songName = "";
	var singerName = "";
	var albumName = "";
	function isSongInfoComplete(){
		if(songName == undefined || songName == ""){
			alert("请填写歌曲名！");
			return false;
		}
		if(singerName == undefined || singerName == ""){
			alert("请填写歌手名！");
			return false;
		}
		if(albumName == undefined || albumName == ""){
			albumName = "null";
		}
		return true;
	}
	
	$( "#uploadSong" ).dialog({
		autoOpen: false,
		height: 324,
		width: 350,
		//modal: true,
		title: "上传歌曲",
		zIndex:"100",
		buttons: {
			"上传": function() {
				songName = $("#uploadSongName").val();
				singerName = $("#uploadSingerName").val();
				albumName = $("#uploadAlbumName").val();
				if(isSongInfoComplete()){
					$("#uploadFile").uploadify("settings", "formData", {
						'name' : songName, 
						'singer' : singerName, 
						'album' : albumName, 
						'target' : uploadHost,
						'openid':openid
					});
					$("#uploadFile").uploadify('upload', '*');
					//$( this ).dialog( "close" );
				}
			},
			"返回": function() {
				$( this ).dialog( "close" );
				$("#provideSong").dialog("open");
			}
		},
	});

	$( "#linkSong" ).dialog({
		autoOpen: false,
		height: 324,
		width: 350,
		//modal: true,
		title: "链接歌曲",
		buttons: {
			"保存": function() {
				var songSrc = $("#linkSongSrc").val();
				if(songSrc == undefined || songSrc == "" || !checkUrl(songSrc)){
					alert("请输入合法的URL！");
					return;
				}
				songName = $("#linkSongName").val();
				singerName = $("#linkSingerName").val();
				albumName = $("#linkAlbumName").val();
				if(isSongInfoComplete()){
					$.ajax({
						url:"p/song/addSongByLink.php",
						method:"POST",
						data:{
							'sname':songName, 
							'singer':singerName, 
							'album':albumName,
							'src':songSrc,
							'openid':openid
						},
						success:function(data){
							alert(data);
						}
					});
				}
			},
			"返回": function() {
				$( this ).dialog( "close" );
				$("#provideSong").dialog("open");
			}
		},
	});
		
	$("#publish-ss").click(function(){	
		fusion2.dialog.tweet({
			// 必须。默认显示在说说文字输入框中的文字内容。
			msg:"我正在玩听别人的歌，你也来吧...",

			// 可选。应用自定义参数，用于进入应用时CanvasUrl中的app_custom参数的值,应用可根据该参数判断用户来源。
			//source:"adtag_tweet_share_exp",

			// 可选。要发表带贴图的说说时，这里需要传入图片的链接。链接中请不要带中文字符
			// 图片没有域名限制，但是图片地址的根域名必须要有一个crossdomain.xml 的flash授权文件，详见下文
			url:"http://192.168.1.10/listen-his-songs/logo.png",

			// 可选。用户操作后的回调方法。
			//onSuccess : function (opt) {  },

			// 可选。用户取消操作后的回调方法。
			//onCancel : function () {  },

			// 可选。对话框关闭时的回调方法。
			//onClose : function () {  }

		});
	});
		
});