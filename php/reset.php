<?php
session_start();
if(!isset($_SESSION['user_email'])){
	echo '00';
	
}else{
	require 'connect.php';
	
    //获取当前用户ID
    $query="SELECT `id` FROM `user` WHERE `email`='{$_SESSION['user_email']}'";
	$result=$conn->query($query);
	$id=$result->fetch_array();	
	switch ($_POST['target']){
		case 'user_info':
		     if(isset($_POST['operation'])){
				 if($_POST['operation']=='cropper'){    //剪切图片操作;
					 $img=imagecreatefromjpeg('D:/wamp64/www/simpleLife/resource/'.$id['id'].'/info/'.$_POST['name'].'_temp.jpg');  //读取原图;
					 if($_POST['name']=='icon'){   //设定新图片尺寸;
						 $width=100;
						 $height=100;
					 }else{
						 $width=1000;
						 $height=350;
					 }
					 $new_img=imagecreatetruecolor($width,$height);  //创建新的空白图片;
					 imagecopyresampled($new_img,$img,0,0,$_POST['x'],$_POST['y'],$width,$height,$_POST['width'],$_POST['height']);   //剪裁图片至新画布
					 imagedestroy($img);
					 imagejpeg($new_img,'D:/wamp64/www/simpleLife/resource/'.$id['id'].'/info/'.$_POST['name'].'.jpg');
					 imagedestroy($new_img);
				 }
			 }
		     $query_info="UPDATE `user` SET `{$_POST['name']}`='{$_POST['value']}' WHERE `id`={$id['id']}";
			 $result_info=$conn->query($query_info);
			 echo $result_info;
			 break;
		
	}
}


?>