"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

/* ---------------- PRODUCT IMAGE (MEMOIZED) ---------------- */

const ProductModalImage = memo(function ProductModalImage({ src }) {
  return (
    <div className="w-20 h-20 shrink-0">
      <img
        src={src}
        alt="product"
        loading="eager"
        decoding="async"
        draggable={false}
        className="w-full h-full rounded-xl object-cover border border-white/10"
      />
    </div>
  );
});

/* ---------------- PRODUCT CARD ---------------- */

const ProductCard = memo(function ProductCard({ product, openModal, qtyInCart }) {
  return (
    <div className="group flex flex-col h-full min-h-[360px] rounded-2xl bg-[#0c0c0c] border border-white/10 hover:border-cyan-400/40 overflow-hidden">

      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images?.[0]?.image_url}
            fill
            className="object-cover transition md:group-hover:scale-105"
            alt={product.name}
          />
        </Link>

        <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-md font-bold bg-cyan-400 text-black">
          BESTSELLER
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">

        <span className="text-xs text-cyan-400 uppercase">
          {product.category?.name || "HOODIE"}
        </span>

        <h3 className="text-white md:text-sm text-xl   font-semibold line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2">
          {product.description}
        </p>

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
          <span className="text-xs text-cyan-300">
            In Cart: {qtyInCart}
          </span>
        )}

        <button
          onClick={() => openModal(product)}
          className="mt-auto w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-semibold hover:opacity-90 active:scale-95 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});

/* ---------------- MAIN COMPONENT ---------------- */

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

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps"
  });

  /* MOBILE DETECT */

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* CART QTY */

  const getCartQty = useCallback((productId) => {

    if (Array.isArray(cartItems)) {
      const item = cartItems.find(i => i.product_list_id === productId);
      return item?.quantity || 0;
    }

    if (typeof window === "undefined") return 0;

    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || {};
    return guestCart[productId]?.quantity || 0;

  }, [cartItems]);

  /* OPEN MODAL */

  const openModal = (product) => {

    const img = new window.Image();
    img.src = product.images?.[0]?.image_url;

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
          quantity: qty
        })
      });

      if (!res.ok) throw new Error();

      reloadCart();

      showToast({
        type: "success",
        message: "Added to Bag"
      });

      closeModal();

    } catch {

      showToast({
        type: "error",
        message: "Something went wrong"
      });

    } finally {
      setLoading(false);
    }
  };

  /* MODAL CONTENT */

  const Content = () => (
    <div className="space-y-5 p-4">

      <div className="flex gap-3">

        <ProductModalImage
          src={selectedProduct?.images?.[0]?.image_url}
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
          onClick={() => setQty(p => Math.max(1, p - 1))}
          className="w-9 h-9 bg-[#1f2937] rounded-lg text-white"
        >
          -
        </button>

        <span className="text-white">{qty}</span>

        <button
          onClick={() => setQty(p => p + 1)}
          className="w-9 h-9 bg-[#1f2937] rounded-lg text-white"
        >
          +
        </button>

      </div>

      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || loading}
        className={`w-full py-3 rounded-xl font-semibold transition
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

  /* RENDER */

  return (

    <section className="border-b border-white/10 py-12">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-center text-2xl font-bold text-white mb-10">
          NEW ARRIVALS
        </h2>

        {/* MOBILE SLIDER */}

        <div className="md:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">

            {products.map(product => (

              <div key={product.id} className="flex-[0_0_80%]">

                <ProductCard
                  product={product}
                  openModal={openModal}
                  qtyInCart={getCartQty(product.id)}
                />

              </div>

            ))}

          </div>
        </div>

        {/* DESKTOP GRID */}

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">

          {products.map(product => (

            <ProductCard
              key={product.id}
              product={product}
              openModal={openModal}
              qtyInCart={getCartQty(product.id)}
            />

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

      {!isMobile && selectedProduct && showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">

          <div className="bg-[#111] rounded-2xl max-w-lg w-full border border-white/10">

            <div className="flex justify-between p-4 border-b border-white/10">

              <h2 className="text-white">
                {selectedProduct.name}
              </h2>

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