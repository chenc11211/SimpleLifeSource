<?php
session_start();

if(isset($_SESSION['user_email'])){
	echo("<!DOCTYPE HTML><script>var key_words= '{$_GET['key_words']}' ; </script>");
	include 'search_page.html';
		
}else{
	header("location:login.php");
}

?>