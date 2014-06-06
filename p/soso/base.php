<?php
function getUrl($input){
	$param = urlencode(mb_convert_encoding($input, 'gb2312', 'utf-8'));
	$url='http://cgi.music.soso.com/fcgi-bin/m.q?w='.$param.'&source=1&t=1';
	return $url;
}

function handleRow($row){
	$urlPreg = '/http[^;]+.mp3/';
	$songInfo = array();
	$cells = $row->getElementsByTagName('td');
	foreach($cells as $cell){
		$str = $cell->getAttribute('class');
		switch($str){
			case 'data':
				$message = $cell->textContent;
				preg_match_all($urlPreg, $message, $results);
				$songInfo['url'] = $results[0];
				break;
			case 'song':
				$strong = $cell->getElementsByTagName('strong')->item(0);
				if($strong){
					$songInfo['name'] = $strong->textContent;
				}else{
					$a = $cell->getElementsByTagName('a')->item(0);
					$songInfo['name'] = $a->textContent;
				}
				break;
			case 'singer':
				$singerLink = $cell->getElementsByTagName('a')->item(0);
				if($singerLink){
					//$singerUrl = $singerLink->getAttribute('href');
					$songInfo['singer'] = $singerLink->textContent;
				}
				break;
			case 'ablum':
				$ablumLink = $cell->getElementsByTagName('a')->item(0);
				if($ablumLink){
					$songInfo['album'] = $ablumLink->textContent;
				}
				break;
			case 'size':
				$songInfo['size'] = $cell->nodeValue;
				break;
		}
	}
	if(function_exists("dataHandler")){
		dataHandler($songInfo);
	}
	return $songInfo;
}

function handleSongBox($table){
	$isFirst = ture;
	$rows = $table->getElementsByTagName('tr');
	foreach($rows as $row){
		if($isFirst){
			$isFirst = false;
		} else {
			$songInfo = handleRow($row);
		}
	}
}

function searchBySOSO($url){
	error_reporting(E_ERROR|E_PARSE|E_CORE_ERROR);
	$html = file_get_contents($url);
	$html = mb_convert_encoding($html,"GBK", "gb2312");
	$htmlDom = new DOMDocument();
	$htmlDom->loadHTML($html);
	$htmlDom->normalizeDocument();

	$tables = $htmlDom->getElementsByTagName('table');
	$count = $tables->length;
	foreach($tables as $songBox){
		$tableProp = $songBox->getAttribute('class');
		if($tableProp == 'song_box'){
			handleSongBox($songBox);
			return;
		}
	}
}