<?php
// Admin categories API (X-Api-Key required).
// GET ?  -> AdminTerm[] | GET ?id=N -> AdminTerm | POST -> AdminTerm (201)
// PUT ?id=N -> AdminTerm | DELETE ?id=N -> { deleted: true }
// JSON body: name (required), description, image_url, parent_id (optional; a root category or null)
require __DIR__ . '/../../lib/config.php';
require_api_key();

$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

function format_term(PDO $pdo, array $row): array {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM product_categories WHERE category_id = ?");
    $stmt->execute([$row['id']]);
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'description' => $row['description'] ?? '',
        'count' => (int)$stmt->fetchColumn(),
        'image' => $row['image_url'] ? ['id' => 0, 'src' => $row['image_url']] : null,
        'parent_id' => $row['parent_id'] !== null ? (int)$row['parent_id'] : null,
        'parent_name' => $row['parent_name'] ?? null,
    ];
}

function load_term(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT c.*, parent.name AS parent_name FROM categories c LEFT JOIN categories parent ON parent.id = c.parent_id WHERE c.id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

if ($method === 'GET' && $id) {
    $row = load_term($pdo, $id);
    if (!$row) json_out(['message' => 'Not found'], 404);
    json_out(format_term($pdo, $row));
}

if ($method === 'GET') {
    $rows = $pdo->query("SELECT c.*, parent.name AS parent_name FROM categories c LEFT JOIN categories parent ON parent.id = c.parent_id ORDER BY COALESCE(parent.name, c.name), c.parent_id IS NOT NULL, c.name")->fetchAll();
    json_out(array_map(fn($r) => format_term($pdo, $r), $rows));
}

function category_parent_id(PDO $pdo, mixed $value, ?int $categoryId = null): ?int {
    if ($value === null || $value === '') return null;
    $parentId = filter_var($value, FILTER_VALIDATE_INT);
    if ($parentId === false || $parentId < 1 || $parentId === $categoryId) {
        json_out(['message' => 'Parent category is invalid'], 422);
    }
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ? AND parent_id IS NULL");
    $stmt->execute([$parentId]);
    if (!$stmt->fetchColumn()) {
        json_out(['message' => 'Parent category must be an existing top-level category'], 422);
    }
    return $parentId;
}

if ($method === 'POST') {
    $body = json_body();
    $name = trim((string)($body['name'] ?? ''));
    if ($name === '') json_out(['message' => 'Name is required'], 422);
    $parentId = category_parent_id($pdo, $body['parent_id'] ?? null);
    $pdo->prepare("INSERT INTO categories (name, slug, description, image_url, parent_id) VALUES (?, ?, ?, ?, ?)")
        ->execute([$name, unique_term_slug($pdo, 'categories', $name), $body['description'] ?? '', $body['image_url'] ?? null, $parentId]);
    json_out(format_term($pdo, load_term($pdo, (int)$pdo->lastInsertId())), 201);
}

if ($method === 'PUT' && $id) {
    $current = load_term($pdo, $id);
    if (!$current) json_out(['message' => 'Not found'], 404);
    $body = json_body();
    $name = trim((string)($body['name'] ?? ''));
    if ($name === '') json_out(['message' => 'Name is required'], 422);
    $parentId = array_key_exists('parent_id', $body)
        ? category_parent_id($pdo, $body['parent_id'], $id)
        : ($current['parent_id'] !== null ? (int)$current['parent_id'] : null);
    if ($parentId !== null) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM categories WHERE parent_id = ?");
        $stmt->execute([$id]);
        if ((int)$stmt->fetchColumn() > 0) {
            json_out(['message' => 'A category with subcategories cannot become a subcategory'], 422);
        }
    }
    // The slug is kept on rename so existing links and URLs keep working.
    $pdo->prepare("UPDATE categories SET name = ?, description = ?, image_url = COALESCE(?, image_url), parent_id = ? WHERE id = ?")
        ->execute([$name, $body['description'] ?? '', $body['image_url'] ?? null, $parentId, $id]);
    json_out(format_term($pdo, load_term($pdo, $id)));
}

if ($method === 'DELETE' && $id) {
    $pdo->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    json_out(['deleted' => true]);
}

json_out(['message' => 'Bad request'], 400);
