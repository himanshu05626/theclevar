"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function TshirtDesignGallery() {
  const [prompt, setPrompt] = useState("");
  const [views, setViews] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
    model: null,
  });
  const [selectedView, setSelectedView] = useState("front");
  const [viewLoading, setViewLoading] = useState(null);
  const [viewModal, setViewModal] = useState({ isOpen: false, viewId: null, prompt: "" });
  const [imageId, setImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const availableViews = [
    { id: 'front', label: 'Front View' },
    { id: 'back', label: 'Back View' },
    { id: 'left', label: 'Left Side' },
    { id: 'right', label: 'Right Side' },
    { id: 'model', label: 'Model View' },
  ];

  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
          // Normalize different API item shapes into a consistent format
          const normalized = data.data.map((item) => {
            const prompt = item.prompt ?? item.name ?? "";
            const image_url =
              item.image_url ??
              item.imageUrl ??
              (item.images && item.images[0] && (item.images[0].image_url || item.images[0].url_720 || item.images[0].url_1080)) ??
              "";

            return {
              id: item.id,
              prompt,
              image_url,
              raw: item,
            };
          });

          setGallery(normalized.reverse());
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
    setIsHistoryOpen(false); // Close drawer on mobile when selected
    setPrompt(item.prompt || "");
    if (item.image_url) {
      setPreview(item.image_url);
      setViews({ front: item.image_url, back: null, left: null, right: null, model: null });
      setSelectedView("front");
      setImageId(item.id || "");
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
    setViews({ front: null, back: null, left: null, right: null, model: null });
    setSelectedView("front");
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

      setViews(prev => ({ ...prev, front: data.imageUrl }));
      setImageId(data.id);
      setRefresh((r) => r + 1);
    } catch (e) {
      setError(e.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  }

  function openGenerateViewModal(viewId) {
    const defaultPrompts = {
      back: "Backside of the t-shirt, consistent with the front design",
      left: "Left side view of the t-shirt",
      right: "Right side view of the t-shirt",
      model: "A fashion model wearing this t-shirt in a high-quality studio setting",
    };
    setViewModal({
      isOpen: true,
      viewId,
      prompt: defaultPrompts[viewId] || ""
    });
  }

  async function handleGenerateAdditionalView() {
    if (!viewModal.prompt) return;

    setViewLoading(viewModal.viewId);
    setSelectedView(viewModal.viewId);
    setViewModal({ ...viewModal, isOpen: false });
    setError("");

    try {
      const res = await fetch("/api/custom", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: viewModal.prompt,
          view: viewModal.viewId,
          frontImage: views.front,
          imageId: imageId,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to generate view");

      setViews(prev => ({ ...prev, [viewModal.viewId]: data.imageUrl }));
      setRefresh((r) => r + 1);
    } catch (e) {
      setError(e.message);
      setTimeout(() => setError(""), 5000);
      setSelectedView("front");
    } finally {
      setViewLoading(null);
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
      <div className="flex-1 flex flex-col relative h-[90dvh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505] to-[#050505]">
        
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
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="md:hidden pointer-events-auto flex items-center justify-center p-2.5 bg-neutral-900/80 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-neutral-800 transition-colors shadow-lg"
            title="Recent Designs"
          >
            <HistoryIcon className="w-5 h-5 text-cyan-400" />
          </button>
        </header>

        {/* IMAGE DISPLAY / HERO AREA */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 pt-20 md:pt-24 pb-6 overflow-y-auto custom-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            {!views.front && !loading && (
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

            {views.front && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 max-w-6xl mx-auto"
              >
                {/* LEFT/TOP PANEL - THUMBNAILS */}
                <div className="w-full md:w-72 shrink-0 flex flex-row md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-y-auto custom-scrollbar pb-2 md:pb-0 content-start">
                  {availableViews.map((view) => {
                    const hasImage = views[view.id];
                    const isLoading = viewLoading === view.id;
                    const isSelected = selectedView === view.id;

                    return (
                      <div key={view.id} className="flex flex-col gap-2 min-w-[100px] md:min-w-0">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{view.label}</span>
                        {hasImage ? (
                          <div 
                            onClick={() => setSelectedView(view.id)}
                            className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent hover:border-white/20'}`}
                          >
                            <img src={hasImage} className="w-full h-full object-cover" alt={view.label} />
                          </div>
                        ) : isLoading ? (
                          <div className="aspect-square rounded-2xl border-2 border-dashed border-cyan-500/50 bg-cyan-500/5 flex items-center justify-center">
                             <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div 
                            onClick={() => openGenerateViewModal(view.id)}
                            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                          >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <PlusIcon className="w-4 h-4 text-neutral-400 group-hover:text-cyan-400" />
                            </div>
                            <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400 text-center px-2">Add {view.label}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CENTER - MAIN IMAGE */}
                <div className="flex-1 relative group flex flex-col items-center justify-center bg-neutral-900/30 rounded-3xl border border-white/5 overflow-hidden">
                  {viewLoading === selectedView ? (
                    <div className="flex flex-col items-center gap-4 p-8">
                      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-cyan-400 animate-pulse font-medium">Synthesizing {availableViews.find(v => v.id === selectedView)?.label}...</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center min-h-[50vh] md:min-h-0">
                      <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        wheel={{ wheelDisabled: false }}
                        pinch={{ disabled: false }}
                        doubleClick={{ disabled: false }}
                        limitToBounds={false}
                      >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <>
                            {/* ZOOM CONTROLS */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                              <button onClick={() => zoomIn()} className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg" title="Zoom In">
                                <PlusIcon className="w-5 h-5" />
                              </button>
                              <button onClick={() => zoomOut()} className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg" title="Zoom Out">
                                <span className="text-xl leading-none font-medium pb-1">-</span>
                              </button>
                              <button onClick={() => resetTransform()} className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg" title="Reset Zoom">
                                <ResetIcon className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <TransformComponent 
                              wrapperStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} 
                              contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <img
                                src={views[selectedView]}
                                alt="Selected T-Shirt View"
                                className="w-full h-full max-h-[60vh] object-contain drop-shadow-2xl cursor-grab active:cursor-grabbing"
                              />
                            </TransformComponent>
                          </>
                        )}
                      </TransformWrapper>

                      <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <Link
                          href={`/custom/next-step/${imageId}`}
                          className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm pointer-events-auto"
                        >
                          Continue with {availableViews.find(v => v.id === selectedView)?.label}
                          <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
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

      {/* GENERATE ADDITIONAL VIEW MODAL */}
      <AnimatePresence>
        {viewModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewModal({ isOpen: false, viewId: null, prompt: "" })}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-neutral-900 border border-white/10 p-6 rounded-3xl shadow-2xl w-full max-w-md z-10"
            >
              <h3 className="text-xl font-bold mb-2 text-white">
                Generate {availableViews.find(v => v.id === viewModal.viewId)?.label}
              </h3>
              <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
                Refine the prompt for this specific angle. We will use the front image as a reference to keep the style consistent.
              </p>
              
              <div className="relative mb-5">
                <textarea
                  value={viewModal.prompt}
                  onChange={(e) => setViewModal({ ...viewModal, prompt: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl p-4 text-white placeholder-neutral-500 h-28 resize-none outline-none transition-all custom-scrollbar"
                  placeholder="Describe details for this view..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setViewModal({ isOpen: false, viewId: null, prompt: "" })}
                  className="px-5 py-2.5 rounded-full hover:bg-white/5 transition-colors text-sm font-medium text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAdditionalView}
                  className="px-6 py-2.5 bg-white text-black rounded-full hover:scale-105 transition-all text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Generate View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE HISTORY OVERLAY */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* RIGHT SIDEBAR - HISTORY */}
      <div className={`fixed inset-y-0 right-0 z-50 md:static md:z-auto w-80 md:w-80 bg-neutral-950/95 md:bg-neutral-900/40 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl transition-transform duration-300 ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
          <h3 className="font-bold text-base text-white/90 flex items-center gap-2 uppercase tracking-wider">
            <HistoryIcon className="w-4 h-4 text-cyan-400" />
            Recent Designs
          </h3>
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {gallery.length} ITEMS
            </span>
            <button 
              className="md:hidden text-white/60 hover:text-white p-1 rounded-full bg-white/5"
              onClick={() => setIsHistoryOpen(false)}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar content-start">
          {gallery.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-4 opacity-50">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <HistoryIcon className="w-8 h-8 text-neutral-500" />
              </div>
              <p className="text-neutral-400 text-sm font-medium">
                Your recent creations<br />will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-900/50 border-2 border-transparent hover:border-cyan-400 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer aspect-square"
                  onClick={() => handleReuse(img)}
                >
                  <div className="w-full h-full overflow-hidden bg-neutral-800/50">
                    <img
                      src={img.image_url}
                      alt={img.prompt || "Generated design"}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[10px] text-neutral-200 line-clamp-2 leading-tight font-medium drop-shadow-md">
                      "{img.prompt || "Design"}"
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      className="bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-cyan-500 hover:text-black transition-colors shadow-lg border border-white/10"
                      title="Reuse Design"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReuse(img);
                      }}
                    >
                      <EditIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ResetIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}