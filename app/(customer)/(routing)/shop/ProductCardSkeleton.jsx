"use client";

export default function ProductCardSkeleton({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0b0f14] border border-white/10 rounded-xl overflow-hidden animate-pulse"
        >
          {/* image */}
          <div className="relative bg-white/5 h-[200px] md:h-[320px] flex items-center justify-center">
            <div className="absolute top-2 left-2 w-10 h-4 bg-white/10 rounded"></div>
            <div className="w-24 h-24 bg-white/10 rounded"></div>
          </div>

          {/* content */}
          <div className="p-3 space-y-2">
            {/* title */}
            <div className="h-3 w-3/4 bg-white/10 rounded"></div>

            {/* subtitle */}
            <div className="h-3 w-2/3 bg-white/10 rounded"></div>

            {/* rating */}
            <div className="h-3 w-20 bg-white/10 rounded"></div>

            {/* price */}
            <div className="h-4 w-16 bg-white/10 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}