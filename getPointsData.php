<?php 

$url = $_GET['url'];
echo "var topographyData = ". file_get_contents($url);