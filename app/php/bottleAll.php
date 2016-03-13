<?php

  require_once('db.php');

  try {
          $bottles = $db->query("SELECT * FROM messages");
          $bottleArray = $bottles->fetchAll(PDO::FETCH_ASSOC);
          echo json_encode($bottleArray);
  } catch (PDOException $e){
          echo "Error! <br>" . $e->getMessage();
  }

?>