"use client";

import Image from "next/image";
import Link from "next/link";

export default function RelatedProduct({ relatedProducts = [] }) {
  if (!relatedProducts.length) return null;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-extrabold text-black">
          Related Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product, index) => (
            <div
              key={product.id}
              className="rounded bg-white shadow-sm transition hover:shadow-md"
            >
              {/* IMAGE */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative mb-4 h-72 w-full">
                  <Image
                    src={
                      product.images?.[0]?.image_url ||
                      "/images/not-found.png"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-3">
                <h3 className="min-h-[48px] text-sm font-medium text-gray-800">
                  {product.name}
                </h3>

                <div>
                  <p className="text-lg font-bold text-[#0071ce]">
                    ${product.regular_price}
                  </p>
                  <p className="text-xs text-gray-500">ex. GST</p>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="h-9 w-full flex items-center justify-center rounded-md bg-[#00AEEF] text-sm font-medium text-white hover:bg-[#0095cc]"
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
