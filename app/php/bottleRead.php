<?php

    require_once('db.php');

    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    try {
            $results = $db->query("SELECT msg FROM messages WHERE lat = '$lat' AND lng = '$lng'");
            echo "SUCCESS FÖFAN! <br>";
        } catch (PDOException $e){
            echo "DROR FAILURE!" . $sql . "<br>" . $e->getMessage();
            exit;
        }

    echo "<pre>";
    var_dump($results->fetchAll());

?>