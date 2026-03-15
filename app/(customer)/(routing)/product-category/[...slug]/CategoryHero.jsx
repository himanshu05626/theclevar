"use client";

import { motion } from "framer-motion";

export default function CategoryHero({ category, products }) {
  return (
    <div
   
      className="relative mb-8 overflow-hidden border border-white/10 bg-[#0b0b0b]"
    >
      {/* GRID BACKGROUND */}
      <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(56,189,248,.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.4) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />

      {/* SOFT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_70%)]" />

      {/* CONTENT */}
      <div className="relative py-16 text-center space-y-3">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.35em] text-sky-400 font-medium"
        >
          BROWSE THE COLLECTION
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-wide
          bg-gradient-to-r from-white via-sky-200 to-sky-400
          bg-clip-text text-transparent"
        >
          {category.name.toUpperCase()}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-gray-400"
        >
          {products.length} products found
        </motion.p>

      </div>
    </div>
  );
}