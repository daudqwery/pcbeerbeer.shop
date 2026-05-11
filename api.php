<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host = "localhost";
$user = "mnongcqp_admin";
$pass = "AdminPcBeer@2026";
$db   = "mnongcqp_shop";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

$conn->query("CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    key_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

$conn->query("CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE,
    customer_name VARCHAR(255),
    details LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$conn->query("CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$check = $conn->query("SELECT id FROM admin_users WHERE username = 'admin'");
if ($check && $check->num_rows === 0) {
    $hash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO admin_users (username, password_hash) VALUES ('admin', ?)");
    $stmt->bind_param("s", $hash);
    $stmt->execute();
    $stmt->close();
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        if ($username === '' || $password === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Username and password required"]);
            break;
        }
        $stmt = $conn->prepare("SELECT id, password_hash FROM admin_users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        if ($row && password_verify($password, $row['password_hash'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $username;
            $_SESSION['admin_id'] = $row['id'];
            echo json_encode(["status" => "success", "message" => "Logged in"]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
        break;
    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
        }
        session_destroy();
        echo json_encode(["status" => "success", "message" => "Logged out"]);
        break;
    case 'check_session':
        if (!empty($_SESSION['admin_logged_in'])) {
            echo json_encode(["status" => "success", "loggedIn" => true, "username" => $_SESSION['admin_username'] ?? 'admin']);
        } else {
            echo json_encode(["status" => "success", "loggedIn" => false]);
        }
        break;
    case 'save_key':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['key_name'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "key_name is required"]);
            break;
        }
        $name = $data['key_name'];
        $value = $data['key_value'] ?? '';
        $stmt = $conn->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
        $stmt->bind_param("ss", $name, $value);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
        $stmt->close();
        break;
    case 'get_key':
        $keyName = $_GET['key_name'] ?? '';
        if ($keyName === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "key_name query param is required"]);
            break;
        }
        $stmt = $conn->prepare("SELECT key_value FROM settings WHERE key_name = ?");
        $stmt->bind_param("s", $keyName);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        if ($row) {
            echo json_encode(["status" => "success", "key_value" => $row['key_value']]);
        } else {
            echo json_encode(["status" => "success", "key_value" => null]);
        }
        $stmt->close();
        break;
    case 'get_all_settings':
        $result = $conn->query("SELECT key_name, key_value FROM settings ORDER BY key_name");
        $settings = [];
        while ($row = $result->fetch_assoc()) {
            $settings[$row['key_name']] = $row['key_value'];
        }
        echo json_encode(["status" => "success", "settings" => $settings]);
        break;
    case 'save_order':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['customer_name'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "customer_name is required"]);
            break;
        }
        $customerName = $data['customer_name'];
        $orderId = $data['order_id'] ?? null;
        $details = json_encode($data['details'] ?? $data);
        if ($orderId) {
            $stmt = $conn->prepare("INSERT INTO orders (order_id, customer_name, details) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name), details = VALUES(details)");
            $stmt->bind_param("sss", $orderId, $customerName, $details);
        } else {
            $stmt = $conn->prepare("INSERT INTO orders (customer_name, details) VALUES (?, ?)");
            $stmt->bind_param("ss", $customerName, $details);
        }
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "id" => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
        $stmt->close();
        break;
    case 'get_all_orders':
        $result = $conn->query("SELECT id, order_id, customer_name, details, created_at FROM orders ORDER BY created_at DESC");
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $decoded = json_decode($row['details'], true);
            if ($decoded) { $orders[] = $decoded; }
            else { $orders[] = ["id" => $row['order_id'] ?? $row['id'], "customerName" => $row['customer_name'], "details" => $row['details'], "createdAt" => $row['created_at']]; }
        }
        echo json_encode(["status" => "success", "orders" => $orders]);
        break;
    case 'update_order_status':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || empty($data['order_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "order_id is required"]);
            break;
        }
        $orderId = $data['order_id'];
        $stmt = $conn->prepare("SELECT details FROM orders WHERE order_id = ?");
        $stmt->bind_param("s", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        if (!$row) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Order not found"]);
            break;
        }
        $details = json_decode($row['details'], true) ?? [];
        if (isset($data['status'])) { $details['status'] = $data['status']; }
        if (isset($data['paymentStatus'])) { $details['paymentStatus'] = $data['paymentStatus']; }
        $newDetails = json_encode($details);
        $customerName = $details['customerName'] ?? '';
        $stmt2 = $conn->prepare("UPDATE orders SET details = ?, customer_name = ? WHERE order_id = ?");
        $stmt2->bind_param("sss", $newDetails, $customerName, $orderId);
        if ($stmt2->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $stmt2->error]);
        }
        $stmt2->close();
        break;
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Unknown action"]);
        break;
}

$conn->close();
?>
