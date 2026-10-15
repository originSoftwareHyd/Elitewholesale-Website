"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import type { Category, Brand } from "@/lib/catalog";
import { mainNav } from "@/lib/site";
import SearchBox from "@/components/SearchBox";
import EnquiryCartBadge from "@/components/EnquiryCartBadge";

export function Wordmark({ className = "h-14 sm:h-16" }: { className?: string }) {
  return (
    <Image
      src="/images/elite-wholesale-logo.png"
      alt="Elite Wholesale"
      width={731}
      height={341}
      priority
      className={`w-auto ${className}`}
    />
  );
}

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-extrabold uppercase tracking-wide text-foreground hover:bg-white/15 hover:text-foreground";

export default function HeaderClient({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"categories" | "brands" | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileCategoryId, setMobileCategoryId] = useState<number | null>(null);
  const pathname = usePathname();
  const topLevelCategories = categories.filter((category) => !category.parent);
  const subcategoriesFor = (categoryId: number) =>
    categories.filter((category) => category.parent?.databaseId === categoryId);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cls = (href: string) => `${linkClass} ${isActive(href) ? "bg-white/25 text-white" : ""}`;

  return (
    <header className="sticky top-0 z-40 p-3 sm:p-5">
      <div className="header-gradient page-shell rounded-2xl">
        <div className="flex min-h-16 items-center gap-3 py-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="min-w-0" onClick={() => setMobileOpen(false)} aria-label="Elite Wholesale home">
            <Wordmark />
          </Link>

          <nav className="hidden items-center justify-center gap-1 lg:flex lg:-translate-x-4 xl:-translate-x-12">
            {mainNav.map((item) => {
              if (item.label === "Categories" || item.label === "Brands") {
                const key = item.label === "Categories" ? "categories" : "brands";
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(key)}
                    onFocusCapture={() => setOpenMenu(key)}
                    onMouseLeave={() => {
                      setOpenMenu(null);
                      setOpenCategoryId(null);
                    }}
                  >
                    <Link href={item.href} className={cls(item.href)}>
                      {item.label}
                    </Link>
                    {openMenu === key && (
                      <div
                        className={`menu-solid absolute left-1/2 top-full z-50 -translate-x-1/2 rounded-xl p-3 ${
                          key === "categories" ? "w-[320px]" : "max-h-[420px] w-[640px] overflow-y-auto"
                        }`}
                      >
                        {key === "categories" ? (
                          <nav className="grid gap-1">
                            {topLevelCategories.map((category) => {
                              const subcategories = subcategoriesFor(category.databaseId);
                              return (
                                <div
                                  key={category.slug}
                                  className="relative"
                                  onMouseEnter={() => setOpenCategoryId(category.databaseId)}
                                  onFocusCapture={() => setOpenCategoryId(category.databaseId)}
                                >
                                  <div className="flex items-center rounded-lg hover:bg-primary/15">
                                    <Link
                                      href={`/product-category/${category.slug}`}
                                      onClick={() => setOpenMenu(null)}
                                      className="min-w-0 flex-1 truncate px-2.5 py-2 text-sm text-foreground/85 hover:text-primary"
                                    >
                                      {category.name}
                                    </Link>
                                    {subcategories.length > 0 && (
                                      <button
                                        type="button"
                                        aria-label={`Show ${category.name} subcategories`}
                                        aria-expanded={openCategoryId === category.databaseId}
                                        onClick={() =>
                                          setOpenCategoryId((current) =>
                                            current === category.databaseId ? null : category.databaseId,
                                          )
                                        }
                                        className="rounded-md p-2 text-foreground/70 hover:text-primary"
                                      >
                                        <ChevronRight className="size-4" />
                                      </button>
                                    )}
                                  </div>
                                  {subcategories.length > 0 && openCategoryId === category.databaseId && (
                                    <div className="menu-solid absolute left-full top-0 z-50 max-h-[420px] w-[260px] overflow-y-auto rounded-xl p-2">
                                      <nav className="grid gap-1">
                                        {subcategories.map((subcategory) => (
                                          <Link
                                            key={subcategory.slug}
                                            href={`/product-category/${subcategory.slug}`}
                                            onClick={() => setOpenMenu(null)}
                                            className="rounded-lg px-2.5 py-2 text-sm text-foreground/85 hover:bg-primary/15 hover:text-primary"
                                          >
                                            {subcategory.name}
                                          </Link>
                                        ))}
                                      </nav>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </nav>
                        ) : (
                          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                            {brands
                              .filter((b) => (b.count ?? 0) > 0)
                              .map((b) => (
                                <Link
                                  key={b.slug}
                                  href={`/brand/${b.slug}`}
                                  onClick={() => setOpenMenu(null)}
                                  className="truncate rounded-lg px-2.5 py-2 text-sm text-foreground/85 hover:bg-primary/15 hover:text-primary"
                                >
                                  {b.name}
                                </Link>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={cls(item.href)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 justify-self-end lg:flex">
            <div className="w-44 xl:w-64">
              <SearchBox />
            </div>
            <EnquiryCartBadge />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <EnquiryCartBadge />
            <button
              type="button"
              aria-label="Toggle menu"
              className="btn btn-secondary size-10 min-h-0 p-0"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border py-4 lg:hidden">
            <SearchBox />
            <nav className="mt-3 grid gap-1">
              {mainNav.map((item) =>
                item.label === "Categories" ? (
                  <div key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 rounded-lg px-3 py-3 text-sm font-extrabold uppercase tracking-wide hover:bg-foreground/10"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label="Toggle category menu"
                        aria-expanded={mobileCategoriesOpen}
                        onClick={() => setMobileCategoriesOpen((open) => !open)}
                        className="rounded-lg p-3 hover:bg-foreground/10"
                      >
                        <ChevronDown
                          className={`size-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {mobileCategoriesOpen && (
                      <div className="ml-3 grid gap-1 border-l border-border pl-3">
                        {topLevelCategories.map((category) => {
                          const subcategories = subcategoriesFor(category.databaseId);
                          return (
                            <div key={category.slug}>
                              <div className="flex items-center">
                                <Link
                                  href={`/product-category/${category.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-foreground/10"
                                >
                                  {category.name}
                                </Link>
                                {subcategories.length > 0 && (
                                  <button
                                    type="button"
                                    aria-label={`Toggle ${category.name} subcategories`}
                                    aria-expanded={mobileCategoryId === category.databaseId}
                                    onClick={() =>
                                      setMobileCategoryId((current) =>
                                        current === category.databaseId ? null : category.databaseId,
                                      )
                                    }
                                    className="rounded-lg p-2 hover:bg-foreground/10"
                                  >
                                    <ChevronDown
                                      className={`size-4 transition-transform ${
                                        mobileCategoryId === category.databaseId ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>
                              {mobileCategoryId === category.databaseId && (
                                <div className="ml-4 grid gap-1 border-l border-border pl-3">
                                  {subcategories.map((subcategory) => (
                                    <Link
                                      key={subcategory.slug}
                                      href={`/product-category/${subcategory.slug}`}
                                      onClick={() => setMobileOpen(false)}
                                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-extrabold uppercase tracking-wide hover:bg-foreground/10"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
