"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const GST_RATE = 0.1;
const FREE_SHIPPING_THRESHOLD = 250;
const SHIPPING_COST = 15;

export default function CartTotal({ cartData = [] }) {
  const [shippingMethod, setShippingMethod] = useState("delivery");

  /* =========================
     CALCULATIONS
  ========================= */
  const {
    subTotal,
    gstAmount,
    shippingFee,
    totalPrice,
  } = useMemo(() => {
    const subTotal = cartData.reduce((sum, item) => {
      const price =
        item.product.price ?? item.product.regular_price;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0);

    const gstAmount = subTotal * GST_RATE;

    const shippingFee =
      shippingMethod === "delivery" && subTotal < FREE_SHIPPING_THRESHOLD
        ? SHIPPING_COST
        : 0;

    const totalPrice = subTotal + gstAmount + shippingFee;

    return {
      subTotal,
      gstAmount,
      shippingFee,
      totalPrice,
    };
  }, [cartData, shippingMethod]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="w-full max-w-sm rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Cart Totals</h3>

      {/* Subtotal */}
      <div className="flex justify-between text-sm text-gray-700 ">
        <span>Sub Total</span>
        <span>${subTotal.toFixed(2)}</span>
      </div>

      <hr className="my-3 border-gray-400" />

      {/* Shipping */}
      <div className="mb-3">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Shipping
        </p>

        <label className="mb-2 flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={shippingMethod === "delivery"}
            onChange={() => setShippingMethod("delivery")}
          />
          Delivery
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={shippingMethod === "pickup"}
            onChange={() => setShippingMethod("pickup")}
          />
          Pickup from store
        </label>

        <p className="mt-2 text-xs text-gray-500">
          Free Freight On Orders Over $250 Excluding GST
        </p>
      </div>

      <hr className="my-3 border-gray-400" />

      {/* Shipping Fee */}
      <div className="flex justify-between text-sm text-gray-700">
        <span>Shipping</span>
        <span>
          {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
        </span>
      </div>

      {/* GST */}
      <div className="mt-2 flex justify-between text-sm text-gray-700">
        <span>GST (estimated for Australia)</span>
        <span>${gstAmount.toFixed(2)}</span>
      </div>

      <hr className="my-4 border-dashed" />

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold">
        <span>Total Price</span>
        <span className="text-blue-600">
          ₹{totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <Link href={'/checkout'} className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-sky-500 py-3 text-sm font-medium text-white hover:bg-sky-600">
        Proceed to Checkout →
      </Link>

      <button className="mt-3 w-full rounded border border-sky-500 py-3 text-sm font-medium text-sky-500 hover:bg-sky-50">
        Request Quote
      </button>
    </div>
  );
}
