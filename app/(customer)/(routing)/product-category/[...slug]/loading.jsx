export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl ">

      {/* HERO HEADER */}
      <div className="relative h-62 mb-8 overflow-hidden border border-white/10 bg-[#0b0b0b]">

        {/* GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(56,189,248,.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.4) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_60%)]" />

        {/* CONTENT SKELETON */}
        <div className="relative py-16 text-center space-y-4">


        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-[#0b0b0b] overflow-hidden"
          >

            {/* IMAGE */}
            <div className="h-52 w-full animate-pulse bg-[#1a1a1a]" />

            {/* CONTENT */}
            <div className="space-y-3 p-3">

              <div className="h-3 w-20 animate-pulse rounded bg-[#1a1a1a]" />

              <div className="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />

              <div className="h-3 w-24 animate-pulse rounded bg-[#1a1a1a]" />

              <div className="flex items-center justify-between pt-2">

                <div className="h-4 w-12 animate-pulse rounded bg-[#1a1a1a]" />

                <div className="h-3 w-16 animate-pulse rounded bg-[#1a1a1a]" />

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}