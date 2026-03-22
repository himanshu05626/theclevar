"use client";

import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

export default function CategoryBanner({ categories = [] }) {
  const [index, setIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const total = categories.length;

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const prev = () => emblaApi && emblaApi.scrollPrev();
  const next = () => emblaApi && emblaApi.scrollNext();

  if (!total) return null;

  return (
    <div className="w-full py-1 text-center overflow-hidden">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-white font-serif tracking-wide">
        CATEGORIES
      </h2>
      <p className="text-gray-500 mt-1">
        Shop by your mood & moment
      </p>

      {/* Slider */}
      <div className="relative mt-10">

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">

            {categories.map((cat, i) => {
              const isCenter = i === index;

              return (
                <div
                  key={i}
                  className="flex-[0_0_70%] md:flex-[0_0_33%] flex justify-center"
                >
                  <div
                    className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isCenter
                        ? "scale-100 opacity-100 z-20"
                        : "scale-90 opacity-60"
                    }`}
                  >
                    <Card data={cat} isCenter={isCenter} />
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-[#7a2d3c] text-white w-10 h-10 rounded-full shadow-md hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-[#7a2d3c] text-white w-10 h-10 rounded-full shadow-md hover:scale-110 transition"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {categories.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-[#7a2d3c]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* Card */
function Card({ data, isCenter }) {
  return (
    <Link href={data.href}>
      <div
        className={`w-[220px] md:w-[300px] h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg relative cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCenter ? "shadow-2xl scale-100" : ""
        }`}
      >
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-6">
          <h3 className="text-white text-lg md:text-2xl font-serif tracking-wide">
            {data.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}