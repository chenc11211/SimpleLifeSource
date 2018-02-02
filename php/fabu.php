<?php
session_start();
require "connect.php";
//sleep(1);
//获取用户ID
$query_id="SELECT `id` FROM `user` WHERE `email`='{$_SESSION['user_email']}'";
$result_id=$conn->query($query_id);
$id=$result_id->fetch_array();


function increase_hot($id,$conn){//增加热度值；参数：微博ID；
	$query_hot="UPDATE `weibo` SET `hot`=`hot`+1 WHERE `id`={$id}";
	$result=$conn->query($query_hot);
}

switch($_POST['target']){
	case 'weibo':
	     //修改img链接
		 $content=$_POST['content'];
		 $content=preg_replace("/(<img src\=\"resource\/\d*)\/tmp(\/\d*.jpg\?\=\d*\">)/U","\${1}\${2}",$content);  
		 //添加内容至数据库
		 $query_fabu="INSERT INTO `weibo` (`user_id`,`weibo`,`date`) values ({$id['id']},'{$content}',now())";
		 $result_fabu=$conn->query($query_fabu);
		 if($result_fabu==1){
			 //内容添加成功后移动图片位置
			 if(preg_match_all("/<img src=\"resource\/\d*\/(\d*.jpg)/U",$content,$img_array)){  //获取图片文件名
				 //printf($img_array[1][0]);
			 while($img=current($img_array[1])){
				 rename('D:/wamp64/www/simpleLife/resource/'.$id["id"].'/tmp/'.$img,'D:/wamp64/www/simpleLife/resource/'.$id["id"].'/'.$img);   //移动到新的路径
				 next($img_array[1]);
				 }
			 }
			 //获取新添加的微博信息并输出
			 $query_weibo="SELECT * FROM `weibo` WHERE `user_id`={$id['id']} order by `date` desc limit 1";
			 $result_weibo=$conn->query($query_weibo);
			 $weibo=$result_weibo->fetch_array();
			 $weibo_json=json_encode($weibo,JSON_UNESCAPED_UNICODE);
			 echo $weibo_json;
			 
		}
		break;
		
	case 'comment':
	     $query_fabu="INSERT INTO `comment` (`user_id`,`weibo_id`,`comment`,`date`) values ({$id['id']},{$_POST['weibo_id']},'{$_POST['content']}',now())";
		 $result_fabu=$conn->query($query_fabu);
		 
		 increase_hot($_POST['weibo_id'],$conn);
		 //获取新发布的评论信息并输出
		 $query_comment="SELECT * FROM `comment` WHERE `user_id`={$id['id']} order by `date` desc limit 1";
		 $result_comment=$conn->query($query_comment);
		 $comment=$result_comment->fetch_array();
		 $comment_json=json_encode($comment,JSON_UNESCAPED_UNICODE);
		 echo $comment_json;
		 break;
	     
	case 'reply':
	     if(isset($_POST['reply_id'])){
			 $query_fabu="INSERT INTO `reply` (`user_id`,`comment_id`,`reply_id`,`reply`,`date`) values ({$id['id']},{$_POST['comment_id']},{$_POST['reply_id']},'{$_POST['content']}',now())";
		 }else{
			 $query_fabu="INSERT INTO `reply` (`user_id`,`comment_id`,`reply`,`date`) values ({$id['id']},{$_POST['comment_id']},'{$_POST['content']}',now())";
		 }
	     $result_fabu=$conn->query($query_fabu);
		 //获取新发布的回复信息并返回
		 $query_reply="SELECT * FROM `reply` WHERE `user_id`={$id['id']} order by `date` desc limit 1";
		 $result_reply=$conn->query($query_reply);
		 $reply=$result_reply->fetch_array();
		 $reply_json=json_encode($reply,JSON_UNESCAPED_UNICODE);
		 echo $reply_json;
		 break;
	
    case 'add_collection':
	     $query="INSERT INTO `collection` (`user_id`,`weibo_id`,`date`) values ({$id['id']},{$_POST['weibo_id']},now())";
		 $result_fabu=$conn->query($query);
		 echo $result_fabu;
		 break;
	     
	case 'remove_collection':
	     $query="DELETE FROM `collection` WHERE `user_id`={$id['id']} and `weibo_id`={$_POST['weibo_id']}";
		 $result_fabu=$conn->query($query);
		 echo $result_fabu;
		 break;
		 
	case 'like':
	     if(isset($_POST['weibo_id'])){
			 $query="INSERT INTO `likes` (`weibo_id`,`user_id`,`date`) values ({$_POST['weibo_id']},{$id['id']},now())";
		 }else if(isset($_POST['comment_id'])){
			 $query="INSERT INTO `likes` (`comment_id`,`user_id`,`date`) values ({$_POST['comment_id']},{$id['id']},now())";
		 }else if(isset($_POST['reply_id'])){
			 $query="INSERT INTO `likes` (`reply_id`,`user_id`,`date`) values ({$_POST['reply_id']},{$id['id']},now())";
		 }
		 $result_fabu=$conn->query($query);
		 echo $result_fabu;
		 break;
		 
	case 'cancel_like':
	     if(isset($_POST['weibo_id'])){
			 $query="DELETE FROM `likes` WHERE `user_id`={$id['id']} and `weibo_id`={$_POST['weibo_id']}";
		 }else if(isset($_POST['comment_id'])){
			 $query="DELETE FROM `likes` WHERE `user_id`={$id['id']} and `comment_id`={$_POST['comment_id']}";
		 }else if(isset($_POST['reply_id'])){
			 $query="DELETE FROM `likes` WHERE `user_id`={$id['id']} and `reply_id`={$_POST['reply_id']}";
		 }
		 $result_fabu=$conn->query($query);
		 echo $result_fabu;
		 break;
		 
	case 'fans':
	     $query_followed="SELECT count(*) FROM `fans` WHERE `user_id`={$_POST['id']} and `fans_user_id`={$id['id']}";
		 $result_followed=$conn->query($query_followed);
		 $followed=$result_followed->fetch_array();
		 if($followed[0]==0){      //若没有此条关注则添加关注
			 $query="INSERT INTO `fans` (`user_id`,`fans_user_id`,`date`) values ({$_POST['id']},{$id['id']},now())";
		     $result_fabu=$conn->query($query);
		     echo $result_fabu;
		 }
		 break;
		 
	case 'cancel_follow':
	     $query="DELETE FROM `fans` WHERE `user_id`={$_POST['id']} and `fans_user_id`={$id['id']}";
		 $result_fabu=$conn->query($query);
		 echo $result_fabu;
	     
}

$conn->close();



/*


*/
?>