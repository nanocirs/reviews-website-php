<?php

include_once 'config.php';

$ip = $_SERVER['REMOTE_ADDR'];
$user = anti_injection($_POST['username'], $conn);
$user = substr($user, 0, 20);
$rating = anti_injection($_POST['rating'], $conn);
$review = htmlspecialchars($_POST['review']);
$review = substr($review, 0, 520);
$rating = max(1, min(5, $rating));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $date_limit = date('Y-m-d H:i:s', strtotime('-2 hours'));
    $stmt = $conn->prepare("SELECT COUNT(*) FROM reviews WHERE ip = ? AND date > ?");
    $stmt->bind_param('ss', $ip, $date_limit);
    $stmt->execute();
    $stmt->bind_result($recent_reviewed);
    $stmt->fetch();
    $stmt->close();

    if ($recent_reviewed > 0) {
        echo 'already_reviewed';
    } 
    else {
        $date = date('Y-m-d H:i:s');
        $stmt = $conn->prepare("INSERT INTO reviews (ip, user, review, date, rating) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssssi', $ip, $user, $review, $date, $rating);
        $stmt->execute();
        $stmt->close();
    }
}

mysqli_close($conn);

function anti_injection($input, $conn) {
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = anti_injection($value, $conn);
        }
    } 
    else {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES);
        $input = mysqli_real_escape_string($conn, $input);
    }
    return $input;
}