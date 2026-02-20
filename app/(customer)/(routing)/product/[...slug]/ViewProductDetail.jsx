"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { addToCartDB, deleteCartItem } from "./actions";
import { useToast } from "@/app/admin/context/ToastProvider";
import { useCart } from "@/app/context/CartContext";
import Highlight from "./highlight";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import RelatedProduct from "./RelatedProduct";
import {
  getUserWishlists,
  createWishlist,
  addSingleItemToWishlist,
} from "./action";
import WishlistDropdown from "./WishlistDropdown";
import KeyHighlights from "./KeyHighlights";

export default function ProductDetailClient({
  product,
  isLoggedIn,
  relatedProducts,
}) {
  console.log('product', product)
  const { showToast } = useToast();
  const { cartItems, reloadCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );

  const price = product.price ?? product.regular_price;
  const step = Number(product.stepper_value ?? 1);

  const [qty, setQty] = useState(step);
  const [draftQty, setDraftQty] = useState(step);
  const [qtyError, setQtyError] = useState("");

  const debounceRef = useRef(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [activeImage, setActiveImage] = useState(() =>
    product.mainImage?.find((img) => img.isPrimary) ||
    product.images?.[0]
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userWishlists, setUserWishlists] = useState([]);
  const wishlistBtnRef = useRef(null);

  const cartItem = useMemo(() => {
    if (isLoggedIn) {
      return cartItems?.find(
        (item) =>
          item.product_list_id === product.id &&
          item.is_deleted === false
      );
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || {};
      return guestCart[product.id] || null;
    }
  }, [cartItems, product.id, isLoggedIn]);


  useEffect(() => {
    if (cartItem?.quantity) {
      setQty(cartItem.quantity);
      setDraftQty(cartItem.quantity);
    } else {
      setQty(step);
      setDraftQty(step);
    }
  }, [cartItem, step]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadWishlists = async () => {
      const data = await getUserWishlists();
      setUserWishlists(data || []);
    };

    loadWishlists();
  }, [isLoggedIn]);

  /* =====================================================
     QTY VALIDATION
  ===================================================== */
  const validateAndSetQty = (value) => {
    const val = Number(value);

    if (!val || val === 0) {
      setQty(step);
      setDraftQty(step);
      setQtyError("");
      return;
    }

    if (val < step) {
      setQtyError(`Minimum required ${step}`);
      return;
    }

    if (val % step !== 0) {
      setQtyError(`Quantity must be in multiples of ${step}`);
      return;
    }

    setQtyError("");
    setQty(val);
    setDraftQty(val);
  };

  const handleQtyChangeDebounced = (value) => {
    setDraftQty(value);
    setQtyError("");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      validateAndSetQty(value);
    }, 400);
  };

  const handleAddToCart = async () => {
    console.log('handleAddToCart', { isLoggedIn, qty, price })
    if (isAdding || qtyError) return;
    setIsAdding(true);

    try {
      if (isLoggedIn) {
        await addToCartDB({ productId: product.id, variantId: selectedVariant?.id, qty });
        await reloadCart();

        showToast({
          type: "success",
          message: cartItem
            ? "Cart updated successfully"
            : "Product added to cart",
        });
      } else {
        const existingCart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};

        existingCart[product.id] = {
          product_id: product.id,
          name: product.name,
          price,
          image: product.mainImage,
          quantity: qty,
          variant_id: selectedVariant?.id || null,
        };

        localStorage.setItem("guest_cart", JSON.stringify(existingCart));

        showToast({
          type: "success",
          message: "Saved to cart.",
        });
      }
      await reloadCart();

    } catch {
      showToast({
        type: "error",
        message: "Failed to update cart",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveItem = async () => {
    if (isRemoving) return;
    setIsRemoving(true);

    try {
      if (isLoggedIn) {
        if (!cartItem) return;

        await deleteCartItem({ cartItemId: cartItem.id });
        await reloadCart();

        showToast({
          type: "success",
          message: "Item removed from cart",
        });
      } else {
        // Guest user → remove from localStorage
        const existingCart =
          JSON.parse(localStorage.getItem("guest_cart")) || {};

        if (existingCart[product.id]) {
          delete existingCart[product.id];
          localStorage.setItem("guest_cart", JSON.stringify(existingCart));
        }

        showToast({
          type: "success",
          message: "Item removed from cart",
        });

        await reloadCart(); // if this also handles guest cart refresh
      }
    } catch {
      showToast({
        type: "error",
        message: "Failed to remove item",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const onWishlistToggle = () => {
    setIsWishlistOpen((prev) => !prev);
  };

  const onWishlistSelect = async (wishlist, productId) => {
    try {
      const res = await addSingleItemToWishlist({
        wishlistId: wishlist.id,
        productId,
        quantity: draftQty
      });

      setIsInWishlist(true);
      setIsWishlistOpen(false);

      showToast({
        type: "success",
        message: res.message || "Added to wishlist",
      });
    } catch {
      showToast({
        type: "error",
        message: "Wishlist failed",
      });
    }
  };

  const onCreateWishlist = async (name) => {
    const newWishlist = await createWishlist({ name });
    setUserWishlists((prev) => [...prev, newWishlist]);
  };
  const highlights = [
    { label: "Product Category", value: "Topwear" },
    { label: "Product Type", value: "Oversized Tshirt" },
    { label: "Fit", value: "Oversized Fit" },
    { label: "Closure", value: "No Closure" },
    { label: "Length", value: "Regular" },
    { label: "Fabric", value: "100% Cotton" },
  ];

  return (
    <section className="mx-auto max-w-7xl  
        
  
  ">

      <div
        className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10
        rounded-2xl
        p-6
      "
      >

        {/* IMAGE */}
        <div className="flex items-center justify-center flex-col gap-2">

          <div className="relative aspect-square w-full max-w-sm rounded-xl overflow-hidden bg-[#1a1a1a]">

            <img
              src={activeImage?.url || "/images/not-found.png"}
              alt={product.name}
              className="
              w-full h-full object-cover
              transition-transform duration-500
              hover:scale-105
            "
            />
            

            {/* WISHLIST */}
            <button
              ref={wishlistBtnRef}
              onClick={onWishlistToggle}
              className="
              absolute top-3 right-3
              rounded-full p-2
              bg-black/40 backdrop-blur-md
              border border-white/10
              hover:border-[#38bdf8]
              transition
            "
            >
              {isInWishlist ? (
                <HeartSolid className="w-6 h-6 text-[#38bdf8]" />
              ) : (
                <HeartOutline className="w-6 h-6 text-gray-400" />
              )}
            </button>

          </div>
          <div className="flex gap-2 mt-1">
              {product.mainImage?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setActiveImage(img)}
                  className={`
        w-16 h-16 rounded border cursor-pointer object-cover
        ${activeImage?.url === img.url
                      ? "border-[#38bdf8]"
                      : "border-white/10"}
      `}
                />
              ))}
            </div>

        </div>
        {/* DETAILS */}
        <div className="lg:col-span-2 md:border-l md:border-white/10 md:pl-6">

          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-white">
            {product.name}
          </h1>
          <p className="text-sm text-gray-400 mt-2">{product.description}</p>

          {/* PRICE */}
          <div className="mt-4 flex items-center gap-4">

            <span className="text-3xl font-bold text-[#38bdf8]">
              ₹{price}
            </span>

            <span className="text-sm text-[#9ca3af]">
              {product.measure_unit}
            </span>
          </div>
          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm text-gray-400 mb-2">
                Select Size
              </h3>

              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant) => {
                  const isSelected =
                    selectedVariant?.id === variant.id;

                  const isOutOfStock =
                    variant.stock_qty <= 0;

                  return (
                    <button
                      key={variant.id}
                      disabled={isOutOfStock}
                      onClick={() =>
                        setSelectedVariant(variant)
                      }
                      className={`
              px-4 py-2 rounded-lg border text-sm transition

              ${isSelected
                          ? "border-[#38bdf8] bg-[#38bdf8]/20 text-[#38bdf8]"
                          : "border-white/10 text-white"
                        }

              ${isOutOfStock
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:border-[#38bdf8]"
                        }
            `}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>

            </div>
          )}


          {/* CART ACTION */}
          <div className="mt-8 max-w-md space-y-4">

            <div className="flex gap-3">

              {/* QTY */}
              <input
                type="number"
                min={step}
                step={step}
                value={draftQty}
                onChange={(e) =>
                  handleQtyChangeDebounced(e.target.value)
                }
                onBlur={(e) =>
                  validateAndSetQty(e.target.value)
                }
                className="
        h-11 w-24 rounded-xl
        border border-white/10
        bg-[#1a1a1a]
        text-center text-white text-sm
        outline-none
        transition

        focus:border-[#38bdf8]
        focus:ring-2 focus:ring-[#38bdf8]/40
      "
              />

              {/* ADD BTN */}
              <button
                onClick={handleAddToCart}
                disabled={
                  isAdding || isRemoving || !!qtyError
                }
                className={`
        flex-1 h-11 rounded-xl px-6
        text-sm font-semibold text-white
        transition-all duration-200

        shadow-[0_0_20px_rgba(14,165,233,0.35)]

        ${isAdding || qtyError
                    ? "cursor-not-allowed bg-[#0ea5e9]/40"
                    : "bg-[#0ea5e9] hover:bg-[#38bdf8] hover:scale-[1.02]"
                  }
      `}
              >
                {isAdding
                  ? "Updating..."
                  : cartItem
                    ? "Update Selection"
                    : "Add to Bag"}
              </button>

            </div>

            {/* ERROR */}
            {qtyError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                ⚠ {qtyError}
              </p>
            )}

            {/* REMOVE BTN */}
            {cartItem && (
              <button
                onClick={handleRemoveItem}
                className="
        h-11 w-full rounded-xl
        text-sm font-medium
        border border-red-500/20
        text-red-400
        hover:bg-red-500/10
        transition
      "
              >
                Remove Item
              </button>
            )}

            {/* STEPPER NOTE */}
            {step > 1 && (
              <div
                className="
        rounded-xl p-3
        bg-[#0ea5e9]/10
        border border-[#38bdf8]/20
        text-xs text-[#38bdf8]
      "
              >
                Sold in packs of <b>{step}</b> (Minimum {step})
              </div>
            )}
          </div>
        </div>
        <KeyHighlights data={highlights} />
      </div>

      {/* RELATED */}
      <div className="">
        <RelatedProduct relatedProducts={relatedProducts} />
      </div>

      {/* WISHLIST DROPDOWN */}
      {isWishlistOpen && (
        <WishlistDropdown
          anchorRef={wishlistBtnRef}
          wishlists={userWishlists}
          onSelect={(wishlist) =>
            onWishlistSelect(wishlist, product.id)
          }
          onCreate={onCreateWishlist}
          onClose={() => setIsWishlistOpen(false)}
        />
      )}

    </section>
  );

}
