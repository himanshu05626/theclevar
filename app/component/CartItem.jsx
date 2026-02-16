"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useTransition, useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { updateCartQty, deleteCartItem } from "./actions";
import { useToast } from "../admin/context/ToastProvider";

export default function CartItem({ item, isLoggedIn }) {
  const { showToast } = useToast();
  // console.log('itemitemitem',item.product.stepper_value)
  const [pending, startTransition] = useTransition();
  const { reloadCart } = useCart();
  const stepper = Number(item.product?.stepper_value || item.stepper_value) || null;

  const isValidQty = (value) => {
    if (value < 1) return false;
    if (!stepper) return true; // no stepper → free quantity
    return value % stepper === 0;
  };

  const qty = Number(item.quantity);
  const price = Number(item.product?.price ?? item.price ?? 0);


  const [localQty, setLocalQty] = useState(qty);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalQty(qty);
  }, [qty]);

  /* =========================
     COMMIT QTY CHANGE
  ========================= */
  const commitQtyChange = (newQty) => {

    if (!isValidQty(newQty)) return;
    console.log('newQty', newQty)

    if (isLoggedIn) {
      const fd = new FormData();
      fd.append("cartId", item.id);
      fd.append("quantity", newQty);

      startTransition(async () => {
        const res = await updateCartQty(null, fd);
        if (res?.error) {
          showToast({
            type: "error",
            message: res.error,
          });
        }
        reloadCart();
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("guest_cart")) || {};
    if (!cart[item.product_id]) return;

    cart[item.product_id].quantity = newQty;
    localStorage.setItem("guest_cart", JSON.stringify(cart));
    reloadCart();
  };


  /* =========================
     DEBOUNCED INPUT
  ========================= */
  const handleQtyChange = (value) => {
    if (value < 1) return;

    setLocalQty(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (isValidQty(value)) {
        commitQtyChange(value);
      }
    }, 500);
  };

  const handleQtyBlur = () => {
    if (isValidQty(localQty)) {
      commitQtyChange(localQty);
      return;
    }

    const fixed = stepper
      ? Math.ceil(localQty / stepper) * stepper
      : 1;

    setLocalQty(fixed);
    commitQtyChange(fixed);
  };

  /* =========================
     REMOVE ITEM
  ========================= */
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
    <div className="border-b border-white/10 py-4 flex gap-4">
      {/* IMAGE */}
      <img
        src={
          item.image ||
          item.product?.images?.[0]?.image_url ||
          "/images/not-found.png"
        }
        alt=""
        className="h-14 w-14 rounded-lg object-cover bg-[#1a1a1a] p-1"
      />

      {/* CONTENT */}
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug text-gray-200">
          {item.name || item.product?.name}
        </p>

        <div className="mt-1 flex items-center gap-2 text-sm">
          <input
            type="number"
            min={stepper || 1}
            step={stepper || 1}
            value={localQty}
            onChange={(e) => handleQtyChange(Number(e.target.value))}
            onBlur={handleQtyBlur}
            disabled={pending}
            className="w-14 rounded-md border border-white/10 text-center text-sm py-1 bg-[#1a1a1a] text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
          />

          <span className="text-gray-500">×</span>

          <span className="text-gray-300">
            ₹{price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-between">
        <button onClick={removeItem} disabled={pending}>
          <TrashIcon className="h-4 w-4 text-gray-500 hover:text-red-400 cursor-pointer transition" />
        </button>

        <div className="text-right">
          <p className="text-xs text-gray-500">Item Total</p>

          <p className="text-md font-semibold text-[#38bdf8]">
            ₹{(price * localQty).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

}
