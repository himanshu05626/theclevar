"use client";

import { useRef, useState } from "react";
import { updateCartQty, deleteCartItem } from "./actions";
import Image from "next/image";

function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
  );
}

export default function MyCart({ cartData }) {
  if (!cartData || cartData.length === 0) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">My Cart</h2>

      {/* Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-300 pb-3 text-xs font-semibold uppercase text-gray-500">
        <div className="col-span-1" />
        <div className="col-span-2">Product Code</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Unit</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {cartData.map((item) => (
        <CartRow key={item.id} item={item} />
      ))}

      {/* Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <input
            placeholder="Coupon Code"
            className="rounded border border-gray-300 px-4 py-2 text-sm"
          />
          <button className="rounded border border-blue-500 px-4 py-2 text-sm text-blue-500 hover:bg-blue-50">
            Apply Coupon
          </button>
        </div>

        <button className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
          🔄 Update Cart
        </button>
      </div>
    </div>
  );
}

/* =========================
   CART ROW
========================= */
function CartRow({ item }) {
  const product = item.product;
  const price = product.price ?? product.sale_price;

  const [qty, setQty] = useState(item.quantity ?? 1);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const debounceRef = useRef(null);

  /* Quantity Sync */
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

  /* Delete Item */
  const removeItem = async () => {
    setIsDeleting(true);

    const fd = new FormData();
    fd.append("cartId", item.id);

    await deleteCartItem(null, fd);
  };

  return (
    <div className="relative grid grid-cols-12 gap-4 border-b  border-gray-200 py-5 items-center">
      {/* Remove */}
      <button
        onClick={removeItem}
        className="col-span-1 flex h-6 w-6 items-center justify-center rounded-full border border-red-400 text-red-500 hover:bg-red-50"
      >
        ✕
      </button>

      {/* SKU */}
      <div className="col-span-2 text-sm text-gray-600">
        {product.sku}
      </div>

      {/* Description */}
      <div className="col-span-4 flex gap-4">
        <Image
          src={"/images/not-found.png"}
          // src={product.images?.[0]?.image_url ?? "/images/not-found.png"}

          alt={product.name}
          // blurDataURL={product.images?.[0]?.image_url || "/images/page/productnotfound.png"}

          width={40}
          height={40}
          className="h-14 w-14 rounded bg-gray-100 object-cover"
          sizes="56px"

        />

        {/* placeholder="blur" */}
        {/* blurDataURL="/blur.png" */}
        <div>
          <p className="text-sm font-medium text-blue-700">
            {product.name}
          </p>
          <p className="text-xs text-gray-500">
            {product.short_description || product.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-sm text-gray-600">
        ₹{price} <span className="text-xs text-gray-400">ex GST</span>
      </div>

      {/* Unit */}
      <div className="col-span-1 text-sm text-gray-600">EA</div>

      {/* Qty + Total */}
      <div className="col-span-2 flex justify-end gap-4 items-center">
        <div className="relative flex items-center border rounded">
          <button
            onClick={decrease}
            disabled={qty <= 1}
            className="px-2 py-1"
          >
            −
          </button>

          <span className="px-3 text-sm min-w-[24px] text-center">
            {qty}
          </span>

          <button
            onClick={increase}
            className="px-2 py-1"
          >
            +
          </button>

          {(isSaving || isDeleting) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded">
              <Spinner />
            </div>
          )}
        </div>

        <span className="font-medium text-blue-600">
          ₹{price * qty}
        </span>
      </div>

      {/* Delete overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/60" />
      )}
    </div>
  );
}
