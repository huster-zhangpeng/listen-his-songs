<?PHP
require_once("class.fgroup.php");
require_once("class.songslist.php");

class User{
	private $uid = 0;
	
	// 构造函数
	function __construct($uid){
		$this->uid = $uid;
	}
	
	// 用户听了从SOSO或者DB上发现的一首新歌
	function listenANewSong($sid){
		$this->getSongsList()->addSong($sid);
	}
	
	// 获取用户的播放列表类
	function getSongsList(){
		return new SongsList($this->uid);
	}
	
	// 获取用户的好友管理分组+分组里面的好友
	function getGroups(){
		$group = new Group();
		return $group->listGroupsOfUser($this->uid);
	}
}
?>
