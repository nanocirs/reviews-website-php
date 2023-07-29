<?php

$DB_HOST = 'database_host';
$DB_USER = 'database_user';
$DB_PASS = 'database_pass';
$DB_NAME = 'database_db';

$conn = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

if (mysqli_connect_errno()) {
    die('Failed to connect to MySQL: ' . mysqli_connect_error());
}

$result = mysqli_query($conn, "SHOW TABLES LIKE 'reviews'");

// Install table reviews if it doesn't exist
if (empty(mysqli_fetch_all($result))) {
    $query = "CREATE TABLE IF NOT EXISTS reviews (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `user` varchar(255) NOT NULL,
        `review` text NOT NULL,
        `date` datetime DEFAULT NULL,
        `rating` int(11) DEFAULT NULL,
        `ip` varchar(45) DEFAULT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1";
    mysqli_query($conn, $query);
}