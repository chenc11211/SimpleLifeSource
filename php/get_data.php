<?php
session_start();
if(!isset($_SESSION['user_email'])){
	
	echo "";
}
else{
	

require 'connect.php';

//sleep(1);

//获取当前用户ID
$query="SELECT `id` FROM `user` WHERE `email`='{$_SESSION['user_email']}'";
	$result=$conn->query($query);
	$id=$result->fetch_array();

	//获取用户信息
	function get_user_info($user_id,$id,$conn){    //参数：查询用户id,当前登录用户id,数据库链接对象
		$query_user="SELECT * FROM `user` WHERE `id`={$user_id}";
		$result_user=$conn->query($query_user);
		 $user=$result_user->fetch_array();
		 //微博数量
		 $query_weibo="SELECT count(*) FROM `weibo` WHERE `user_id`={$user['id']}";
		 $result_weibo=$conn->query($query_weibo);
		 $weibo=$result_weibo->fetch_array();
		 $weibo_num=array('weibo_num'=>$weibo[0]);
		 //粉丝数量
		 $query_fans="SELECT count(*) FROM `fans` WHERE `user_id`={$user['id']}";
		 $result_fans=$conn->query($query_fans);
		 $fans=$result_fans->fetch_array();
		 $fans_num=array('fans_num'=>$fans[0]);
		 //关注数量
		 $query_follow="SELECT count(*) FROM `fans` WHERE `fans_user_id`={$user['id']}";
		 $result_follow=$conn->query($query_follow);
		 $follow=$result_follow->fetch_array();
		 $follow_num=array('follow_num'=>$follow[0]);
		 //当登录用户是否是查询用户的粉丝
		 if($id==$user['id']){
			 $followed=array('followed'=>-1);    //查询用户就是当前用户时，返回-1；
		 }else{
			 $query_followed="SELECT count(*) FROM `fans` WHERE `user_id`={$user['id']} and `fans_user_id`={$id}";
			 $result_followed=$conn->query($query_followed);
			 $followed_array=$result_followed->fetch_array();
			 if($followed_array[0]==1){
				 $followed=array('followed'=>1);
			 }else if($followed_array[0]==0){
				 $followed=array('followed'=>0);
			 }
		 }
		 $info=array_merge($user,$weibo_num,$fans_num,$follow_num,$followed);
		 return $info;
	}
	
	//获取微博条目信息
	function get_weibo_item($weibo_id,$id,$conn){  //参数：查询微博id,当前登录用户id,数据库链接对象
		     //获取微博内容
			 $query_weibo_content="SELECT * FROM `weibo` WHERE `id`={$weibo_id}";
			 $result_weibo_content=$conn->query($query_weibo_content);
			 $weibo_content=$result_weibo_content->fetch_array();
			 //获取微博发布者信息
			 $query_user="SELECT `name`,`icon` FROM `user` WHERE `id`='{$weibo_content['user_id']}'";
		     $result_user=$conn->query($query_user);
		     $user=$result_user->fetch_array();
			 //获取评论数
			 $query_comment="SELECT count(*) FROM `comment` WHERE `weibo_id`='{$weibo_id}'";
			 $result_comment=$conn->query($query_comment);
			 $comment=$result_comment->fetch_array();
			 $total=array('comment_total'=>$comment[0]);
			 //获取是否收藏
			 $query_collection="SELECT `id` FROM `collection` WHERE `user_id`={$id} and `weibo_id`={$weibo_id}";
			 $result_collection=$conn->query($query_collection);
			 $collection=$result_collection->num_rows;
			 if($collection==1){
				 $collected=array('collection'=>1);
			 }else{
				 $collected=array('collection'=>0);
			 }
			 //获取点赞数
			 $query_like="SELECT count(*) FROM `likes` WHERE `weibo_id`={$weibo_id}";
			 $result_like=$conn->query($query_like);
			 $like=$result_like->fetch_array();
			 $like_total=array('like_total'=>$like[0]);
			 //获取当前是否已点赞
			 $query_liked="SELECT `id` FROM `likes` WHERE `user_id`={$id} and `weibo_id`={$weibo_id}";
			 $result_liked=$conn->query($query_liked);
			 $liked=$result_liked->num_rows;
			 if($liked==1){
				 $is_like=array('liked'=>1);
			 }else{
				 $is_like=array('liked'=>0);
			 }
			 
			 $weibo_item=array_merge($weibo_content,$user,$total,$collected,$like_total,$is_like);
			 return $weibo_item;
	}
	
	 
	
switch($_POST['target']){
	case 'user_info':
	     //用户基本信息
		 if(isset($_POST['id'])){      //名片用户信息或他人主页用户信息
			 $info=get_user_info($_POST['id'],$id['id'],$conn);
		 }else{                        //当前登录用户信息
			 $info=get_user_info($id['id'],$id['id'],$conn);
		 }
		 
		 $info_json=json_encode($info,JSON_UNESCAPED_UNICODE);
		 echo $info_json;
		 break;
	
	case 'weibo':
		 //获取微博条目
		 if(isset($_POST['operation'])){
			 switch($_POST['operation']){
				 case 'search'://个人主页当前搜索微博
				 	 $query="SELECT `id` FROM `weibo` WHERE `user_id`={$id['id']} and `weibo` like '%{$_POST['value']}%' ORDER BY `date` DESC LIMIT {$_POST['num']},10";
					 break;
					 
				 case 'other_search'://他人主页当前搜索微博
					 $query="SELECT `id` FROM `weibo` WHERE `user_id`={$_POST['id']} and `weibo` like '%{$_POST['value']}%' ORDER BY `date` DESC LIMIT {$_POST['num']},10";
					 break;
					 
				 case 'all_search'://微博搜索（全部）
				 	$query="SELECT `id` FROM `weibo` WHERE `weibo` like '%{$_POST['value']}%' ORDER BY `date` DESC LIMIT {$_POST['num']},10";
					break;
					
				 case 'fav_search'://微博搜索（收藏）
				     $query_fav_id="SELECT `weibo_id` FROM `collection` WHERE `user_id`={$id['id']} ORDER BY `date` DESC";    //获取用户收藏的所用微博id（按时间倒序）
				     $result_fav_id=$conn->query($query_fav_id);
				     $fav_id_array=array();
				     while($fav_id=$result_fav_id->fetch_array()){
					     array_push($fav_id_array,$fav_id[0]);
				     }
				     $fav_id_str=implode(',',$fav_id_array);    //按收藏日期排序的weibo_id 字符串；
				     $query="SELECT `id` FROM `weibo` WHERE `id` IN ({$fav_id_str}) and `weibo` like '%{$_POST['value']}%' ORDER BY FIELD(id,{$fav_id_str}) LIMIT {$_POST['num']},10";
				     break;
					 
				 case 'home'://首页微博（包括个人和关注者）；
				     $query_follow="SELECT `user_id` FROM `fans` WHERE `fans_user_id`={$id['id']}";
				     $result_follow=$conn->query($query_follow);
				     $follow_array=array();
				     while($follow=$result_follow->fetch_array(MYSQLI_NUM)){  //遍历每个id将其加入数组中
					     array_push($follow_array,$follow[0]);
				     }; 
				     if(count($follow_array)){
					     array_push($follow_array,$id['id']);
				         $user_str=implode(',',$follow_array);     //所有查询用户组成的字符串；
				     }else {
					     $user_str=''.$id['id'];    //用户没有关注者则字符串为用户id；
				     }
				     $query="SELECT `id` FROM `weibo` WHERE `user_id` IN ({$user_str}) ORDER BY `date` DESC LIMIT {$_POST['num']},10";
				     break;
					 
				 case 'hot'://热门微博（依据hot值）
				     $query="SELECT `id` FROM `weibo` ORDER BY `hot` DESC,`date` DESC LIMIT {$_POST['num']},10";
			 }
			 
		 }else{
			 if(isset($_POST['id'])){   //他人主页微博
				 $query="SELECT * FROM `weibo` WHERE `user_id`={$_POST['id']} ORDER BY `date` DESC LIMIT {$_POST['num']},10";
			 }else{     //个人主页微博
				 $query="SELECT * FROM `weibo` WHERE `user_id`={$id['id']} ORDER BY `date` DESC LIMIT {$_POST['num']},10";
			 }
		 }
		 $result=$conn->query($query);
		 $weibo=array();
		 if(!$result){    //若结果为空则输出空的json并退出；
			 $weibo_json=json_encode($weibo,JSON_UNESCAPED_UNICODE);
		     echo $weibo_json;
			 break;
		 }
		 while($content=$result->fetch_array()){
			 $weibo_item=get_weibo_item($content[0],$id['id'],$conn);
			 array_push($weibo,$weibo_item);
		 }
		 $weibo_json=json_encode($weibo,JSON_UNESCAPED_UNICODE);
		 echo $weibo_json;
		 break;
		 
	case 'comment':
	     
		 $query="SELECT * FROM `comment` WHERE `weibo_id`={$_POST['weibo_id']} ORDER BY `date` DESC LIMIT {$_POST['num']},10";
		 $result=$conn->query($query);
		 $comment=array();
		 while($content=$result->fetch_array()){
			//获取评论人信息
			 $query_user="SELECT `name`,`icon` FROM `user` WHERE `id`='{$content['user_id']}'";
		     $result_user=$conn->query($query_user);
		     $user=$result_user->fetch_array();
			 //获取评论点赞数
			 $query_comment_like="SELECT count(*) FROM `likes` WHERE `comment_id`={$content['id']}";
			 $result_comment_like=$conn->query($query_comment_like);
			 $comment_like=$result_comment_like->fetch_array();
			 $comment_like_total=array('comment_like_total'=>$comment_like[0]);
			 //获取当前是否已点赞
			 $query_comment_liked="SELECT `id` FROM `likes` WHERE `user_id`={$id['id']} and `comment_id`={$content['id']}";
			 $result_comment_liked=$conn->query($query_comment_liked);
			 $comment_liked=$result_comment_liked->num_rows;
			 if($comment_liked==1){
				 $comment_is_like=array('comment_liked'=>1);
			 }else{
				 $comment_is_like=array('comment_liked'=>0);
			 }
			 
			 //获取评论回复数
			 $query_comment_reply="SELECT count(*) FROM `reply` WHERE `comment_id`={$content['id']}";
			 $result_comment_reply=$conn->query($query_comment_reply);
			 $comment_reply=$result_comment_reply->fetch_array();
			 $comment_reply_total=array('comment_reply_total'=>$comment_reply[0]);
			 
			 //合并
			 $comment_item=array_merge($content,$user,$comment_like_total,$comment_is_like,$comment_reply_total);
			 
			 array_push($comment,$comment_item);
			 
		 }
		 $comment_json=json_encode($comment,JSON_UNESCAPED_UNICODE);
		 echo $comment_json;
		 break;
		 
	case 'reply':
	     
		 $query="SELECT * FROM `reply` WHERE `comment_id`={$_POST['comment_id']} ORDER BY `date` DESC LIMIT {$_POST['num']},10";
		 $result=$conn->query($query);
		 $reply=array();
		 while($content=$result->fetch_array()){
			 
			//获取回复人信息
			 $query_user="SELECT `name`,`icon` FROM `user` WHERE `id`='{$content['user_id']}'";
		     $result_user=$conn->query($query_user);
		     $user=$result_user->fetch_array();
			 //获取回复点赞数
			 $query_reply_like="SELECT count(*) FROM `likes` WHERE `reply_id`={$content['id']}";
			 $result_reply_like=$conn->query($query_reply_like);
			 $reply_like=$result_reply_like->fetch_array();
			 $reply_like_total=array('reply_like_total'=>$reply_like[0]);
			 //获取回复当前是否已点赞
			 $query_reply_liked="SELECT `id` FROM `likes` WHERE `user_id`={$id['id']} and `reply_id`={$content['id']}";
			 $result_reply_liked=$conn->query($query_reply_liked);
			 $reply_liked=$result_reply_liked->num_rows;
			 if($reply_liked==1){
				 $reply_is_like=array('reply_liked'=>1);
			 }else{
				 $reply_is_like=array('reply_liked'=>0);
			 }
			 //获取回复回复人信息(对回复进行回复)
			 if($content['reply_id']!=null){
				 //获取被回复的回复的回复人
				 $query_reply_user_id="SELECT `user_id` FROM `reply` WHERE `id`={$content['reply_id']}";
				 $result_reply_user_id=$conn->query($query_reply_user_id);
				 $reply_user_id=$result_reply_user_id->fetch_array();
				 
				 $query_reply_user="SELECT `id`,`name`,`icon` FROM `user` WHERE `id`='{$reply_user_id['user_id']}'";
		         $result_reply_user=$conn->query($query_reply_user);
		         $reply_user=$result_reply_user->fetch_array();
				 
				 $target_user=array("target_user_id"=>$reply_user['id'],"target_name"=>$reply_user['name'],"target_icon"=>$reply_user['icon']);
				 
				 //合并
				 $reply_item=array_merge($content,$user,$reply_like_total,$reply_is_like,$target_user);
				 
			 }else{
				 
				 //合并
			     $reply_item=array_merge($content,$user,$reply_like_total,$reply_is_like);
			 }
			 
			 array_push($reply,$reply_item);
			 
		 }
		 $reply_json=json_encode($reply,JSON_UNESCAPED_UNICODE);
		 echo $reply_json;
		 break;
	
	case 'meme':
	     $meme_path="D:/wamp64/www/simpleLife/resource/meme";
		 $meme_array=scandir($meme_path);
		 $meme_json=json_encode($meme_array);
		 echo $meme_json;
		 break;
		 
	case 'album':
	     if(isset($_POST['id'])){
			 $album_path="D:/wamp64/www/simpleLife/resource/".$_POST['id'];
		 }else{
			 $album_path="D:/wamp64/www/simpleLife/resource/".$id['id'];
		 }
		 $album_array=array_slice(scandir($album_path),$_POST['num'],20);
		 $album_json=json_encode($album_array);
		 echo $album_json;
		 break;
		 
	case 'user_list':
	     $query="SELECT `id` FROM `user` WHERE `name` like '%{$_POST['value']}%' ORDER BY `date` DESC LIMIT {$_POST['num']},10";
		 $result=$conn->query($query);
		 $user_list=array();
		 while($content=$result->fetch_array()){
			 $user_info=get_user_info($content['id'],$id['id'],$conn);
			 array_push($user_list,$user_info);
		 }
		 $user_list_json=json_encode($user_list,JSON_UNESCAPED_UNICODE);
		 echo $user_list_json;
		 break;
		 
	case 'follow_list':
	     $query="SELECT `user_id` FROM `fans` WHERE `fans_user_id`={$id['id']} ORDER BY `date` DESC LIMIT {$_POST['num']},20";
		 $result=$conn->query($query);
		 $follow_list=array();
		 while($content=$result->fetch_array()){
			 $follow_user_info=get_user_info($content['user_id'],$id['id'],$conn);
			 array_push($follow_list,$follow_user_info);
		 }
		 $follow_list_json=json_encode($follow_list,JSON_UNESCAPED_UNICODE);
		 echo $follow_list_json;
		 break;
		 
	case 'fans_list':
	     $query="SELECT `fans_user_id` FROM `fans` WHERE `user_id`={$id['id']} ORDER BY `date` DESC LIMIT {$_POST['num']},20";
		 $result=$conn->query($query);
		 $fans_list=array();
		 while($content=$result->fetch_array()){
			 $fans_user_info=get_user_info($content['fans_user_id'],$id['id'],$conn);
			 array_push($fans_list,$fans_user_info);
		 }
		 $fans_list_json=json_encode($fans_list,JSON_UNESCAPED_UNICODE);
		 echo $fans_list_json;
		 break;
		 
	case 'recommend':
	     $query="SELECT `id` FROM `user` WHERE `id` NOT IN({$id['id']}) ORDER BY RAND() LIMIT 4";
		 $result=$conn->query($query);
		 $recommend_user_list=array();
		 while($content=$result->fetch_array()){
			 $recommend_user=get_user_info($content['id'],$id['id'],$conn);
			 array_push($recommend_user_list,$recommend_user);
		 }
		 $recommend_user_list_json=json_encode($recommend_user_list,JSON_UNESCAPED_UNICODE);
		 echo $recommend_user_list_json;
		 
		break;
		 
}
$conn->close();
}



?>