"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { addToCartDB, deleteCartItem } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";

import RelatedProduct from "./RelatedProduct";
import ProductInfoTabs from "./ProductInfoTabs";
import ServiceHighlights from "@/app/(customer)/customer/components/home/ServiceHighlights";

import {
  StarIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import Zoom from "react-medium-image-zoom";
import { EyeIcon } from "@heroicons/react/24/outline";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ProgressiveImage from "@/app/(customer)/customer/components/NEW/ProgressiveImage";
export default function ProductDetailClient({
  product,
  isLoggedIn,
  relatedProducts,
}) {
console.log('product',product)
  const { showToast } = useToast();
  const { cartItems, reloadCart } = useCart();

  const price = product.price ?? product.regular_price ?? 0;
  const originalPrice = price + 200;

  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const images = product?.mainImage || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  const [cartItem, setCartItem] = useState(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  // sync swipe with selected thumbnail
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = (index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  // SAFE CART ITEM CHECK
  useEffect(() => {

    if (isLoggedIn) {

      const item = cartItems?.find(
        (item) =>
          item.product_list_id === product.id &&
          item.is_deleted === false
      );

      setCartItem(item || null);

    } else {

      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};

      setCartItem(guestCart[product.id] || null);
    }

  }, [cartItems, product.id, isLoggedIn]);


  // ADD TO CART
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
          image:
            activeImage?.variants?.v240 ||
            activeImage?.url ||
            null,
          quantity: qty,
          variant_id: selectedVariant?.id || null,
          variant_size: selectedVariant?.size || null,
        };

        localStorage.setItem(
          "guest_cart",
          JSON.stringify(existingCart)
        );

      }

      showToast({
        type: "success",
        message: "Added to Bag",
      });

    } catch {

      showToast({
        type: "error",
        message: "Something went wrong",
      });

    } finally {

      setIsAdding(false);

    }
  };


  // REMOVE FROM CART
  const handleRemove = async () => {

    try {

      if (isLoggedIn && cartItem) {

        await deleteCartItem({
          cartItemId: cartItem.id,
        });

        await reloadCart();

      } else {

        const existingCart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};

        delete existingCart[product.id];

        localStorage.setItem(
          "guest_cart",
          JSON.stringify(existingCart)
        );

      }

      showToast({
        type: "success",
        message: "Removed",
      });

    } catch {

      showToast({
        type: "error",
        message: "Failed",
      });

    }
  };



  return (

    <section className="bg-[#05070b] text-white min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* LEFT IMAGE AREA */}
          <div className="flex justify-evenly flex-wrap-reverse gap-6">

            {/* THUMBNAILS */}
            <div className="flex flex-row md:flex-col gap-3 mt-4">

              {images.map((img, i) => {

                const thumb =
                  img?.variants?.v64 || img?.url;

                return (

                  <img
                    key={i}
                    src={thumb}
                    onClick={() => scrollTo(i)}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border
                    ${activeIndex === i
                        ? "border-cyan-400"
                        : "border-white/10 hover:border-cyan-400"
                      }`}
                  />

                );

              })}

            </div>


            {/* MAIN IMAGE SLIDER */}
            <div className="relative overflow-hidden w-full max-w-[500px]">

              <span className="absolute top-4 left-4 z-10 bg-pink-500 text-xs px-3 py-1 rounded-full font-semibold">
                HOT
              </span>

              <div className="overflow-hidden" ref={emblaRef}>

                <div className="flex">

                  {images.map((img, i) => {

                    const main =
                      img?.variants?.v720 ||
                      img?.variants?.v1080 ||
                      img?.url;

                    return (

                      <div
                        className="min-w-full flex justify-center"
                        key={i}
                      >
                        <TransformWrapper
                          wheel={{ step: 0.05 }}
                          pinch={{ step: 5 }}
                          minScale={1}
                          maxScale={4}
                          doubleClick={{ disabled: true }}
                          panning={{ disabled: true }}
                          onZoom={(ref) => {
                            const scale = ref.state.scale

                            ref.setTransform(
                              ref.state.positionX,
                              ref.state.positionY,
                              scale
                            )

                            if (scale > 1) {
                              ref.instance.setPanning(true)
                            } else {
                              ref.instance.setPanning(false)
                            }
                          }}
                        >
                          <TransformComponent wrapperClass="!overflow-visible">
                          <ProgressiveImage
  image={img}
  alt={product.name}
  className=" w-full h-[500px] rounded-xl"
/>
                          </TransformComponent>
                        </TransformWrapper>
                      </div>

                    );

                  })}

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT DETAILS */}
          <div className="space-y-6">

            <div>

              <p className="text-green-400 text-xs uppercase tracking-wider">
                Oversized
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                {product.name}
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">

                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4" />
                  ))}
                </div>

                <span className="text-cyan-400 font-semibold">
                  4.8
                </span>

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


            <div className="flex items-center gap-1 text-sm text-gray-400">
              <EyeIcon className="w-4 h-4" />
              <span>{product.views} views</span>
            </div>



            {/* SIZE */}
            {product?.variants?.length > 0 && (

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

                    const isSelected =
                      selectedVariant?.id === variant.id;

                    const isOut =
                      variant.stock_qty <= 0;

                    return (

                      <button
                        key={variant.id}
                        disabled={isOut}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 text-sm rounded-md border transition
                          ${isSelected
                            ? "border-cyan-400 text-cyan-400"
                            : "border-white/10 hover:border-cyan-400"
                          }
                          ${isOut
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


            {/* QTY */}
            <div className="flex items-center gap-3">

              <p className="text-sm text-gray-400">
                QTY:
              </p>

              <div className="flex items-center border border-white/10 rounded-md overflow-hidden">

                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                  className="px-3 py-2 hover:bg-white/5"
                >
                  -
                </button>

                <span className="px-4">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty((q) => q + 1)
                  }
                  className="px-3 py-2 hover:bg-white/5"
                >
                  +
                </button>

              </div>

            </div>


            {/* BUTTON */}
            <div className="flex gap-4 pt-2">

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 h-12 cursor-pointer rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition font-semibold"
              >
                {isAdding
                  ? "Adding..."
                  : "Add To Cart"}
              </button>

            </div>


            <p className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white transition">

              <ShareIcon className="w-4 h-4" />

              Share this product

            </p>

          </div>

        </div>

      </div>

      <ProductInfoTabs />

      <ServiceHighlights />

      <RelatedProduct relatedProducts={relatedProducts} />

    </section>

  );

}