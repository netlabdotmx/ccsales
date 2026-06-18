"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, Category } from "@/types";

interface Brand { id: number; name: string; slug: string; }

const CONDITIONS = [
  { value: "", label: "Todos" },
  { value: "new", label: "Nuevo" },
  { value: "refurbished", label: "Seminuevo" },
  { value: "used", label: "Usado" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Más recientes" },
  { value: "name",       label: "Nombre A–Z" },
  { value: "price_asc",  label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

const PAGE_SIZE = 24;

export default function ProductsClient({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters from URL
  const q         = searchParams.get("q")         ?? "";
  const brand     = searchParams.get("brand")     ?? "";
  const condition = searchParams.get("condition") ?? "";
  const sort      = searchParams.get("sort")      ?? "newest";
  const categ     = searchParams.get("categ")     ?? "";
  const page      = Number(searchParams.get("page") ?? "1");

  const [localQ, setLocalQ] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    if (key !== "page") p.delete("page");
    router.push(`?${p.toString()}`);
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (q)         p.set("q", q);
      if (brand)     p.set("brand", brand);
      if (condition) p.set("condition", condition);
      if (sort)      p.set("sort", sort);
      if (categ)     p.set("categ", categ);
      p.set("limit", String(PAGE_SIZE));
      p.set("page",  String(page));

      const res = await fetch(`/api/products?${p}`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [q, brand, condition, sort, categ, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasActive = q || brand || condition || categ;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-brand-navy mb-1">Catálogo de productos</h1>
          <p className="text-slate-500 text-sm">
            {loading ? "Cargando..." : `${total.toLocaleString()} productos disponibles`}
          </p>
        </div>
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green bg-white"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setParam("q", localQ)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
          />
          {localQ && (
            <button onClick={() => { setLocalQ(""); setParam("q", ""); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            hasActive
              ? "border-brand-green bg-brand-green/10 text-brand-navy"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActive && <span className="w-2 h-2 rounded-full bg-brand-green" />}
        </button>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 p-5 rounded-2xl border border-slate-100 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category filter */}
            {categories.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setParam("categ", "")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      !categ ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setParam("categ", String(c.id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        categ === String(c.id) ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {c.name} {c.product_count > 0 && <span className="opacity-60">({c.product_count})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brand filter */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Marca</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setParam("brand", "")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !brand ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  Todas
                </button>
                {brands.map((b) => (
                  <button
                    key={b.slug}
                    onClick={() => setParam("brand", b.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      brand === b.slug ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition filter */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Condición</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setParam("condition", c.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      condition === c.value ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActive && (
            <button
              onClick={() => { setLocalQ(""); router.push("?"); }}
              className="mt-4 text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-2">No se encontraron productos</p>
          <p className="text-slate-400 text-sm">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setParam("page", String(page - 1))}
            disabled={page <= 1}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setParam("page", String(p))}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-brand-navy text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setParam("page", String(page + 1))}
            disabled={page >= totalPages}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
