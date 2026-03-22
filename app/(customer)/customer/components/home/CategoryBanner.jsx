"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CategoryBanner({ categories = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="w-full py-10  text-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-white font-semibold tracking-wide">
        CATEGORIES
      </h2>
      <p className="text-gray-500 mt-1">
        Shop by your mood & moment
      </p>

      {/* Carousel */}
      <div className="relative mt-8 max-w-5xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categories.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_70%] md:flex-[0_0_40%] px-3"
              >
                {/* Link Wrapper */}
                <Link href={item.href || "#"} className="block">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Title */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                      <h3 className="text-white text-xl md:text-2xl font-semibold tracking-wide">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#7a3b4b] text-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7a3b4b] text-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}