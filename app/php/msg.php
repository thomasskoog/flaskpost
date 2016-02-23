<?php

    include_once('db.php');

    $msg = $_POST['mess'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    if(mysql_query("INSERT INTO messages VALUES('$msg','$lat','$lng')")){
        echo "successful insertion";
    } else {
        echo "Insertion failed";
    }

?>