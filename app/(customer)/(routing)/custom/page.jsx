"use client";
import React, { useState, useEffect } from "react";

export default function TshirtDesignGallery() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      setRefresh((r) => r + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070B1A] text-white px-4 py-10">

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Beyond the Threshold
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Generate premium AI T-shirt designs instantly
        </p>
      </div>

      {/* GENERATOR */}
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your design..."
            className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleGenerate}
            disabled={!prompt || loading}
            className={`px-6 py-3 rounded-xl font-semibold transition 
            ${
              loading
                ? "bg-gray-600"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 mt-4 text-center">{error}</p>
        )}
      </div>

      {/* 🔥 RECENT HISTORY (LIKE YOUR IMAGE) */}
      <div className="max-w-6xl mx-auto mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent History</h2>
          <button className="text-purple-400 text-sm hover:underline">
            VIEW ALL
          </button>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {gallery.length === 0 ? (
            <p className="text-gray-500">No designs yet</p>
          ) : (
            gallery.slice(0, 10).map((img) => (
              <div
                key={img.id}
                className="min-w-[180px] group relative rounded-2xl overflow-hidden bg-[#0f172a] border border-white/10 hover:border-purple-500 transition"
              >
                {/* IMAGE */}
                <img
                  src={img.image_url}
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-300"
                />

                {/* GLOW OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                {/* LABEL */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {img.prompt}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* OPTIONAL: FULL GRID BELOW */}
      {/* <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-xl font-semibold mb-6">All Designs</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="group bg-[#111827] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500 transition"
            >
              <img
                src={img.image_url}
                className="w-full h-56 object-cover group-hover:scale-110 transition"
              />

              <div className="p-4">
                <p className="text-sm text-gray-300 line-clamp-2">
                  {img.prompt}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(img.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}