<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type:application/json');

$xiamiID="2385465,1771433892,1773668337"; #设置虾米ID

error_reporting(0);
function http($url){
	set_time_limit(0);

	$curl=curl_init();
	curl_setopt($curl,CURLOPT_URL,$url);
	curl_setopt($curl,CURLOPT_HEADER,false);
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
	$result=curl_exec($curl);
	curl_close($curl);
	if(empty($result)){
		$result=false;
	}
	return $result;
}
/*
 * 写结果缓存文件
 * @params  string  $cache_name
 * @params  string  $value
 */
function write_cache($name,$value){
    $path=md5($name).'.php';
    if($value!=''){
        file_put_contents($path,"<?php return ".var_export($value,true).";",LOCK_EX);
    }
}
/*
 * 读结果缓存文件
 * @params  string  $cache_name
 * @return  array   $data
 */
function read_cache($name){
    $path=md5($name).'.php';
    if(file_exists($path)){
        return include($path);
    }else{
        return false;
    }
}
function xiami($location){
    $count = (int)substr($location, 0, 1);
    $url = substr($location, 1);
    $line = floor(strlen($url) / $count);
    $loc_5 = strlen($url) % $count;
    $loc_6 = array();
    $loc_7 = 0;
    $loc_8 = '';
    $loc_9 = '';
    $loc_10 = '';
    while ($loc_7 < $loc_5){
        $loc_6[$loc_7] = substr($url, ($line+1)*$loc_7, $line+1);
        $loc_7++;
    }
    $loc_7 = $loc_5;
    while($loc_7 < $count){
        $loc_6[$loc_7] = substr($url, $line * ($loc_7 - $loc_5) + ($line + 1) * $loc_5, $line);
        $loc_7++;
    }
    $loc_7 = 0;
    while ($loc_7 < strlen($loc_6[0])){
        $loc_10 = 0;
        while ($loc_10 < count($loc_6)){
            $loc_8 .= @$loc_6[$loc_10][$loc_7];
            $loc_10++;
        }
        $loc_7++;
    }
    $loc_9 = str_replace('^', 0, urldecode($loc_8));
    return $loc_9;
}
if(!read_cache("music")||(time()-filemtime(md5("music").".php"))>3600*5){
    $explode=explode(",",$xiamiID);
    //print_r($explode);exit;
    $array=array();
    $no=0;
    foreach ($explode as $k => $id) {
        $content=http('http://www.xiami.com/widget/xml-single/sid/'.$id.'/');
        preg_match_all("/<album_cover><\!\[CDATA\[([^\]].*)\]\]><\/album_cover>/i",$content,$cover);
        preg_match_all("/<song_name><\!\[CDATA\[([^\]].*)\]\]><\/song_name>/i",$content,$name);
        preg_match_all("/<artist_name><\!\[CDATA\[([^\]].*)\]\]><\/artist_name>/i",$content,$art);
        preg_match_all("/<location><\!\[CDATA\[([^\]].*)\]\]><\/location>/i",$content,$location);
        // echo var_dump($name[1][0]);
        if(!empty($name[1][0])){
            $array[$no]['url']=xiami($location[1][0]);
            $array[$no]['name']=$name[1][0];
            $array[$no]['art']=$art[1][0];
            $array[$no]['image']=$cover[1][0];
            $no++;
        }

    }
    $json=json_encode($array);
    write_cache("music",$json);
}else{
    $json=read_cache("music");
}
echo($json);
exit;