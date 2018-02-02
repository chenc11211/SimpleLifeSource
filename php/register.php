
<?php 
session_start();
require 'connect.php';
$set_birthday=$_POST['year'].$_POST['month'].$_POST['day'];
$query="INSERT INTO `user` (`name`,`email`,`password`,`birthday`,`gender`,`date`) values ('{$_POST['set_name']}','{$_POST['set_email']}',sha1('{$_POST['set_password']}'),'{$set_birthday}','{$_POST['set_gender']}',now())";

$result=$conn->query($query);
echo $result;
if($result==1){
	$_SESSION['user_email']=$_POST['set_email'];
	
	$query="SELECT `id` FROM `user` WHERE `email`='{$_POST['set_email']}'";
	$result=$conn->query($query);
	$id=$result->fetch_array();
	$path="D:/wamp64/www/simpleLife/resource/".$id['id'];
	if(!file_exists($path)){
		mkdir($path);
		mkdir($path.'/tmp');
		mkdir($path.'/info');
	}
}
$conn->close();

 ?>