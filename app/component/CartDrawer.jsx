"use client";

import Link from "next/link";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import { clearCart } from "./actions";
import CartSummary from "./CartSummary";
import Image from "next/image";

/* =========================
   CART SKELETON
========================= */
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 border-b pb-4">
          <div className="h-14 w-14 rounded bg-gray-200 animate-pulse" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function CartDrawer({ isLoggedIn }) {
  const { open, setOpen, cartItems, loading, reloadCart } = useCart();

  return (
   <>
  {/* BACKDROP */}
  {open && (
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    />
  )}

  {/* DRAWER */}
  <div
    style={{ zIndex: 999 }}
    className={`fixed right-0 top-0 h-full w-full md:w-[426px]
    bg-[#0f0f0f] border-l border-white/10
    transition-transform duration-300
    ${open ? "translate-x-0" : "translate-x-full"}`}
  >
    {/* HEADER */}
    <div className="flex items-center justify-between border-b border-white/10 p-3">
      <h2 className="text-lg font-semibold text-white">Bag</h2>

      <button
        onClick={() => setOpen(false)}
        className="cursor-pointer p-2 rounded-full transition hover:bg-white/5"
      >
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>

    {/* TOP BAR */}
    <div className="flex w-full justify-between p-3 items-center text-sm">
      <div className="text-gray-300">Items: {cartItems.length}</div>

      <button
        onClick={async () => {
          await clearCart();
          reloadCart();
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/10
        text-gray-300 hover:bg-white/5 transition"
      >
        <TrashIcon className="h-4 w-4 text-gray-400" />
        Remove All
      </button>
    </div>

    {/* BODY */}
    <div className="flex h-[calc(100%-350px)] flex-col gap-3 overflow-y-auto p-4 pt-0">
      {/* LOGIN CTA */}
      {!isLoggedIn && (
        <Link
          onClick={() => setOpen(false)}
          href="/auth/login"
          className="block w-full text-center rounded border border-[#0ea5e9]
          py-2 text-sm font-medium text-[#38bdf8] hover:bg-[#0ea5e9]/10"
        >
          Login / Signup
        </Link>
      )}

      {/* EMPTY CART */}
      {cartItems.length === 0 && (
        <div className="flex flex-col items-center text-center px-6 py-8">
          <Image
            src="/images/page/cart/add-to-basket.png"
            alt="Empty Cart"
            width={180}
            height={180}
            className="mb-6 opacity-80"
            priority
          />

          <h2 className="text-[16px] font-semibold text-white mb-2">
            Your Shopping Bag is Empty
          </h2>

          <p className="text-[13px] text-gray-400 mb-6">
            This feels too light! Go on, add all your favourites
          </p>

          <Link
            href="/quick-order"
            onClick={() => setOpen(false)}
            className="w-full max-w-[240px] rounded-md bg-[#0ea5e9]
            py-2.5 text-[14px] font-semibold text-white
            hover:bg-[#38bdf8] transition shadow-[0_0_20px_rgba(14,165,233,0.35)]"
          >
            Start Adding
          </Link>
        </div>
      )}

      {/* CART ITEMS */}
      {cartItems.map((item) => (
        <CartItem
          key={item.id || item.product_id}
          item={item}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>

    {/* FOOTER */}
    {cartItems.length > 0 && (
      <div className="border-t border-white/10 p-4 space-y-3 bg-[#111827]">
        <CartSummary items={cartItems} loading={loading} />

        <Link
          href="/checkout"
          onClick={() => setOpen(false)}
          className="block rounded-md bg-[#0ea5e9] py-2 text-center
          text-white text-sm font-medium hover:bg-[#38bdf8]
          shadow-[0_0_20px_rgba(14,165,233,0.35)]"
        >
          Checkout
        </Link>
      </div>
    )}
  </div>
</>

  );
}
