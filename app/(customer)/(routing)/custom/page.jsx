"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TshirtDesignGallery() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/custom");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setGallery(data.data.reverse()); // latest first
        } else setGallery([]);
      } catch {
        setGallery([]);
      }
    }
    fetchGallery();
  }, [refresh]);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setImageUrl(data.imageUrl);
      setImageId(data.id);
      setRefresh((r) => r + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center relative overflow-x-hidden px-2 py-8">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl text-center mb-10 relative z-10"
      >
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-cyan-400 bg-black/60 text-cyan-300 text-xs font-semibold tracking-widest shadow-cyan-400/30 shadow-lg">
          ⚡ 2026 DROP IS HERE
        </div>
       
        <p className="text-gray-300 mt-4 text-lg font-medium">
          Your design, your own. Each design is uniquely yours – only a 0.01% chance of anyone else having the same.
        </p>
      
    
      </motion.div>

      {/* GENERATOR SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-col gap-3">
          {/* Input Area */}
          <div className="flex items-end gap-3 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 \
            focus-within:ring-2 focus-within:ring-[#0ea5e9]/40 transition-all duration-200">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={1}
              placeholder="Describe your design..."
              className="flex-1 resize-none bg-transparent outline-none \
              text-gray-200 placeholder-gray-500 text-[15px] leading-relaxed max-h-[160px]"
              style={{ minHeight: "40px" }}
            />
            {/* Action Button */}
            <motion.button
              whileHover={{ scale: !prompt || loading ? 1 : 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={!prompt || loading}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${loading ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-[#0ea5e9] text-white hover:bg-[#38bdf8] shadow-[0_0_20px_rgba(14,165,233,0.35)]"}`}
            >
              {loading ? "Generating..." : "Generate"}
            </motion.button>
          </div>
          {/* Helper Row */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-500">
              Try: "Modern dashboard UI with analytics cards"
            </span>
            <span className="text-xs text-gray-600 hidden sm:block">
              AI Prompt
            </span>
          </div>
          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </div>
      </motion.div>

      {/* Show generated image if available */}
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto mt-8 flex flex-col items-center"
        >
          <img
            src={imageUrl}
            alt="Generated design"
            className="rounded-2xl border-2 border-cyan-400 shadow-cyan-400/20 shadow-lg object-cover w-full max-h-96 bg-black"
            style={{ background: '#0f0f0f' }}
          />
          <span className="mt-2 text-xs text-cyan-300">Your generated design</span>
          <Link href={`/custom/next-step/${imageId}`} className="mt-4 px-6 py-2 bg-[#0ea5e9] text-white rounded-xl font-semibold hover:bg-[#38bdf8] transition shadow-[0_0_20px_rgba(14,165,233,0.35)]">
            Next Step For Buying this design
          </Link>
        </motion.div>
      )}
    <div className="flex justify-center gap-10 mt-10 text-center">
          <div>
            <span className="text-2xl font-bold text-cyan-400">1K+</span>
            <div className="text-xs text-gray-400 mt-1">CUSTOMERS</div>
          </div>
          <div>
            <span className="text-2xl font-bold text-cyan-400">4.9★</span>
            <div className="text-xs text-gray-400 mt-1">RATING</div>
          </div>
          <div>
            <span className="text-2xl font-bold text-cyan-400">20+</span>
            <div className="text-xs text-gray-400 mt-1">DESIGNS</div>
          </div>
        </div>
      {/* RECENT HISTORY */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-5xl mx-auto mt-2"
      >
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">Recent Designs</h2>
          <button className="text-pink-400 text-sm font-semibold border-b-2 border-pink-400 hover:text-pink-300 transition">VIEW ALL</button>
        </div>
        <div
          className="flex gap-7 overflow-x-auto pb-2 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {gallery.length === 0 ? (
            <p className="text-gray-600 text-lg">No designs yet</p>
          ) : (
            gallery.slice(0, 10).map((img) => (
              <motion.div
                key={img.id}
                whileHover={{ scale: 1.04, boxShadow: "0 0 24px #00fff7" }}
                className="min-w-[200px] group relative rounded-2xl overflow-hidden bg-[#10101a] border-2 border-cyan-900/40 hover:border-cyan-400 transition shadow-cyan-400/10 shadow-lg"
              >
                <img
                  src={img.image_url}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                  alt={img.prompt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs text-cyan-200 line-clamp-2 font-medium drop-shadow-[0_2px_8px_rgba(0,255,255,0.5)]">
                    {img.prompt}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
      {/* Neon Glow BG Effect */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400 opacity-10 blur-3xl rounded-full" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-pink-400 opacity-10 blur-3xl rounded-full" />
      </div>
    </div>
  );
}