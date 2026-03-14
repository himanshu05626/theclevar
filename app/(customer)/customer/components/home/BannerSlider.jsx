"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

export default function BannerSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides] = useState([
    "/images/banner/Bnnernew2.jpeg",
    "/images/banner/Bannernew1.jpeg",
  ]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="mt-5">

      {/* EMBLA VIEWPORT */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">

          {slides.map((src, index) => (
            <div key={index} className="flex-[0_0_100%] px-2">
              <img
                src={src}
                alt="banner"
                className="w-full rounded-lg"
              />
            </div>
          ))}

        </div>
      </div>

      {/* PAGINATION DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition
            ${
              selectedIndex === index
                ? "bg-cyan-400"
                : "bg-gray-500"
            }`}
          />
        ))}
      </div>

    </div>
  );
}