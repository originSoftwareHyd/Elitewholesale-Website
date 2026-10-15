import type { Metadata } from "next";
import { getAllCategories } from "@/lib/catalog";
import CategoryGrid from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all Elite Wholesale product categories.",
};

export default async function CategoriesPage() {
  const categories = (await getAllCategories()).filter((category) => !category.parent);
  return (
    <div className="page-shell py-12">
      <p className="section-label">Catalogue departments</p>
      <h1 className="mt-3 text-4xl font-black sm:text-5xl">Shop by category</h1>
      <p className="mt-4 text-muted-foreground">
        {categories.length} departments of vapes, e-liquids, and smoke shop supplies stocked for wholesale.
      </p>
      <CategoryGrid categories={categories} />
    </div>
  );
}
