"use client";

import Image from "next/image";
import Link from "next/link";

export default function RelatedProduct({ relatedProducts = [] }) {
  if (!relatedProducts.length) return null;

  return (
    <section className="bg-[#0f0f0f] py-14">
      <div className="mx-auto max-w-7xl px-6">

        {/* TITLE */}
        <h2 className="
          mb-10 text-center text-3xl font-extrabold
          text-white tracking-wide
        ">
          Related Products
        </h2>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product, index) => (
            <div
              key={product.id}
              className="
                rounded-xl
                bg-[#1a1a1a]
                border border-white/10
                shadow-[0_4px_30px_rgba(0,0,0,0.6)]
                transition-all duration-300
                hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]
                hover:-translate-y-1
              "
            >
              {/* IMAGE */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-72 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={
                      product.images?.[0]?.image_url ||
                      "/images/not-found.png"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    priority={index === 0}
                  />
                </div>
              </Link>

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-3">

                {/* NAME */}
                <h3 className="
                  min-h-[48px]
                  text-sm font-medium
                  text-[#d1d5db]
                ">
                  {product.name}
                </h3>

                {/* PRICE */}
                <div>
                  <p className="
                    text-lg font-bold
                    text-white
                  ">
                    ₹{product.regular_price}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    incl. GST
                  </p>
                </div>

                {/* BUTTON */}
                <Link
                  href={`/product/${product.slug}`}
                  className="
                    h-10 w-full flex items-center justify-center
                    rounded-lg
                    bg-[#0ea5e9]
                    text-sm font-semibold text-white
                    transition-all duration-200

                    shadow-[0_0_15px_rgba(14,165,233,0.35)]

                    hover:bg-[#38bdf8]
                    hover:scale-[1.02]
                  "
                >
                  View Product
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}