<?php
session_start();
require 'connect.php';
$query="SELECT `id` FROM `user` WHERE `email`='{$_SESSION['user_email']}'";
	$result=$conn->query($query);
	$id=$result->fetch_array();
if($_POST["target"]=="cover"){
	define('FILE_ADDR', 'D:/wamp64/www/simpleLife/resource/'.$id['id'].'/info/cover_temp.jpg');
}
else if($_POST["target"]=="icon"){
	define('FILE_ADDR', 'D:/wamp64/www/simpleLife/resource/'.$id['id'].'/info/icon_temp.jpg');
}
else if($_POST["target"]=="weibo"){
	define('FILE_ADDR','D:/wamp64/www/simpleLife/resource/'.$id['id'].'/tmp/'.time().'.jpg');
}

if($_FILES['user_img']['type']!="image/jpeg"){
	
	echo 0;
}
else{
$result=move_uploaded_file($_FILES['user_img']['tmp_name'],FILE_ADDR);
if($result==1){
	echo (FILE_ADDR.'?='.time());
}
else{
	echo 0;
}
}


?>