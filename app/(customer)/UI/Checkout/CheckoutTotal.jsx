"use client";

import { useMemo, useRef, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/app/admin/context/ToastProvider";

const GST_RATE = 0.1;
const FREE_SHIPPING_THRESHOLD = 250;
const SHIPPING_COST = 25;

/* Razorpay loader */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutTotal({ cartData = [] }) {
  const { showToast } = useToast();

  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [poNumber, setPoNumber] = useState("");
  const [poLoading, setPoLoading] = useState(false);
  const [rzpLoading, setRzpLoading] = useState(false);

  const localOrderIdRef = useRef(null);

  const { subTotal, gstAmount, shippingFee, totalPrice } = useMemo(() => {
    const subTotal = cartData.reduce((sum, item) => {
      const price =
        item.product.price ?? item.product.regular_price;
      return sum + price * (item.quantity || 1);
    }, 0);

    const gstAmount = subTotal * GST_RATE;

    const shippingFee =
      shippingMethod === "delivery" && subTotal < FREE_SHIPPING_THRESHOLD
        ? SHIPPING_COST
        : 0;

    return {
      subTotal,
      gstAmount,
      shippingFee,
      totalPrice: subTotal + gstAmount + shippingFee,
    };
  }, [cartData, shippingMethod]);

  /* =========================
     RAZORPAY
  ========================= */
  const handleRazorpayPayment = async () => {
    if (!agreeTerms) {
      showToast({ type: "error", message: "Please agree to terms" });
      return;
    }

    const shippingAddressId = Number(localStorage.getItem("shipping_address_id"));
    const billingAddressId = Number(localStorage.getItem("billing_address_id"));

    if (
      !Number.isInteger(shippingAddressId) ||
      shippingAddressId <= 0 ||
      !Number.isInteger(billingAddressId) ||
      billingAddressId <= 0
    ) {
      showToast({
        type: "error",
        message: "Please select shipping and billing address",
      });
      return;
    }

    setRzpLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      showToast({ type: "error", message: "Razorpay SDK failed" });
      setRzpLoading(false);
      return;
    }

    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        delivery_method: shippingMethod === "delivery" ? 1 : 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast({ type: "error", message: "Failed to create order" });
      setRzpLoading(false);
      return;
    }

    localOrderIdRef.current = data.localOrderId;

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "The Clevar",
      description: "Order Payment",
      handler: async function (response) {
        await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            localOrderId: localOrderIdRef.current,
          }),
        });

        window.location.href = `/order/${localOrderIdRef.current}`;
      },
      theme: { color: "#0ea5e9" },
    };

    new window.Razorpay(options).open();
    setRzpLoading(false);
  };

  return (
    <>
      {/* CART TOTALS */}
      <div className="max-w-5xl rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-lg text-gray-200">
        <h3 className="mb-2 text-lg font-semibold text-white">Cart Totals</h3>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>₹{shippingFee.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>Sub Total</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>GST</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold mt-3">
          <span>Total Price</span>
          <span className="text-sky-400">₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="max-w-5xl rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-lg mt-4 text-gray-200">
        <h3 className="mb-2 text-lg font-semibold text-white">Payment</h3>

        <div className="space-y-2 text-sm">
          

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
            />
            Razorpay
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "po"}
              onChange={() => setPaymentMethod("po")}
            />
            Purchase Order
          </label>
        </div>

        {/* TERMS */}
        <label className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          I agree to terms & conditions
        </label>

        {/* PAYPAL */}
        {paymentMethod === "paypal" && agreeTerms && (
          <div className="mt-4">
            <PayPalButtons />
          </div>
        )}

        {/* RAZORPAY */}
        {paymentMethod === "razorpay" && (
          <button
            onClick={handleRazorpayPayment}
            disabled={!agreeTerms || rzpLoading}
            className="mt-4 w-full rounded bg-sky-500 py-3 text-white"
          >
            {rzpLoading ? "Processing..." : "Pay with Razorpay"}
          </button>
        )}

        {/* PURCHASE ORDER */}
        {paymentMethod === "po" && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Enter PO number"
              className="w-full rounded bg-[#020617] border border-white/10 px-3 py-2 text-sm"
            />

            <button
              disabled={!agreeTerms || !poNumber || poLoading}
              className="w-full rounded bg-sky-500 py-3 text-white"
            >
              {poLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
