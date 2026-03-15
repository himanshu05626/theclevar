"use client";

import { useState, useEffect } from "react";

export default function ProgressiveImage({
  image,
  alt = "",
  className = "",
}) {
  const placeholder =
    image?.url_64 ||
    image?.url_144 ||
    image?.image_url ||
    null;

  const mobile =
    image?.url_720 ||
    image?.image_url ||
    null;

  const desktop =
    image?.url_1080 ||
    image?.url_720 ||
    image?.image_url ||
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
    >

      {/* placeholder */}
      {placeholder && (
        <img
          src={placeholder}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover blur-md scale-105 transition-opacity duration-500 ${
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      )}

    </div>
  );
}