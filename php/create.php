
<?php 
require 'connect.php';
$set_birthday=$_POST['year'].$_POST['month'].$_POST['day'];
$query="INSERT INTO `user` (`name`,`email`,`password`,`birthday`,`gender`,`date`) values ('{$_POST['set_name']}','{$_POST['set_email']}',sha1('{$_POST['set_password']}'),'{$set_birthday}','{$_POST['set_gender']}',now())";

$result=$conn->query($query);
echo $result;


$conn->close();

 ?>