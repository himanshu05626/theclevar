"use client";

import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { addToCartAction, deleteCartItem } from "./action";
import { useState, useTransition, useCallback } from "react";

export default function BestSellingProducts({ products, customerId }) {
  const { reloadCart, cartItems } = useCart();
  const { showToast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [loadingProductId, setLoadingProductId] = useState(null);

  /* =========================
     GET CART QTY
  ========================= */
  const getCartQty = useCallback(
    (productId) => {
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        const item = cartItems.find(
          (i) => i.product_list_id === productId
        );
        return item?.quantity || 0;
      }

      if (typeof window === "undefined") return 0;
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};
      return guestCart[productId]?.quantity || 0;
    },
    [cartItems]
  );

  /* =========================
     ADD TO CART
  ========================= */
  const handleAddToCart = (product) => {
    const step = Number(product.stepper_value ?? 1);
    setLoadingProductId(product.id);

    startTransition(async () => {
      const payload = { [product.id]: step };
      const res = await addToCartAction({ customerId, quantities: payload });

      if (res?.success) {
        reloadCart();
        showToast({ type: "success", message: "Product added to cart" });
        setLoadingProductId(null);
        return;
      }

      if (res?.message === "Customer not found") {
        if (typeof window !== "undefined") {
          const existingCart =
            JSON.parse(localStorage.getItem("guest_cart")) || {};
          const updatedCart = { ...existingCart };

          if (updatedCart[product.id]) {
            updatedCart[product.id].quantity += step;
          } else {
            updatedCart[product.id] = {
              product_id: product.id,
              product_list_id: product.id,
              name: product.name,
              price: Number(product.regular_price ?? 0),
              image: product.images?.[0]?.image_url,
              stepper_value: product.stepper_value,
              quantity: step,
            };
          }

          localStorage.setItem(
            "guest_cart",
            JSON.stringify(updatedCart)
          );
        }

        reloadCart();
        showToast({ type: "success", message: "Saved to cart." });
        setLoadingProductId(null);
        return;
      }

      showToast({
        type: "error",
        message: res?.message || "Something went wrong",
      });
      setLoadingProductId(null);
    });
  };

  /* =========================
     REMOVE FROM CART
  ========================= */
  const handleRemoveFromCart = (product) => {
    startTransition(async () => {
      if (customerId) {
        const cartItem = cartItems?.find(
          (i) => i.product_list_id === product.id
        );
        if (!cartItem) return;

        const fd = new FormData();
        fd.append("cartId", cartItem.id);
        await deleteCartItem(null, fd);
      } else {
        const cart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};
        delete cart[product.id];
        localStorage.setItem("guest_cart", JSON.stringify(cart));
      }

      reloadCart();
      showToast({ type: "success", message: "Removed from cart" });
    });
  };

  return (
    <section className="bg-[#0f0f0f] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 sm:mb-10 text-center text-2xl sm:text-3xl font-extrabold text-white">
          Best Selling Products
        </h2>

        {/* ================= MOBILE SWIPE + DESKTOP GRID ================= */}
        <div
          className="
            flex gap-4 overflow-x-auto pb-2
            snap-x snap-mandatory scroll-smooth

            sm:grid sm:grid-cols-2 sm:overflow-visible
            lg:grid-cols-4
          "
        >
          {products.map((product, index) => {
            const qty = getCartQty(product.id);
            const isThisLoading =
              isPending && loadingProductId === product.id;

            return (
              <div
                key={product.id}
                className="
                  min-w-[75%] sm:min-w-0
                  snap-start
                  rounded-xl bg-[#1a1a1a] shadow-lg border border-white/10 
                  transition hover:shadow-2xl
                "
              >
                {/* IMAGE */}
                <Link href={`/product/${product.slug}`}>
                  <div className="relative mb-4 h-60 sm:h-72 w-full">
                    <Image
                      src={
                        product.images?.[0]?.image_url ||
                        "/images/not-found.png"
                      }
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-xl"
                      priority={index === 0}
                    />
                  </div>
                </Link>

                <div className="p-4 flex flex-col gap-3">
                  <h3 className="min-h-[48px] text-sm font-medium text-gray-300">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#38bdf8]">
                        ₹{product.regular_price}
                      </p>
                      <p className="text-xs text-gray-400">ex. GST</p>
                    </div>

                    {qty > 0 && (
                      <span className="rounded bg-[#0ea5e9]/20 px-2 py-0.5 text-xs font-medium text-[#7dd3fc]">
                        Qty {qty}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {qty > 0 && (
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="w-full rounded border border-white/10 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
                      >
                        Remove
                      </button>
                    )}

                    <button
                      disabled={isThisLoading}
                      onClick={() => handleAddToCart(product)}
                      className={`h-9 w-full rounded-md text-sm font-medium transition disabled:opacity-60 ${
                        qty > 0
                          ? "border border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#7dd3fc] hover:bg-[#0ea5e9]/20"
                          : "bg-[#0ea5e9] text-white hover:bg-[#38bdf8]"
                      }`}
                    >
                      {isThisLoading
                        ? "Adding…"
                        : qty > 0
                        ? "Add More"
                        : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}