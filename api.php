<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "mnongcqp_admin";
$pass = "AdminPcBeer@2026";
$db   = "mnongcqp_shop";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Create tables if not exists
$conn->query("CREATE TABLE IF NOT EXISTS settings (id INT PRIMARY KEY, key_name VARCHAR(255), key_value TEXT)");
$conn->query("CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, customer_name VARCHAR(255), details TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");

$action = $_GET['action'] ?? '';

if ($action == 'save_key') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['key_name'];
    $value = $data['key_value'];
    $stmt = $conn->prepare("INSERT INTO settings (id, key_name, key_value) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE key_value = ?");
    $stmt->bind_param("sss", $name, $value, $value);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
} elseif ($action == 'get_key') {
    $res = $conn->query("SELECT key_value FROM settings WHERE id = 1");
    echo json_encode($res->fetch_assoc());
} elseif ($action == 'save_order') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['customer_name%'];
    $details = json_encode($data['details']);
    $stmt->prepare("INSERT INTO orders (customer_name, details) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $details);
    if ($stmt->execute()) {
        echo json_encode)Ébstatus" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
}
$conn->close();
?>