"use client";

import { useMemo } from "react";

export default function CheckoutTotal({ cartData = [] }) {

  const { subtotal, shipping, total } = useMemo(() => {

    const subtotal = cartData.reduce((sum, item) => {
      return sum + item.product.price * (item.quantity || 1);
    }, 0);

    const shipping = 0;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };

  }, [cartData]);

  return (
    <div className="lg:sticky lg:top-24">

      <div className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-lg">

        {/* TITLE */}
        <h3 className="text-lg font-semibold text-white mb-6">
          PRICE DETAILS
        </h3>

        {/* SUBTOTAL */}
        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span>Subtotal ({cartData.length} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        {/* SHIPPING */}
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>Shipping</span>
          <span className="text-green-400">
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-white/10 pt-4 mb-4" />

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold text-white">
          <span>TOTAL</span>
          <span className="text-cyan-400">
            ₹{total.toFixed(2)}
          </span>
        </div>

        {/* SECURE MESSAGE */}
        <div className="mt-6 bg-green-900/30 border border-green-600/30 rounded-lg p-3 flex items-center gap-2 text-xs text-green-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>

          Safe and secure payments. 100% authentic products.
        </div>

      </div>
    </div>
  );
}