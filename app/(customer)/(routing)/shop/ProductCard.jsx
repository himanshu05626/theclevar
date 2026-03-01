"use client";

import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const { reloadCart } = useCart();

  /* ================= MOBILE DETECT ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!selectedSize) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedSize,
          quantity: qty,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      reloadCart();
      setOpen(false);
      setSelectedSize(null);
      setQty(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONTENT (REUSABLE) ================= */
  const Content = () => (
    <div className="space-y-5 p-4">

      {/* PRODUCT */}
      <div className="flex gap-3">
        <img
          src={product.image}
          className="w-20 h-20 rounded-xl object-cover border border-white/10"
        />

        <div className="flex-1">
           <h3 className="text-sm font-semibold text-white line-clamp-1">
          {product.name}
        </h3>

          <p className="text-xs text-gray-400 line-clamp-2">
            {product.description || "Premium quality product"}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#38bdf8] font-semibold text-sm">
              ₹{product.price}
            </span>

            {product.regular_price && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.regular_price}
                </span>

                <span className="text-xs text-green-400">
                  {Math.round(
                    ((product.regular_price - product.price) /
                      product.regular_price) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SIZE */}
      <div>
        <h4 className="text-sm font-medium text-white mb-2">
          Select Size
        </h4>

        <div className="flex flex-wrap gap-2">
          {product.variants?.map((v) => {
            const active = selectedSize === v.id;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all duration-300
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
      </div>

      {/* QTY */}
      <div>
        <h4 className="text-sm font-medium text-white mb-2">
          Quantity
        </h4>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="w-9 h-9 rounded-lg bg-[#1f2937] text-white text-lg"
          >
            -
          </button>

          <span className="text-white font-semibold">{qty}</span>

          <button
            onClick={() => setQty((prev) => prev + 1)}
            className="w-9 h-9 rounded-lg bg-[#1f2937] text-white text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || loading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
          ${
            selectedSize
              ? "bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]"
              : "bg-[#1f2937] text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {loading
          ? "Adding..."
          : selectedSize
          ? "Add to Cart"
          : "Select Size First"}
      </button>
    </div>
  );

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="group relative rounded-2xl border border-white/10 bg-[#151515] p-3">
        <Link href={`/product/${product.slug}`}>
          <div>
            <img src={product.image} className="h-44 w-full rounded-xl object-cover" />

            <div className="mt-3">
           <h3 className="text-sm font-semibold text-white line-clamp-1">
          {product.name}
        </h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {product.description || "Premium quality product"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#38bdf8] font-semibold text-sm">
                  ₹{product.price}
                </span>

                {product.regular_price && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{product.regular_price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

       <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="relative z-10 mt-3 w-full rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] py-2 text-sm font-semibold text-white transition hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-95"
        >
          Add to Cart
        </button>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile ? (
        <SwipeableDrawer open={open} onClose={() => setOpen(false)}>
          <Content />
        </SwipeableDrawer>
      ) : (
        /* ================= DESKTOP MODAL ================= */
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-[#111] border border-white/10 shadow-2xl">
              <Content />
            </div>
          </div>
        )
      )}
    </>
  );
}