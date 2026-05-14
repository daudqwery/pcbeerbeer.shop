<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
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
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$conn->set_charset("utf8mb4");

$conn->query("CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    originalPrice DECIMAL(15,2) DEFAULT NULL,
    image VARCHAR(1000) DEFAULT '',
    category VARCHAR(255) DEFAULT '',
    stock INT NOT NULL DEFAULT 0,
    alcohol DECIMAL(5,2) DEFAULT 0,
    volume VARCHAR(255) DEFAULT '',
    origin VARCHAR(255) DEFAULT '',
    featured TINYINT(1) NOT NULL DEFAULT 0,
    createdAt VARCHAR(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT id, name, description, price, originalPrice, image, category, stock, alcohol, volume, origin, featured, createdAt FROM products ORDER BY createdAt ASC");

    if (!$result) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
        $conn->close();
        exit;
    }

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            "id"            => (string) $row['id'],
            "name"          => (string) $row['name'],
            "description"   => (string) ($row['description'] ?? ''),
            "price"         => (float) $row['price'],
            "originalPrice" => $row['originalPrice'] !== null ? (float) $row['originalPrice'] : null,
            "image"         => (string) ($row['image'] ?? ''),
            "category"      => (string) ($row['category'] ?? ''),
            "stock"         => (int) $row['stock'],
            "alcohol"       => (float) $row['alcohol'],
            "volume"        => (string) ($row['volume'] ?? ''),
            "origin"        => (string) ($row['origin'] ?? ''),
            "featured"      => (bool) $row['featured'],
            "createdAt"     => (string) ($row['createdAt'] ?? ''),
        ];
    }

    echo json_encode(["status" => "success", "products" => $products]);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['id']) || empty($data['name'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "id and name are required"]);
        $conn->close();
        exit;
    }

    $id            = $data['id'];
    $name          = $data['name'];
    $description   = $data['description'] ?? '';
    $price         = isset($data['price']) ? (float) $data['price'] : 0;
    $originalPrice = isset($data['originalPrice']) && $data['originalPrice'] !== null ? (float) $data['originalPrice'] : null;
    $image         = $data['image'] ?? '';
    $category      = $data['category'] ?? '';
    $stock         = isset($data['stock']) ? (int) $data['stock'] : 0;
    $alcohol       = isset($data['alcohol']) ? (float) $data['alcohol'] : 0;
    $volume        = $data['volume'] ?? '';
    $origin        = $data['origin'] ?? '';
    $featured      = !empty($data['featured']) ? 1 : 0;
    $createdAt     = $data['createdAt'] ?? date('Y-m-d');

    $stmt = $conn->prepare("INSERT INTO products (id, name, description, price, originalPrice, image, category, stock, alcohol, volume, origin, featured, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), originalPrice=VALUES(originalPrice), image=VALUES(image), category=VALUES(category), stock=VALUES(stock), alcohol=VALUES(alcohol), volume=VALUES(volume), origin=VALUES(origin), featured=VALUES(featured), createdAt=VALUES(createdAt)");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        $conn->close();
        exit;
    }

    $stmt->bind_param(
        "sssddssidssis",
        $id, $name, $description, $price, $originalPrice,
        $image, $category, $stock, $alcohol, $volume,
        $origin, $featured, $createdAt
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Product saved"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
    }

    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}

$conn->close();
?>