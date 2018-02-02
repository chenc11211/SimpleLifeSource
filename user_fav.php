<?php
session_start();

if(isset($_SESSION['user_email'])){
	$key_words='';
	if(isset($_GET['key_words'])){
		$key_words=$_GET['key_words'];
	}
	echo("<!DOCTYPE HTML><script>var key_words='{$key_words}' ; </script>");
	include 'user_fav.html';
		
}else{
	header("location:login.php");
}

