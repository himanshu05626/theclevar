"use client";

import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useTransition, useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { updateCartQty, deleteCartItem } from "./actions";
import { useToast } from "../admin/context/ToastProvider";

export default function CartItem({ item, isLoggedIn }) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const { reloadCart } = useCart();

  const stepper =
    Number(item.product?.stepper_value || item.stepper_value) || 1;

  const qty = Number(item.quantity);
  const price = Number(item.product?.price ?? item.price ?? 0);

  const [localQty, setLocalQty] = useState(qty);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalQty(qty);
  }, [qty]);

  const syncQtyToServer = (newQty) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (isLoggedIn) {
        const fd = new FormData();
        fd.append("cartId", item.id);
        fd.append("quantity", newQty);

        startTransition(async () => {
          const res = await updateCartQty(null, fd);
          if (res?.error) {
            showToast({ type: "error", message: res.error });
          }
          reloadCart();
        });
      } else {
        const cart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};
        if (!cart[item.product_id]) return;

        cart[item.product_id].quantity = newQty;
        localStorage.setItem("guest_cart", JSON.stringify(cart));
        reloadCart();
      }
    }, 400);
  };

  const increaseQty = () => {
    const newQty = localQty + stepper;
    setLocalQty(newQty);
    syncQtyToServer(newQty);
  };

  const decreaseQty = () => {
    const newQty = localQty - stepper;
    if (newQty < 1) return;
    setLocalQty(newQty);
    syncQtyToServer(newQty);
  };

  const removeItem = () => {
    if (isLoggedIn) {
      const fd = new FormData();
      fd.append("cartId", item.id);

      startTransition(async () => {
        await deleteCartItem(null, fd);
        reloadCart();
      });
    } else {
      const cart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};
      delete cart[item.product_id];
      localStorage.setItem("guest_cart", JSON.stringify(cart));
      reloadCart();
    }
  };

  return (
    <div
      className="group flex gap-4 p-2 md:p-4 rounded-xl
      bg-[#141414] border border-white/10
      hover:border-[#0ea5e9]/40
      transition-all duration-300"
    >
      {/* IMAGE */}
      <img
        src={
          item.image ||
          item.product?.images?.[0]?.image_url ||
          "/images/not-found.png"
        }
        alt=""
        className="h-16 w-16 rounded-lg object-cover bg-[#1a1a1a]"
      />

      {/* CONTENT */}
      <div className=" flex ">
        {/* NAME */}
        <div className="flex-col justify-between">
          <p className="text-sm font-medium text-white leading-snug line-clamp-2">
            {item.name || item.product?.name}
          </p>

          {/* META ROW */}
          <div className="flex items-center justify-between mt-1">
            {/* SIZE */}
            {item.variant?.size && (
              <span className="text-xs text-gray-400">
                Size:{" "}
                <span className="text-gray-200">
                  {item.variant.size}
                </span>
              </span>
            )}

          </div>
          <div> 

            {/* UNIT PRICE */}
            <span className="text-xs text-gray-400">
              ₹{price.toFixed(2)} / item
            </span>
          </div>
        </div>

        {/* ACTION ROW */}
        <div className="flex items-center flex-col justify-between ">
          {/* QTY */}
<div
            className="flex mt-2 items-center rounded-lg overflow-hidden
            bg-[#0f0f0f] border border-white/10"
          >
            <button
              onClick={decreaseQty}
              className="px-2 py-1 hover:bg-white/10 transition active:scale-90"
            >
              <MinusIcon className="w-4 h-4 text-gray-300" />
            </button>

            <span className="px-3 text-sm text-white font-medium">
              {localQty}
            </span>

            <button
              onClick={increaseQty}
              className="px-2 py-1 hover:bg-white/10 transition active:scale-90"
            >
              <PlusIcon className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* TOTAL */}
          <div className="text-right flex items-center gap-3">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-semibold text-[#38bdf8]">
              ₹{(price * localQty).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* REMOVE */}
      <button
        onClick={removeItem}
        className="opacity-0 opacity-100 transition"
      >
        <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-400" />
      </button>
    </div>
  );
}