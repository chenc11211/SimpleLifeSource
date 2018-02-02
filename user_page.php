<?php
session_start();

if(isset($_SESSION['user_email'])){
	require 'php/connect.php';
	//获取当前用户ID
    $query="SELECT `id` FROM `user` WHERE `email`='{$_SESSION['user_email']}'";
	$result=$conn->query($query);
	$id=$result->fetch_array();
	if(isset($_GET['id'])&&($_GET['id']!=$id['id'])){    //如果传入了id且值不是当前用户
		echo("<!DOCTYPE HTML><script>var other_id= {$_GET['id']} ; </script>");
		include 'other_user_page.html';
		
	}else{
		
		include 'user_page.html';
	}
	
}else{
	header("location:login.php");
}

?>