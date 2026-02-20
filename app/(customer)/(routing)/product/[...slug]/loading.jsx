export default function Loading() {
  return (
    <section className="bg-[#0f0f0f] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* IMAGE SIDE */}
          <div>
            {/* Main Image */}
            <div className="
              aspect-square w-full
              rounded-xl
              bg-[#1a1a1a]
              border border-white/10
            " />

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="
                    w-16 h-16
                    rounded-lg
                    bg-[#1a1a1a]
                    border border-white/10
                  "
                />
              ))}
            </div>
          </div>

          {/* DETAILS SIDE */}
          <div className="space-y-6">

            {/* Title */}
            <div className="h-6 w-3/4 bg-[#1a1a1a] rounded" />
            <div className="h-6 w-1/2 bg-[#1a1a1a] rounded" />

            {/* Price */}
            <div className="h-8 w-32 bg-[#1a1a1a] rounded" />

            {/* Size Label */}
            <div className="h-4 w-24 bg-[#1a1a1a] rounded" />

            {/* Size Buttons */}
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="
                    w-12 h-10
                    rounded-lg
                    bg-[#1a1a1a]
                    border border-white/10
                  "
                />
              ))}
            </div>

            {/* Quantity + Button */}
            <div className="flex gap-4 mt-6">
              <div className="
                w-20 h-11
                rounded-xl
                bg-[#1a1a1a]
                border border-white/10
              " />
              <div className="
                flex-1 h-11
                rounded-xl
                bg-[#1a1a1a]
              " />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}