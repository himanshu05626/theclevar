"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";

export default function ShopPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);

  const query = {
    category: params.get("category") || "",
    size: params.get("size") || "",
    sort: params.get("sort") || "",
    page: params.get("page") || 1,
  };

  const fetchProducts = async () => {
    setLoading(true);

    const res = await fetch(
      `/api/shop/products?category=${query.category}&size=${query.size}&sort=${query.sort}&page=${query.page}`
    );

    const json = await res.json();
    setProducts(json.products);
    setMeta(json.meta);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [params.toString()]);

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen px-4 md:px-6 py-6">

      {/* ================= LAYOUT ================= */}
      <div className="flex gap-6">

        {/* ================= DESKTOP FILTER ================= */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <FilterPanel query={query} />
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="flex-1 space-y-5">

          {/* ================= TOP BAR ================= */}
          <div className="flex items-center justify-between">

            {/* MOBILE FILTER BUTTON */}
            <button
              className="md:hidden px-4 py-2 rounded-xl border border-white/10 bg-[#151515] text-sm hover:border-[#38bdf8]/40 transition"
              onClick={() => setOpenFilter(true)}
            >
              Filters
            </button>

            {/* SORT */}
            <select
              value={query.sort}
              onChange={(e) =>
                router.push(
                  `?${new URLSearchParams({
                    ...query,
                    sort: e.target.value,
                  })}`
                )
              }
              className="bg-[#151515] border border-white/10 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="">Sort</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          {/* ================= ACTIVE FILTERS ================= */}
          {(query.category || query.size) && (
            <div className="flex flex-wrap gap-2">
              {query.category && (
                <span className="px-3 py-1 text-xs rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                  {query.category}
                </span>
              )}
              {query.size && (
                <span className="px-3 py-1 text-xs rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                  Size: {query.size}
                </span>
              )}
            </div>
          )}

          {/* ================= GRID ================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {[...Array(meta.totalPages || 1)].map((_, i) => {
              const active = Number(query.page) === i + 1;

              return (
                <button
                  key={i}
                  onClick={() =>
                    router.push(
                      `?${new URLSearchParams({
                        ...query,
                        page: i + 1,
                      })}`
                    )
                  }
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition
                    ${
                      active
                        ? "bg-[#38bdf8] text-black shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                        : "bg-[#151515] text-gray-400 border border-white/10 hover:border-[#38bdf8]/40 hover:text-white"
                    }
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      <SwipeableDrawer open={openFilter} onClose={() => setOpenFilter(false)}>
        <FilterPanel query={query} />
      </SwipeableDrawer>
    </div>
  );
}