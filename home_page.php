<?php
session_start();

if(isset($_SESSION['user_email'])){
	
	include 'home_page.html';
	
}else{
	header("location:login.php");
}

?>