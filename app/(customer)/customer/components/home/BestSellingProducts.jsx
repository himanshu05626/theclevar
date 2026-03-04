"use client";

import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function BestSellingProducts({ products }) {
  const { reloadCart, cartItems } = useCart();
  const { showToast } = useToast();
const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* MOBILE DETECT */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* CART QTY */
  const getCartQty = useCallback(
    (productId) => {
      if (Array.isArray(cartItems)) {
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

  /* OPEN MODAL */
const openModal = (product) => {
  setSelectedProduct(product);
  setSelectedVariant(product.variants?.[0]?.id || null);
  setSelectedSize(product.variants?.[0]?.id || null);
  setQty(1);

  setTimeout(() => setShowModal(true), 10);
};

const closeModal = () => {
  setShowModal(false);

  setTimeout(() => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQty(1);
  }, 250);
};

  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      showToast({ type: "error", message: "Select size first" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const tagStyles = {
    HOT: "bg-pink-500 text-black",
    BESTSELLER: "bg-cyan-400 text-black",
    NEW: "bg-green-400 text-black",
    LIMITED: "bg-yellow-400 text-black",
  };

  /* MODAL CONTENT */
  const Content = () => (
    <div className="space-y-5 p-4">
      <div className="flex gap-3">
        <img
          src={selectedProduct?.images?.[0]?.image_url}
          className="w-20 h-20 rounded-xl object-cover border border-white/10"
        />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">
            {selectedProduct?.name}
          </h3>

          <div className="text-yellow-400 text-xs">★★★★★</div>

          <div className="flex gap-2 mt-1">
            <span className="text-cyan-400 font-semibold">
              ₹{selectedProduct?.price}
            </span>
          </div>
        </div>
      </div>

      {/* SIZE */}
      <div className="flex flex-wrap gap-2">
        {selectedProduct?.variants?.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setSelectedSize(v.id);
              setSelectedVariant(v.id);
            }}
            className={`px-4 py-2 rounded-lg text-sm border transition
              ${
                selectedSize === v.id
                  ? "bg-cyan-400 text-black border-cyan-400"
                  : "border-white/10 text-gray-400"
              }`}
          >
            {v.size}
          </button>
        ))}
      </div>

      {/* QTY */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQty((p) => Math.max(1, p - 1))}
          className="w-9 h-9 bg-[#1f2937] rounded-lg text-white"
        >
          -
        </button>

        <span className="text-white">{qty}</span>

        <button
          onClick={() => setQty((p) => p + 1)}
          className="w-9 h-9 bg-[#1f2937] rounded-lg text-white"
        >
          +
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || loading}
        className={`w-full py-3 rounded-xl cursor-pointer font-semibold transition
          ${
            selectedSize
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
              : "bg-[#1f2937] text-gray-500"
          }`}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );

  /* PRODUCT CARD */
  const ProductCard = ({ product }) => {
    const qtyInCart = getCartQty(product.id);

    return (
      <div className="group rounded-2xl bg-[#0c0c0c] border border-white/10 overflow-hidden">

        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden">

          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images?.[0]?.image_url}
              fill
              className="object-cover md:group-hover:scale-105 transition"
              alt={product.name}
            />
          </Link>

          <div className="absolute inset-0 bg-black/30 md:group-hover:bg-black/50 transition pointer-events-none" />

          {/* TAG */}
          <span
            className={`absolute top-3 left-3 text-[10px] px-2 py-1 rounded-md font-bold z-10 ${tagStyles["BESTSELLER"]}`}
          >
            BESTSELLER
          </span>

          {/* DESKTOP BUTTON */}
          <button
            onClick={() => openModal(product)}
            className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 
            bg-cyan-400 text-black text-xs font-semibold px-4 py-2 rounded-full
            shadow-[0_0_20px_rgba(34,211,238,0.4)]
            opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            ADD TO CART
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden p-3">
          <button
            onClick={() => openModal(product)}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-semibold active:scale-95 transition"
          >
            Add to Cart
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-4 pb-4 flex flex-col gap-1">
          <span className="text-xs text-cyan-400 uppercase">
            {product.category?.name || "HOODIE"}
          </span>

          <h3 className="text-white text-sm font-semibold">
            {product.name}
          </h3>

          <div className="text-yellow-400 text-xs">
            ★★★★★ <span className="text-gray-400">(234)</span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-white font-bold">
              ₹{product.price || product.regular_price}
            </span>

            {product.regular_price && (
              <span className="text-gray-500 text-xs line-through">
                ₹{product.regular_price}
              </span>
            )}
          </div>

          {qtyInCart > 0 && (
            <span className="text-xs text-cyan-300 mt-1">
              In Cart: {qtyInCart}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
     <section className="border-b border-white/10 py-12">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-center text-2xl font-bold text-white mb-10">
      NEW ARRIVALS
        </h2>

        {/* MOBILE SWIPER */}
        <div className="md:hidden">
          <Swiper slidesPerView={1.2} spaceBetween={14} grabCursor>
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobile && selectedProduct && (
        <SwipeableDrawer open={true} onClose={closeModal}>
          <Content />
        </SwipeableDrawer>
      )}

      {/* DESKTOP MODAL */}
    {!isMobile && selectedProduct && (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
    ${showModal ? "bg-black/80 opacity-100" : "bg-black/0 opacity-0"}
    `}
  >
    <div
      className={`bg-[#111] rounded-2xl max-w-lg w-full border border-white/10
      transform transition-all duration-300
      ${
        showModal
          ? "scale-100 translate-y-0 opacity-100"
          : "scale-95 translate-y-6 opacity-0"
      }
      `}
    >
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