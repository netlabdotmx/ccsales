"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, Category } from "@/types";

interface Props {
  brandSlug: string;
  categories: Category[]; // second-level categories to filter by
}

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

export default function BrandProductsClient({ brandSlug, categories }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [categ, setCateg]       = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort]           = useState("newest");
  const [page, setPage]           = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("brand", brandSlug);
      if (categ)     p.set("categ", categ);
      if (condition) p.set("condition", condition);
      p.set("sort", sort);
      p.set("limit", String(PAGE_SIZE));
      p.set("page", String(page));

      const res = await fetch(`/api/products?${p}`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [brandSlug, categ, condition, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Reset page when filters change
  function applyCateg(val: string) { setCateg(val); setPage(1); }
  function applyCondition(val: string) { setCondition(val); setPage(1); }
  function applySort(val: string) { setSort(val); setPage(1); }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasActive = categ || condition;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-sm text-slate-500">
          {loading ? "Cargando..." : `${total.toLocaleString()} productos`}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => applySort(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green/40 bg-white"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
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
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 p-5 rounded-2xl border border-slate-100 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category filter */}
            {categories.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyCateg("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      !categ ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => applyCateg(String(c.id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        categ === String(c.id) ? "bg-brand-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Condition filter */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Condición</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => applyCondition(c.value)}
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
              onClick={() => { applyCateg(""); applyCondition(""); }}
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
        <div className="text-center py-16">
          <p className="text-slate-400">No hay productos con estos filtros.</p>
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
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = i + 1;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  pg === page ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pg}
              </button>
            );
          })}
          <button
            onClick={() => setPage(page + 1)}
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
