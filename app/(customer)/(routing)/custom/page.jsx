"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TshirtDesignGallery() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [prompt]);

  // Fetch Gallery
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/custom");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setGallery(data.data.reverse());
        } else setGallery([]);
      } catch {
        setGallery([]);
      }
    }
    fetchGallery();
  }, [refresh]);

  // Handle Image Upload
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setUploadedImage(base64);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset input
  }

  function removeImage() {
    setUploadedImage(null);
    setPreview(null);
  }

  // Handle Reuse / Edit from History
  async function handleReuse(item) {
    setPrompt(item.prompt || "");
    if (item.image_url) {
      setPreview(item.image_url);
      try {
        // Attempt to fetch and convert to base64 for API submission
        const res = await fetch(item.image_url);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          setUploadedImage(base64);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Could not fetch image for reuse (CORS maybe)", err);
      }
    }
  }

  // Generate
  async function handleGenerate() {
    if (!prompt && !uploadedImage) {
      setError("Please add a prompt or upload an image to begin.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl(""); // clear previous
    setImageId("");

    try {
      const res = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageBase64: uploadedImage,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to generate");

      setImageUrl(data.imageUrl);
      setImageId(data.id);
      setRefresh((r) => r + 1);
    } catch (e) {
      setError(e.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-[100dvh] bg-[#050505] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505] to-[#050505]">
        
        {/* HEADER */}
        <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 pointer-events-auto">
              Design AI
            </h1>
          </div>
        </header>

        {/* IMAGE DISPLAY / HERO AREA */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 pt-20 md:pt-24 pb-6 overflow-y-auto custom-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            {!imageUrl && !loading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center max-w-2xl px-4"
              >
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  Imagine your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                    Perfect T-Shirt
                  </span>
                </h2>
                <p className="text-neutral-400 text-lg md:text-xl font-medium">
                  Describe what you want to wear, or upload a reference logo.
                  Our AI will craft a high-quality 3D mockup instantly.
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/50 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-r-2 border-purple-500/50 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                  <SparklesIcon className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-cyan-400 font-medium animate-pulse tracking-wide">
                  Synthesizing design...
                </p>
              </motion.div>
            )}

            {imageUrl && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group w-full max-w-xl aspect-square flex flex-col items-center"
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/10 bg-neutral-900/50">
                  <img
                    src={imageUrl}
                    alt="Generated T-Shirt"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 md:pb-8">
                    <Link
                      href={`/custom/next-step/${imageId}`}
                      className="bg-white text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm md:text-base"
                    >
                      Continue with this Design
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROMPT INPUT AREA - FIXED TO BOTTOM OF FLEX COLUMN */}
        <div className="shrink-0 relative z-20 px-3 md:px-8 pb-4 md:pb-8 pt-2 md:pt-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent w-full">
          <div className="max-w-4xl mx-auto relative">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-14 left-0 right-0 flex justify-center"
              >
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-lg">
                  {error}
                </span>
              </motion.div>
            )}

            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 hover:border-white/20 focus-within:border-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-500/10 rounded-3xl p-2.5 md:p-3 shadow-2xl transition-all duration-300">
              {/* IMAGE PREVIEW */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 pt-2 pb-2 overflow-hidden"
                  >
                    <div className="relative inline-block group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-xl border border-white/20 shadow-md"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-neutral-800 border border-neutral-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-colors shadow-lg"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* INPUT ROW */}
              <div className="flex items-end gap-1.5 md:gap-2 relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-neutral-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors shrink-0 mb-0.5"
                  title="Attach Logo/Image (Max 1)"
                >
                  <PaperclipIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  ref={fileInputRef}
                  className="hidden"
                />

                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your design... (e.g., 'Cyberpunk skull')"
                  style={{ fontSize: "16px" }}
                  className="flex-1 bg-transparent border-none outline-none resize-none min-h-[44px] py-3 text-white placeholder-neutral-500 custom-scrollbar"
                  rows={1}
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="mb-0.5 p-3 shrink-0 rounded-2xl bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <SparklesIcon className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-center mt-3 text-[10px] md:text-xs text-neutral-500 font-medium pb-[env(safe-area-inset-bottom)]">
              Press{" "}
              <kbd className="font-sans px-1.5 py-0.5 bg-white/10 rounded-md border border-white/5">
                Enter
              </kbd>{" "}
              to generate. Max 1 attachment.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - HISTORY */}
      <div className="hidden md:flex w-80 bg-neutral-950/80 backdrop-blur-3xl border-l border-white/5 flex-col shadow-2xl relative z-20">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white/90 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-cyan-400" />
            Recent Designs
          </h3>
          <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-md">
            {gallery.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {gallery.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-3 opacity-50">
              <HistoryIcon className="w-8 h-8 text-neutral-500" />
              <p className="text-neutral-400 text-sm">
                Your recent creations
                <br />
                will appear here.
              </p>
            </div>
          ) : (
            gallery.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition-all shadow-md hover:shadow-cyan-500/10 cursor-pointer"
                onClick={() => handleReuse(img)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-800">
                  <img
                    src={img.image_url}
                    alt={img.prompt || "Generated design"}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-3 bg-neutral-950/90 backdrop-blur-md absolute bottom-0 left-0 right-0 border-t border-white/10 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    "{img.prompt || "Image generation"}"
                  </p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-cyan-500 hover:text-black transition-colors shadow-lg border border-white/10"
                    title="Reuse Prompt & Image"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReuse(img);
                    }}
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
      }} />
    </div>
  );
}

// ==========================================
// ICONS
// ==========================================

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4M3 5h4M19 3v4M17 5h4" />
    </svg>
  );
}

function PaperclipIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function HistoryIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}