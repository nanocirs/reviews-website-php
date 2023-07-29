<?php 

include_once 'config.php';

if (!isset($_POST['request'])) {
    header('HTTP/1.0 403 Forbidden');
    exit();
}

$query = "SELECT user, review, date, rating FROM reviews ORDER BY date DESC";
$result = mysqli_query($conn, $query);
$data = array();

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);
mysqli_close($conn);