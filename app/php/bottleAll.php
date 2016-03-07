<?php

      require_once('db.php');

      try {
              $bottles = $db->query("SELECT lat, lng FROM messages");
              foreach($bottles as $bottle){
                  echo 'Lat: ' . $bottle['lat'] . ', Lng: ' . $bottle['lng'];
              }
      } catch (PDOException $e){
              echo "Error! <br>" . $e->getMessage();
      }

?>