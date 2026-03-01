"use client";

import { useState, useMemo } from "react";
import { addToCartDB, deleteCartItem } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import RelatedProduct from "./RelatedProduct";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  HeartIcon,
  TrashIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

export default function ProductDetailClient({
  product,
  isLoggedIn,
  relatedProducts,
}) {
  const { showToast } = useToast();
  const { cartItems, reloadCart } = useCart();

  const price = product.price ?? product.regular_price;
  const originalPrice = price + 200;

  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(
    product.mainImage?.[0]
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );

  const cartItem = useMemo(() => {
    if (isLoggedIn) {
      return cartItems?.find(
        (item) =>
          item.product_list_id === product.id &&
          item.is_deleted === false
      );
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};
      return guestCart[product.id] || null;
    }
  }, [cartItems, product.id, isLoggedIn]);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      if (isLoggedIn) {
        await addToCartDB({
          productId: product.id,
          variantId: selectedVariant?.id,
          qty,
        });
        await reloadCart();
      } else {
        const existingCart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};

        existingCart[product.id] = {
          product_id: product.id,
          name: product.name,
          price,
          quantity: qty,
          variant_id: selectedVariant?.id || null,
        };

        localStorage.setItem("guest_cart", JSON.stringify(existingCart));
      }

      showToast({ type: "success", message: "Added to Bag" });
    } catch {
      showToast({ type: "error", message: "Something went wrong" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async () => {
    try {
      if (isLoggedIn && cartItem) {
        await deleteCartItem({ cartItemId: cartItem.id });
        await reloadCart();
      } else {
        const existingCart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};
        delete existingCart[product.id];
        localStorage.setItem("guest_cart", JSON.stringify(existingCart));
      }

      showToast({ type: "success", message: "Removed" });
    } catch {
      showToast({ type: "error", message: "Failed" });
    }
  };

  return (
    <section className="bg-black text-white min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 lg:py-14">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

          {/* IMAGE SECTION */}
         {/* IMAGE SECTION */}
<div>

  {/* MOBILE VIEW */}
  <div className="lg:hidden">

    {/* Swiper */}
    <Swiper
      spaceBetween={12}
      onSlideChange={(swiper) =>
        setActiveImage(product.mainImage?.[swiper.activeIndex])
      }
    >
      {product.mainImage?.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img.url}
            className="w-full aspect-square object-cover rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Mobile Thumbnails */}
    <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
      {product.mainImage?.map((img, i) => (
        <img
          key={i}
          src={img.url}
          onClick={() => setActiveImage(img)}
          className={`w-16 h-16 rounded-lg cursor-pointer object-fit border transition shrink-0
          ${
            activeImage?.url === img.url
              ? "border-cyan-400"
              : "border-white/10"
          }`}
        />
      ))}
    </div>
  </div>

  {/* DESKTOP VIEW */}
  <div className="hidden lg:block">
    <img
      src={activeImage?.url}
      className="w-full aspect-square object-cover rounded-2xl"
    />

    <div className="flex gap-4 mt-5 flex-wrap">
      {product.mainImage?.map((img, i) => (
        <img
          key={i}
          src={img.url}
          onClick={() => setActiveImage(img)}
          className={`w-20 h-20 rounded-lg cursor-pointer object-fit border transition
          ${
            activeImage?.url === img.url
              ? "border-cyan-400"
              : "border-white/10 hover:border-cyan-400"
          }`}
        />
      ))}
    </div>
  </div>

</div>

          {/* DETAILS */}
          <div className="space-y-6 md:space-y-8">

            <div>
            

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
                {product.name}
              </h1>

              <p className="text-gray-400 mt-3 text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* PRICE */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400">
                ₹{price}
              </span>

              <span className="line-through text-gray-500 text-base sm:text-lg">
                ₹{originalPrice}
              </span>

              <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full">
                Save ₹200
              </span>
            </div>

            {/* SIZE SELECTOR */}
            {product.variants?.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-400 mb-3">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const isSelected =
                      selectedVariant?.id === variant.id;
                    const isOut = variant.stock_qty <= 0;

                    return (
                      <button
                        key={variant.id}
                        disabled={isOut}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border text-sm transition
                        ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                            : "border-white/10 hover:border-cyan-400"
                        }
                        ${
                          isOut
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QTY + REMOVE */}
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) =>
                  setQty(Number(e.target.value))
                }
                className="w-20 sm:w-24 h-10 sm:h-11 bg-black border border-white/10 rounded-lg text-center focus:border-cyan-400 outline-none"
              />

              {cartItem && (
                <button
                  onClick={handleRemove}
                  className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
                >
                  <TrashIcon className="w-5 h-5 text-red-400" />
                </button>
              )}
            </div>

            {/* Desktop Add to Bag */}
            <div className="hidden lg:block">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full h-14 rounded-xl flex items-center justify-center gap-3 font-semibold
                bg-cyan-500 hover:bg-cyan-400
                shadow-[0_0_30px_rgba(34,211,238,0.6)]
                transition-all duration-300 hover:scale-[1.02]"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {isAdding ? "Adding..." : "Add to Bag"}
              </button>
            </div>

            {/* Wishlist */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition">
              <HeartIcon className="w-5 h-5" />
              Add to Wishlist
            </button>

          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <RelatedProduct relatedProducts={relatedProducts} />
        </div>

      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full h-12 rounded-xl flex items-center justify-center gap-3 font-semibold
          bg-cyan-500 hover:bg-cyan-400
          shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {isAdding ? "Adding..." : "Add to Bag"}
        </button>
      </div>

    </section>
  );
}