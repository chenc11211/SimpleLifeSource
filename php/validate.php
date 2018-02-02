<?php

require 'connect.php';
$query="SELECT `email` FROM `user` WHERE `email`='{$_GET['set_email']}'";
$result=$conn->query($query);
print_r($result->num_rows);

?>