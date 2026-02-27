"use client";

import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        variantId: selectedSize,
      }),
    });

    setOpen(false);
  };

  return (
    <>
      {/* ================= PRODUCT CARD ================= */}
      <div className="group relative rounded-2xl border border-white/10 bg-[#151515] p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]">

        {/* Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-2xl" />

        {/* IMAGE */}
        <div className="relative z-10 overflow-hidden rounded-xl">
          <img
            src={product.image}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="relative z-10 mt-3 space-y-1">
          <h3 className="text-sm font-medium text-white line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[#38bdf8] font-semibold text-sm">
            ₹{product.price}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => setOpen(true)}
          className="relative z-10 mt-3 w-full rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] py-2 text-sm font-semibold text-white transition hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
        >
          Add to Cart
        </button>
      </div>

      {/* ================= DRAWER ================= */}
      <SwipeableDrawer open={open} onClose={() => setOpen(false)}>

        <div className="space-y-5 p-2">

          {/* TITLE */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Select Size
            </h3>
            <p className="text-xs text-gray-400">
              Choose your fit before adding to cart
            </p>
          </div>

          {/* SIZE OPTIONS */}
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = selectedSize === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border
                    ${
                      active
                        ? "bg-[#38bdf8] text-black border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)] scale-105"
                        : "border-white/10 text-gray-400 hover:border-[#38bdf8]/50 hover:text-white"
                    }
                  `}
                >
                  {v.size}
                </button>
              );
            })}
          </div>

          {/* SELECTED STATE */}
          {selectedSize && (
            <p className="text-xs text-[#38bdf8]">
              Selected:{" "}
              {
                product.variants.find((v) => v.id === selectedSize)
                  ?.size
              }
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`
              w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${
                selectedSize
                  ? "bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                  : "bg-[#1f2937] text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {selectedSize ? "Add to Cart" : "Select Size First"}
          </button>

        </div>
      </SwipeableDrawer>
    </>
  );
}