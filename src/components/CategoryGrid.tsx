import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/catalog";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/product-category/${category.slug}`}
          className="glass group overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-[5/4] bg-foreground/5">
            {category.image ? (
              <Image
                src={category.image.sourceUrl}
                alt={category.name}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-contain p-5 transition group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary/25">
                {category.name}
              </div>
            )}
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold">{category.name}</h2>
              {category.parent && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {category.parent.name}
                </p>
              )}
              {typeof category.count === "number" && (
                <p className="mt-1 text-xs text-muted-foreground">{category.count} products</p>
              )}
            </div>
            <ArrowUpRight className="size-5 text-primary" />
          </div>
        </Link>
      ))}
    </div>
  );
}
