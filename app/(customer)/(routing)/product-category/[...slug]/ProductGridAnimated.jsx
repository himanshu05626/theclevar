"use client";

import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";
import SwipeableDrawer from "@/app/admin/UI/common/SwipeableDrawer";
import { useEffect, useState } from "react";
import ProgressiveImage from "../../shop/ProgressiveImage";
import { StarIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/app/context/CartContext";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const Content = ({ selectedProduct, handleAddToCart, setSelectedSize, selectedSize, setLoading, loading, qty, setQty }) => (
  <div className="space-y-6 p-5">

    <div className="flex gap-4">
 
      <ProgressiveImage
        image={selectedProduct?.image[0]}
        alt={selectedProduct?.name}
        className=" w-20 h-20 rounded-xl object-cover border border-white/10"
      />

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">{selectedProduct?.name}</h3>
        <p className="text-gray-400 text-sm font-semibold line-clamp-2">
          {selectedProduct?.description}
        </p>

        <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-3 h-3" />
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <span className="text-white font-semibold">
            ₹{selectedProduct?.price ?? selectedProduct?.sales_price}
          </span>

          {selectedProduct?.regular_price && (
            <span className="text-xs text-white line-through">
              ₹{selectedProduct?.regular_price ?? 0}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* SIZE */}
    <div>
      <p className="text-sm mb-2 text-white">Select Size</p>

      <div className="flex gap-2 flex-wrap">
        {selectedProduct.variants?.map((v) => {
          const active = selectedSize === v.id;

          return (
            <button
              key={v.id}
              onClick={() => setSelectedSize(v.id)}
              className={`px-4 py-2 rounded-lg text-sm border transition
                  ${active
                  ? "bg-[#38bdf8] text-black border-[#38bdf8]"
                  : "border-white/10 text-gray-400 hover:border-[#38bdf8]"
                }
                `}
            >
              {v.size}
            </button>
          );
        })}
      </div>
    </div>

    {/* QTY */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => setQty((p) => Math.max(1, p - 1))}
        className="w-9 h-9 rounded-lg text-white bg-[#1f2937]"
      >
        -
      </button>

      <span className="text-white font-semibold ">{qty ?? 1}</span>

      <button
        onClick={() => setQty((p) => p + 1)}
        className="w-9 h-9 rounded-lg text-white bg-[#1f2937]"
      >
        +
      </button>
    </div>

    <button
      onClick={handleAddToCart}
      disabled={!selectedSize || loading}
      className="w-full py-3 rounded-xl bg-[#22d3ee] text-black font-semibold disabled:bg-[#22d3ee]/50 disabled:text-gray-700 transition"
    >
      {loading ? "Adding..." : "Add To Cart"}
    </button>
  </div>
);

export default function ProductGridAnimated({ preparedProducts, customerId }) {
    const { reloadCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const [isMobile, setIsMobile] = useState(false);
   const handleAddToCart = async () => {
    if (!selectedSize) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          variantId: selectedSize,
          quantity: qty,
        }),
      });

      if (!res.ok) throw new Error();

      reloadCart();
      setOpen(false);
      setSelectedSize(null);
      setQty(1);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid p-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      {preparedProducts.map((product) => (
        <motion.div
          key={product.id}
          variants={item}
          whileHover={{
            y: -6,
            transition: { duration: 0.2 },
          }}
        >
          <ProductGrid
            product={product}
            customerId={customerId}
            isMobile={isMobile}
            setIsMobile={setIsMobile}
            setOpen={setOpen}
            open={open}
            setSelectedSize={setSelectedSize}
            selectedSize={selectedSize}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            setLoading={setLoading}
            loading={loading}     qty={qty} setQty={setQty}
          />
        </motion.div>
      ))}

      {isMobile ? (
        <SwipeableDrawer height={'60vh'} open={open} onClose={() => setOpen(false)}>
          <Content selectedProduct={selectedProduct} handleAddToCart={handleAddToCart} setSelectedSize={setSelectedSize} selectedSize={selectedSize} setLoading={setLoading} loading={loading} qty={qty} setQty={setQty} />
        </SwipeableDrawer>
      ) : (
        open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#111] border border-white/10 shadow-2xl animate-[scaleIn_.2s_ease]"
            >
        <Content
  selectedProduct={selectedProduct}   // ✅ ADD THIS
  handleAddToCart={handleAddToCart}
  setSelectedSize={setSelectedSize}
  selectedSize={selectedSize}
  setLoading={setLoading}
  loading={loading}
  qty={qty}
  setQty={setQty}
/>
            </div>
          </div>
        )
      )}
    </motion.div>
  );
}