import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogPage, { parsePage } from "@/components/CatalogPage";
import CategoryGrid from "@/components/CategoryGrid";
import { getAllCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Shop wholesale ${category.name} at Elite Wholesale. ${category.count ?? 0} products available.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const categories = await getAllCategories();
  const subcategories = categories.filter(
    (candidate) => candidate.parent?.databaseId === category.databaseId,
  );

  if (subcategories.length > 0) {
    return (
      <div className="page-shell py-12">
        <p className="section-label">Category</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{category.name}</h1>
        <p className="mt-4 text-muted-foreground">
          Choose a subcategory to browse its products.
        </p>
        <CategoryGrid categories={subcategories} />
      </div>
    );
  }

  const items = await getProductsByCategory(slug);

  return (
    <CatalogPage
      eyebrow="Category"
      title={category.name}
      description={`Browse all products currently listed in ${category.name}.`}
      items={items}
      categories={categories}
      basePath={`/product-category/${slug}`}
      page={parsePage(page)}
      emptyMessage="No published products are currently listed in this category."
    />
  );
}
