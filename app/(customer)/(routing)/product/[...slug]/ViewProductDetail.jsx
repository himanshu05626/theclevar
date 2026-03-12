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
  StarIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import ProductInfoTabs from "./ProductInfoTabs";
import ServiceHighlights from "@/app/(customer)/customer/components/home/ServiceHighlights";

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
          image: product.mainImage?.[0]?.url || null,
          quantity: qty,
          variant_id: selectedVariant?.id || null,
          variant_size: selectedVariant?.size || null,
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
    <section className="bg-[#05070b] text-white min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex justify-evenly flex-wrap-reverse gap-6">
            <div className="flex flex-row md:flex-col gap-3 mt-4">
              {product.mainImage?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border
${activeImage?.url === img.url
                      ? "border-cyan-400"
                      : "border-white/10 hover:border-cyan-400"
                    }`}
                />
              ))}
            </div>
            {/* LEFT IMAGE */}
            <div className="relative">

              <span className="absolute top-4 left-4 z-10 bg-pink-500 text-xs px-3 py-1 rounded-full font-semibold">
                HOT
              </span>

              <img
                src={activeImage?.url}
                className="w-full h-120 rounded-xl object-contain"
              />

              {/* thumbnails */}


            </div>

          </div>

          {/* RIGHT DETAILS */}
          <div className="space-y-6">

            {/* product title */}
            <div>

              <p className="text-green-400 text-xs uppercase tracking-wider">
                Oversized
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                {product.name}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{product.description}</p>

              {/* rating */}
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">

                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4" />
                  ))}
                </div>

                <span className="text-cyan-400 font-semibold">4.8</span>

                <span>(234 reviews)</span>

              </div>

            </div>


            {/* PRICE */}
            <div className="flex items-center gap-4">

              <span className="text-3xl font-bold">
                ₹{price}
              </span>

              <span className="line-through text-gray-500">
                ₹{originalPrice}
              </span>

              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded">
                32% OFF
              </span>

            </div>


            {/* COLOR SELECT */}
            {/* <div>

<p className="text-gray-400 text-sm mb-2">
COLOR: SELECT
</p>

<div className="flex gap-3">

<div className="w-6 h-6 rounded-full bg-black border border-white/30 cursor-pointer"/>

<div className="w-6 h-6 rounded-full bg-blue-900 border border-white/30 cursor-pointer"/>

<div className="w-6 h-6 rounded-full bg-indigo-900 border border-white/30 cursor-pointer"/>

</div>

</div> */}
<div className="text-sm text-gray-400">
  👁 {product.views} views
</div>

            {/* SIZE */}
            {product.variants?.length > 0 && (
              <div>

                <div className="flex justify-between mb-2">

                  <p className="text-gray-400 text-sm">
                    SIZE: SELECT
                  </p>

                  <span className="text-xs text-gray-500 cursor-pointer">
                    Size Guide
                  </span>

                </div>

                <div className="flex gap-3 flex-wrap">

                  {product.variants.map((variant) => {

                    const isSelected = selectedVariant?.id === variant.id
                    const isOut = variant.stock_qty <= 0

                    return (

                      <button
                        key={variant.id}
                        disabled={isOut}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 text-sm rounded-md border transition

${isSelected
                            ? "border-cyan-400 text-cyan-400"
                            : "border-white/10 hover:border-cyan-400"}

${isOut ? "opacity-40 cursor-not-allowed" : ""}
`}
                      >

                        {variant.size}

                      </button>

                    )

                  })}

                </div>

              </div>
            )}


            {/* QTY */}
            <div className="flex items-center gap-3">

              <p className="text-sm text-gray-400">
                QTY:
              </p>

              <div className="flex items-center border border-white/10 rounded-md overflow-hidden">

                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-white/5"
                >
                  -
                </button>

                <span className="px-4">{qty}</span>

                <button
                  onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2 hover:bg-white/5"
                >
                  +
                </button>

              </div>

            </div>


            {/* BUTTONS */}
            <div className="flex gap-4 pt-2">

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 h-12 cursor-pointer rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition font-semibold"
              >
                {isAdding ? "Adding..." : "Add To Cart"}
              </button>

              {/* <button
className="flex-1 h-12 rounded-lg bg-pink-500 hover:bg-pink-600 transition font-semibold"
>
Buy Now
</button> */}

            </div>


            {/* share */}
            <p className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white transition">
              <ShareIcon className="w-4 h-4" />
              Share this product
            </p>

          </div>

        </div>
      </div>

        <ProductInfoTabs />
        <ServiceHighlights />
        {/* related */}
          <RelatedProduct relatedProducts={relatedProducts} />


    </section>
  )
}