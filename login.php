<?php
session_start();

if(isset($_SESSION['user_email'])){
	header("location:home_page.php");
}else{
	if(isset($_POST['user_email'])){
		
		require 'php/connect.php';
		$query="SELECT `password` FROM `user` WHERE `email`='{$_POST['user_email']}'";
		$result=$conn->query($query);
		if($result){
			$password=$result->fetch_array();
			if($password['password']==sha1($_POST['user_password'])){
				//echo 1;
				$_SESSION["user_email"]=$_POST['user_email'];
				header("location:home_page.php");
			}
			else{
				echo '用户名或密码错误！<a href="login.php">返回</a>';
			}
			$result->free();
		}else{
			echo '服务器链接出错！<a href="login.php">返回</a>';
		}
		$conn->close();
		
	}else{
		
		include 'login.html';
	}
		
}	
	
	



?>