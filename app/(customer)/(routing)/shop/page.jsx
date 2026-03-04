"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";

import {
  FunnelIcon,
  Squares2X2Icon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import ShopHeader from "./ShopHeader";

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

  const updateQuery = (key, value) => {
    router.push(
      `?${new URLSearchParams({
        ...query,
        [key]: value,
      })}`
    );
  };

  return (
    <div className="bg-[#0f0f0f] max-w-7xl mx-auto min-h-screen text-white  ">
      <ShopHeader count={products.length} />
      {/* ================= CATEGORY TABS ================= */}

      <div className="flex items-center p-2 gap-3 mb-6 overflow-x-auto">

        {["", "t-shirt", "hoodie", "oversized"].map((c) => {
          const active = query.category === c;

          return (
            <button
              key={c || "all"}
              onClick={() => updateQuery("category", c)}
              className={`px-4 py-2 text-xs rounded-full border whitespace-nowrap transition
                ${active
                  ? "bg-[#22d3ee] text-black border-[#22d3ee]"
                  : "border-white/10 text-gray-400 hover:border-[#22d3ee]/50 hover:text-white"
                }
              `}
            >
              {c || "ALL"}
            </button>
          );
        })}
      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="rounded m-2 border border-white/10 bg-[#111] p-4 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-4 flex-wrap">

            <p className="text-xs text-gray-400">
              Price Range: ₹0 - ₹3400
            </p>

            {/* TAGS */}

            <div className="flex gap-2 flex-wrap">
              {["New", "Trending", "Bestseller", "Limited", "Sale"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-full border border-white/10 text-gray-400 hover:border-[#22d3ee]/50 hover:text-white cursor-pointer"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex  items-center gap-3">

            {/* SORT */}

            <select
              value={query.sort}
              onChange={(e) => updateQuery("sort", e.target.value)}
              className="bg-[#0f0f0f] border border-white/10 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#22d3ee]"
            >
              <option value="">Featured</option>
              <option value="price_asc">Price Low → High</option>
              <option value="price_desc">Price High → Low</option>
            </select>

            {/* FILTER BUTTON */}

            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#22d3ee]/40 text-[#22d3ee] text-xs hover:bg-[#22d3ee]/10 transition"
            >
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>

            {/* GRID / LIST ICON */}

            <button className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white">
              <Squares2X2Icon className="w-4 h-4" />
            </button>

            <button className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white">
              <Bars3Icon className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* ================= GRID ================= */}

      <div className="grid p-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex justify-center mt-10 gap-2 flex-wrap">

        {[...Array(meta.totalPages || 1)].map((_, i) => {
          const active = Number(query.page) === i + 1;

          return (
            <button
              key={i}
              onClick={() =>
                updateQuery("page", i + 1)
              }
              className={`px-3 py-1.5 text-sm rounded-lg transition
                ${active
                  ? "bg-[#22d3ee] text-black"
                  : "bg-[#151515] text-gray-400 border border-white/10 hover:border-[#22d3ee]/40 hover:text-white"
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}

      </div>

      {/* ================= MOBILE FILTER ================= */}

      <SwipeableDrawer
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <FilterPanel query={query} />
      </SwipeableDrawer>

    </div>
  );
}