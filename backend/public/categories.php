<?php
// GET /categories.php          -> { productCategories: { nodes: Category[] } }
// GET /categories.php?slug=X   -> { productCategory: Category | null }
require __DIR__ . '/../lib/config.php';

$pdo = db();

function format_category(array $row): array {
    return [
        'databaseId' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'count' => (int)$row['product_count'],
        'description' => $row['description'],
        'image' => $row['image_url'] ? ['sourceUrl' => $row['image_url']] : null,
        'parent' => $row['parent_id'] !== null ? [
            'databaseId' => (int)$row['parent_id'],
            'name' => $row['parent_name'],
            'slug' => $row['parent_slug'],
        ] : null,
    ];
}

// Counts only include products the website actually shows (active + published).
$baseSql = "SELECT c.*, parent.name AS parent_name, parent.slug AS parent_slug, (SELECT COUNT(*) FROM product_categories pc JOIN products p ON p.id = pc.product_id WHERE pc.category_id = c.id AND " . visible_product_sql() . ") AS product_count FROM categories c LEFT JOIN categories parent ON parent.id = c.parent_id";

$slug = $_GET['slug'] ?? null;
if ($slug !== null) {
    $stmt = $pdo->prepare($baseSql . " WHERE c.slug = ?");
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    json_out(['productCategory' => $row ? format_category($row) : null]);
}

$rows = $pdo->query($baseSql . " ORDER BY COALESCE(parent.name, c.name), c.parent_id IS NOT NULL, c.name")->fetchAll();
json_out(['productCategories' => ['nodes' => array_map('format_category', $rows)]]);
