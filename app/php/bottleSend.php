<?php

    require_once('db.php');

    $msg = (isset($_POST['msg']) ? $_POST['msg'] : null);
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    try {
            $stmt = $db->prepare("INSERT INTO messages (msg, lat, lng) VALUES ( :msg, :lat, :lng)");
            $stmt->bindParam(':msg', $msg, PDO::PARAM_STR);
            $stmt->bindParam(':lat', $lat, PDO::PARAM_STR);
            $stmt->bindParam(':lng', $lng, PDO::PARAM_STR);
            $stmt->execute();
            echo "You screw the cork in tightly, and throw the bottle into the water. <br>Bon voyage, little one!";
        } catch (PDOException $e){
            echo "The bottle breaks against the sharp rocks! <br> What a waste of paper, ink and bottle!<br>" . $e->getMessage();
        }

?>