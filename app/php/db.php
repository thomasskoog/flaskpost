<?php

    $dbname = 'vilseiskogen_tv';
    $dbuser = 'thomas';
    $dbpass = 'Luggen1337';
    $dbhost = 'mysql443.loopia.se';
    $connect = mysql_connect($dbhost,$dbuser,$dbpass) or die('Could not connect to "$dbhost"');
    $db = mysql_select_db($dbname) or die('Could not open the db "$dbname"');

?>