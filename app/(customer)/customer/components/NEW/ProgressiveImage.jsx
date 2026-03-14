"use client";

import { useState, useEffect } from "react";

export default function ProgressiveImage({
  image,
  alt = "",
  className = "",
}) {
  // choose smallest available placeholder
  const placeholder =
    image?.variants?.v64 ||
    image?.variants?.v144 ||
    image?.variants?.v240 ||
    image?.url ||
    null;

  // mobile image
  const mobile =
    image?.variants?.v720 ||
    image?.url ||
    null;

  // desktop image
  const desktop =
    image?.variants?.v1080 ||
    image?.variants?.v720 ||
    image?.url ||
    null;

  const [src, setSrc] = useState(placeholder);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!image) return;

    const isDesktop = window.innerWidth >= 768;
    const highRes = isDesktop ? desktop : mobile;

    if (!highRes) return;

    const img = new Image();
    img.src = highRes;

    img.onload = () => {
      setSrc(highRes);
      setLoaded(true);
    };
  }, [image]);

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ aspectRatio: "1 / 1" }} // prevents layout shift
    >
      {/* placeholder */}
      {placeholder && (
        <img
          src={placeholder}
          alt={alt}
          className={`absolute px-10 inset-0 w-full h-full object-contain blur-md scale-105 transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}
        />
      )}

      {/* main image */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`absolute px-10 inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      )}
    </div>
  );
}