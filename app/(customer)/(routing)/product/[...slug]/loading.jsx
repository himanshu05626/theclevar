export default function Loading() {
  return (
    <section className="bg-[#05070b] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= LEFT IMAGE SIDE ================= */}
          <div className="flex flex-col md:flex-row    gap-4">

            {/* Thumbnails */}
            <div className="flex hidden md:flex flex-col gap-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-md bg-[#0f1720] border border-white/10"
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div className="h-100 md:h-130 w-full rounded-xl bg-[#151a1e] border border-white/10" />
            </div>
                <div className="flex flex md:hidden  gap-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-md bg-[#0f1720] border border-white/10"
                />
              ))}
            </div>

          </div>

          {/* ================= RIGHT DETAILS ================= */}
          <div className="space-y-6">

            {/* Category */}
            <div className="h-3 w-20 bg-[#0f1720] rounded" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-7 w-4/5 bg-[#0f1720] rounded" />
              <div className="h-7 w-3/5 bg-[#0f1720] rounded" />
            </div>

            {/* Description */}
            <div className="h-4 w-2/3 bg-[#0f1720] rounded" />

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-28 bg-[#0f1720] rounded" />
              <div className="h-4 w-20 bg-[#0f1720] rounded" />
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 bg-[#0f1720] rounded" />
              <div className="h-6 w-16 bg-[#0f1720] rounded" />
              <div className="h-6 w-16 bg-[#0f1720] rounded" />
            </div>

            {/* Size Label */}
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-[#0f1720] rounded" />
              <div className="h-4 w-20 bg-[#0f1720] rounded" />
            </div>

            {/* Size Buttons */}
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-10 rounded-md bg-[#0f1720] border border-white/10"
                />
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="h-4 w-10 bg-[#0f1720] rounded" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0f1720] rounded border border-white/10" />
                <div className="w-10 h-8 bg-[#0f1720] rounded border border-white/10" />
                <div className="w-8 h-8 bg-[#0f1720] rounded border border-white/10" />
              </div>
            </div>

            {/* Add to Cart */}
            <div className="h-12 w-full bg-[#0f1720] rounded-xl border border-white/10" />

            {/* Share */}
            <div className="h-4 w-32 bg-[#0f1720] rounded" />

          </div>

        </div>
      </div>
    </section>
  );
}