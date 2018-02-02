<?php 

// $conn=mysqli_connect('localhost','chen','12345','implelife')or die('链接数据库失败！'.mysqli_connect_error($conn));
// @mysqli_query($conn,'set names "utf8"');

$conn=new mysqli();
@$conn->connect('localhost','chen','123456','simplelife');
$conn->query("set names 'utf8'");
if($conn->errno){
	printf("error:%s",$conn->errno);
}


 ?>