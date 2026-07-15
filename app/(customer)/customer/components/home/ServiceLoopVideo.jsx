"use client";

import React from "react";

export default function ServiceLoopVideo() {
  return (
    <div className="my-12 max-w-6xl mx-auto px-4 md:px-2">
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.1)] hover:shadow-[0_0_40px_rgba(236,72,153,0.2)] transition-all duration-700 ease-out group">
        <video
          src="/WhatsApp Video 2026-07-16 at 1.15.56 AM (1).mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover transform scale-[1.01] group-hover:scale-100 transition-transform duration-700"
        />
        {/* Subtle Overlay Gradient for Premium Look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
