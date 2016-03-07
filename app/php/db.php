<?php

    define("DSN","mysql:host=localhost;dbname=vilseiskogen_tv");
    define("USER","root");
    define("PASS","");
    $opt = array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
    );
    $db = new PDO(DSN, USER, PASS, $opt);

?>