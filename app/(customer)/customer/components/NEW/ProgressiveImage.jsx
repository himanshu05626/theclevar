"use client";

import { useState, useEffect } from "react";

export default function ProgressiveImage({
  image,
  alt,
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState("");

  const placeholder =
    image?.variants?.v144 ||
    image?.variants?.v240 ||
    image?.url;

  const mobile =
    image?.variants?.v720 ||
    image?.url;

  const desktop =
    image?.variants?.v1080 ||
    image?.variants?.v720 ||
    image?.url;

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;

    const highRes = isDesktop ? desktop : mobile;

    const img = new Image();
    img.src = highRes;

    img.onload = () => {
      setSrc(highRes);
      setLoaded(true);
    };

    setSrc(placeholder);
  }, [image]);

  return (
    <div className={`relative overflow-hidden ${className}`}>

      {/* placeholder */}
      <img
        src={placeholder}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-contain blur-md scale-110 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
      />

      {/* main image */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />

    </div>
  );
}