"use client";

import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function BestSellingProducts({ products }) {
  const { reloadCart, cartItems } = useCart();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ================= MOBILE DETECT ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= CART QTY ================= */
  const getCartQty = useCallback(
    (productId) => {
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        const item = cartItems.find(
          (i) => i.product_list_id === productId
        );
        return item?.quantity || 0;
      }

      if (typeof window === "undefined") return 0;

      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};

      return guestCart[productId]?.quantity || 0;
    },
    [cartItems]
  );

  /* ================= OPEN ================= */
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants?.[0]?.id || null);
    setSelectedSize(product.variants?.[0]?.size || null);
    setQty(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQty(1);
  };

  /* ================= ADD ================= */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      showToast({ type: "error", message: "Select size first" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          variantId: selectedVariant,
          quantity: qty,
        }),
      });

      if (!res.ok) throw new Error();

      reloadCart();
      showToast({ type: "success", message: "Added to Bag" });

      closeModal();
    } catch {
      showToast({ type: "error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONTENT ================= */
  const Content = () => (
    <div className="space-y-5 p-4">

      {/* PRODUCT */}
      <div className="flex gap-3">
        <img
          src={selectedProduct?.images?.[0]?.image_url || "/images/not-found.png"}
          className="w-20 h-20 rounded-xl object-cover border border-white/10"
        />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white line-clamp-1">
            {selectedProduct?.name}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2">
            {selectedProduct?.description || "Premium quality product"}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#38bdf8] font-semibold text-sm">
              ₹{selectedProduct?.price}
            </span>

            {selectedProduct?.regular_price && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  ₹{selectedProduct?.regular_price}
                </span>

                <span className="text-xs text-green-400">
                  {Math.round(
                    ((selectedProduct?.regular_price - selectedProduct?.price) /
                      selectedProduct?.regular_price) *
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
          {selectedProduct?.variants?.map((v) => {
            const active = selectedSize === v.id;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all duration-300
                  ${active
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
          ${selectedSize
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
    <section className="bg-[#0f0f0f] py-14">
      <div className="max-w-7xl mx-auto px-4">

  <h2 className="text-center text-2xl font-bold text-white mb-10">
    Best Selling Products
  </h2>

  {/* GRID */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">

    {products.map((product) => {
      const qtyInCart = getCartQty(product.id);

      return (
        <div
          key={product.id}
          className="
            group flex flex-col
            bg-[#151515]
            rounded-2xl
            border border-white/10
            overflow-hidden
            transition-all duration-300
            hover:border-cyan-400/40
            hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
          "
        >

          {/* IMAGE */}
          <Link
          href={`/product/${product.slug}`}
            className="relative w-full aspect-square cursor-pointer overflow-hidden"
          >
            <Image
              src={product.images?.[0]?.image_url}
              fill
              className="
                object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
              alt={product.name}
            />

            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </Link>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-4">

            {/* TITLE */}
            <h3 className="text-sm font-semibold text-white line-clamp-1">
              {product.name}
            </h3>

            {/* DESC */}
            <p className="text-xs text-gray-400 line-clamp-2 mt-1">
              {product.description || "Premium quality product"}
            </p>

            {/* PRICE */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-cyan-400">
                ₹{product.regular_price}
              </span>
            </div>

            {/* CART INFO */}
            {qtyInCart > 0 && (
              <span className="mt-1 text-xs text-cyan-300">
                In Cart: {qtyInCart}
              </span>
            )}

            {/* PUSH BUTTON TO BOTTOM */}
            <div className="mt-auto pt-4">

              <button
                onClick={() => openModal(product)}
                className="
                  w-full h-10
                  rounded-xl
                  text-sm font-semibold
                  bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]
                  text-white
                  transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]
                  active:scale-95
                "
              >
                Add to Cart
              </button>

            </div>
          </div>
        </div>
      );
    })}

  </div>
</div>

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile && selectedProduct && (
        <SwipeableDrawer open={true} onClose={closeModal}>
          <Content />
        </SwipeableDrawer>
      )}

      {/* ================= DESKTOP MODAL ================= */}
      {!isMobile && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111] max-w-lg w-full rounded-2xl border border-white/10">

            <div className="flex justify-between p-4 border-b border-white/10">
              <h2 className="text-white">{selectedProduct.name}</h2>

              <button onClick={closeModal}>
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            <Content />
          </div>
        </div>
      )}
    </section>
  );
}