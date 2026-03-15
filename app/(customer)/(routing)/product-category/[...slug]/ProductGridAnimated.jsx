"use client";

import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";

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

export default function ProductGridAnimated({ preparedProducts, customerId }) {
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
          />
        </motion.div>
      ))}
    </motion.div>
  );
}