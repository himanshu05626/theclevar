"use client";

import { useRef, useState } from "react";
import { updateCartQty, deleteCartItem } from "./actions";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-cyan-400" />
  );
}

export default function MyCart({ cartData }) {
  if (!cartData || cartData.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-4">
      {cartData.map((item) => (
        <CartRow key={item.id} item={item} />
      ))}
    </div>
  );
}

/* =========================
   CART ROW
========================= */

function CartRow({ item }) {
  const product = item.product;
  const price = item.finalPrice ?? product.sale_price;

  const [qty, setQty] = useState(item.quantity ?? 1);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const debounceRef = useRef(null);

  const syncQty = (newQty) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsSaving(true);

      const fd = new FormData();
      fd.append("cartId", item.id);
      fd.append("quantity", newQty);

      await updateCartQty(null, fd);

      setIsSaving(false);
    }, 400);
  };

  const increase = () => {
    const v = qty + 1;
    setQty(v);
    syncQty(v);
  };

  const decrease = () => {
    if (qty <= 1) return;
    const v = qty - 1;
    setQty(v);
    syncQty(v);
  };

  const removeItem = async () => {
    setIsDeleting(true);

    const fd = new FormData();
    fd.append("cartId", item.id);

    await deleteCartItem(null, fd);
  };

  return (
    <div className="relative flex gap-3 md:gap-4 sm:gap-6 rounded-xl border border-white/10 bg-[#1a1a1a] p-2 sm:p-5 hover:border-cyan-500/40 transition">

      {/* PRODUCT IMAGE */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
      >
        <Image
          src={product.images?.[0]?.image_url || "/images/not-found.png"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </Link>

      {/* CENTER INFO */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* PRODUCT NAME */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition truncate"
        >
          {product.name}
        </Link>

        {/* VARIANTS */}
        <p className="text-xs text-gray-400 mt-1">
          Size: M • Color: Blue
        </p>

        {/* QTY */}
        <div className="mt-3 flex items-center gap-3">

          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">

            <button
              onClick={decrease}
              className="px-3 py-1 text-gray-300 hover:bg-white/10"
            >
              −
            </button>

            <span className="px-4 text-sm text-white">
              {qty}
            </span>

            <button
              onClick={increase}
              className="px-3 py-1 text-gray-300 hover:bg-white/10"
            >
              +
            </button>

          </div>

          {(isSaving || isDeleting) && <Spinner />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-end justify-between">

        {/* DELETE */}
        <button
          onClick={removeItem}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <TrashIcon className="h-5 w-5" />
        </button>

        {/* PRICE */}
        <p className="text-base sm:text-lg font-semibold text-white">
          ₹{price * qty}
        </p>

      </div>

      {isDeleting && (
        <div className="absolute inset-0 bg-black/40 rounded-xl" />
      )}
    </div>
  );
}