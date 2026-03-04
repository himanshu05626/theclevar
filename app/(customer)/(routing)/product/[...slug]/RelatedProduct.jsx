"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { StarIcon } from "@heroicons/react/24/solid";

export default function RelatedProduct({ relatedProducts = [] }) {
  const swiperRef = useRef(null);

  if (!relatedProducts.length) return null;

  return (
        <section className="border-t border-b border-white/10 py-12">

      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">

          <h2 className="text-3xl font-extrabold tracking-widest text-white">
            YOU MIGHT ALSO LIKE
          </h2>

          {/* Desktop Navigation */}
          {relatedProducts.length > 4 && (
            <div className="hidden lg:flex gap-3">

              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
              >
                ←
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
              >
                →
              </button>

            </div>
          )}

        </div>

        {/* MOBILE SWIPER */}
        <div className="lg:hidden">

          <Swiper
            spaceBetween={16}
            slidesPerView={1.2}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >

            {relatedProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} index={index} />
              </SwiperSlide>
            ))}

          </Swiper>

        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid gap-6 grid-cols-4">

          {relatedProducts.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}

        </div>

      </div>
    </section>
  );
}

/* PRODUCT CARD */

function ProductCard({ product, index }) {
  return (
    <div
      className="
      group
      rounded-2xl
      bg-[#0b0b0b]
      border border-white/10
      overflow-hidden
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]
    "
    >

      {/* IMAGE */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden">

          <Image
            src={
              product.images?.[0]?.image_url ||
              "/images/not-found.png"
            }
            alt={product.name}
            fill
            priority={index === 0}
            className="object-cover transition duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />

          <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md bg-cyan-400 text-black">
            BESTSELLER
          </span>

        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 space-y-2">

        <p className="text-[10px] uppercase tracking-widest text-cyan-400">
          {product.category?.name || "OVERSIZED"}
        </p>

        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-4 h-4" />
          ))}
          <span className="text-gray-400 ml-1">(52)</span>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-white font-bold text-sm">
            ₹{product.price || product.regular_price}
          </span>

          {product.sale_price && (
            <span className="text-gray-500 text-xs line-through">
              ₹{product.sale_price}
            </span>
          )}

        </div>

      </div>
    </div>
  );
}