"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function CustomDesignSection() {
  const [selectedColor, setSelectedColor] = useState({
    name: "Onyx Black",
    hex: "#09090b",
    glowColor: "rgba(168, 85, 247, 0.4)",
  });

  const colors = [
    { name: "Onyx Black", hex: "#09090b", glowColor: "rgba(168, 85, 247, 0.3)" },
    { name: "Polar White", hex: "#f8fafc", glowColor: "rgba(255, 255, 255, 0.2)" },
    { name: "Cyan Spark", hex: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.4)" },
    { name: "Acid Lime", hex: "#84cc16", glowColor: "rgba(132, 204, 22, 0.4)" },
    { name: "Hot Fuchsia", hex: "#d946ef", glowColor: "rgba(217, 70, 239, 0.4)" },
  ];

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 
          bg-gradient-to-br from-[#030712] via-[#0b0f19] to-[#1e112a] p-8 md:p-16 shadow-2xl"
        >
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[130px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-xs tracking-widest text-cyan-400 uppercase font-semibold">
                <SparklesIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                MAKE IT YOURS
              </span>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                DESIGN YOUR<br />
                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                  OWN PIECE
                </span>
              </h2>

              <p className="text-gray-400 max-w-lg mx-auto lg:mx-0 text-sm md:text-base leading-relaxed font-light">
                Upload your unique design, select your premium garment, and fine-tune your colors. 
                We print using high-definition tech and ship directly to you. 
                Zero minimum order limit. Absolute creative freedom.
              </p>

              {/* Color Swatch Selector Widget */}
              <div className="pt-2 flex flex-col items-center lg:items-start gap-3">
                <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                  GARMENT COLOR: <span className="text-white">{selectedColor.name}</span>
                </span>
                <div className="flex gap-3">
                  {colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-8 h-8 rounded-full border transition-all duration-300 ${
                          isSelected ? "scale-110 border-white ring-2 ring-purple-500/50" : "border-white/20 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Select ${color.name}`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="activeSwatch"
                            className="absolute -inset-1 rounded-full border-2 border-cyan-400"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/custom"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    START DESIGNING
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1200ms] ease-out" />
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE DESIGN CANVAS PREVIEW */}
            <div className="lg:col-span-6 relative flex justify-center items-center mt-8 lg:mt-0">
              
              {/* Decorative behind glow that tints based on active color */}
              <div 
                className="absolute w-72 h-72 rounded-full blur-[80px] opacity-40 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: selectedColor.glowColor }}
              />

              {/* Main mockup window */}
              <div className="relative w-full max-w-[400px] rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md overflow-hidden shadow-2xl">
                {/* Mock Editor Header bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-950/85 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/70" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                    <span className="w-2 h-2 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                    clevar_canvas.png
                  </span>
                  <div className="w-8" />
                </div>

                {/* Canvas Body */}
                <div className="relative aspect-[4/3] p-4 flex justify-center items-center bg-radial from-neutral-900/40 to-neutral-950/80">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* Shirt Preview Card with shadow */}
                  <div className="relative rounded-lg overflow-hidden w-full h-full flex justify-center items-center border border-white/5 bg-neutral-950/40">
                    <img
                      src="/model/custom-shirt.jpg"
                      alt="Custom T-Shirt Preview"
                      className="w-full h-full object-cover opacity-95 transition-opacity duration-300"
                    />

                    {/* Interactive Editor overlay */}
                    <div className="absolute inset-[15%] border-2 border-dashed border-cyan-400/60 rounded-md flex flex-col items-center justify-center p-2 bg-cyan-950/10 backdrop-blur-[1px]">
                      {/* Bounding box handle points */}
                      <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-cyan-500 rounded-sm" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-cyan-500 rounded-sm" />
                      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-cyan-500 rounded-sm" />
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-cyan-500 rounded-sm" />
                      
                      {/* Rotation line */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="w-[1.5px] h-4 bg-cyan-400/80" />
                        <span className="w-2 h-2 bg-white border border-cyan-500 rounded-full" />
                      </div>

                      {/* Design text preview */}
                      <div className="text-center select-none pointer-events-none">
                        <p className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase">
                          YOUR ARTWORK
                        </p>
                        <p className="text-xs font-bold text-white tracking-wide uppercase mt-0.5">
                          CREATIVE MIND
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 - Top Left */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 md:-left-10 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg flex items-center gap-2.5 pointer-events-none select-none max-w-[150px]"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">FABRIC</p>
                  <p className="text-xs text-white font-black whitespace-nowrap">240 GSM Cotton</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Bottom Right */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -right-6 md:-right-8 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg flex items-center gap-2.5 pointer-events-none select-none max-w-[150px]"
              >
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 flex-shrink-0">
                  <svg className="w-4 h-4 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">LIMIT</p>
                  <p className="text-xs text-white font-black whitespace-nowrap">No Minimum Order</p>
                </div>
              </motion.div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}