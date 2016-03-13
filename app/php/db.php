<?php

    define("DSN","mysql:host=mysql443.loopia.se;dbname=vilseiskogen_tv");
    define("USER","tmsSkoog@v140645");
    define("PASS","skogenbrinner");
    $opt = array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
    );
    $db = new PDO(DSN, USER, PASS, $opt);

?>