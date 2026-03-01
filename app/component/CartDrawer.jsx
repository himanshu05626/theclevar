"use client";

import Link from "next/link";
import {
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import { clearCart } from "./actions";
import CartSummary from "./CartSummary";

/* =========================
   CART SKELETON
========================= */
function CartSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-white/10 pb-4 animate-pulse"
        >
          <div className="h-14 w-14 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-12 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */
function EmptyState({ setOpen }) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 px-4">
      <div className="relative mb-5">
        <div className="absolute inset-0 blur-2xl bg-[#0ea5e9]/20 rounded-full" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
          <ShoppingBagIcon className="w-8 h-8 text-[#38bdf8]" />
        </div>
      </div>

      <h2 className="text-white text-[16px] font-semibold mb-2">
        Your bag is empty
      </h2>

      <p className="text-gray-400 text-[13px] mb-6 max-w-[240px] leading-relaxed">
        Add your favorite products and start building your style.
      </p>

      <Link
        href="/shop"
        onClick={() => setOpen(false)}
        className="group w-full max-w-[220px]
        bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]
        py-2.5 rounded-lg text-white text-sm font-semibold
        shadow-[0_0_25px_rgba(14,165,233,0.35)]
        hover:shadow-[0_0_40px_rgba(56,189,248,0.7)]
        transition-all duration-300"
      >
        <span className="flex items-center justify-center gap-2">
          Start Shopping
          <span className="group-hover:translate-x-1 transition">→</span>
        </span>
      </Link>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function CartDrawer({ isLoggedIn }) {
  const { open, setOpen, cartItems, loading, reloadCart } = useCart();

  const isEmpty = cartItems.length === 0;
  const isInitialLoading = loading && isEmpty;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          open
            ? "bg-black/70 backdrop-blur-md opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[420px]
        bg-gradient-to-b from-[#0f0f0f] to-[#0b0b0b]
        border-l border-white/10
        shadow-[-10px_0_40px_rgba(0,0,0,0.6)]
        transition-transform duration-300 z-50
        flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-white text-lg font-semibold">
              Your Bag
            </h2>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-white/5 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 py-3 text-sm border-b border-white/10">
          <span className="text-gray-400">
            {cartItems.length} item{cartItems.length !== 1 && "s"}
          </span>

          {cartItems.length > 0 && (
            <button
              onClick={async () => {
                await clearCart();
                reloadCart();
              }}
              className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition"
            >
              <TrashIcon className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* 🔥 BODY (FLEX FIX) */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
            {/* LOGIN CTA */}
            {!isLoggedIn && (
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[#0ea5e9]/40
                bg-[#0ea5e9]/5 text-[#38bdf8]
                py-2 text-sm font-medium text-center
                hover:bg-[#0ea5e9]/10 transition"
              >
                Login to sync your cart
              </Link>
            )}

            {/* SKELETON */}
            {isInitialLoading && <CartSkeleton />}

            {/* ITEMS */}
            {!isEmpty && (
              <div
                className={`flex flex-col mt-2 gap-4 ${
                  loading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id || item.product_id}
                    item={item}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!loading && isEmpty && (
              <EmptyState setOpen={setOpen} />
            )}
          </div>

          {/* FOOTER */}
          {!isEmpty && (
            <div className="border-t border-white/10 p-4 bg-[#0b0b0b] backdrop-blur-xl">
              <CartSummary items={cartItems} loading={loading} />

              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-3 block w-full text-center rounded-lg
                bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]
                py-3 text-white text-sm font-semibold
                shadow-[0_0_25px_rgba(14,165,233,0.35)]
                hover:shadow-[0_0_40px_rgba(56,189,248,0.7)]
                transition-all duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}