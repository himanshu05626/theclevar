export default function Loading() {
  return (
    <div className="mx-auto bg-[#1a1a1a] max-w-7xl px-4 py-8">

      {/* TITLE */}
      <div className="mx-auto mb-6 h-8 w-48 animate-pulse rounded bg-[#1a1a1a]" />

      {/* CATEGORY GRID */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-white/10 bg-[#1a1a1a]"
          />
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl border border-white/10 bg-[#1a1a1a]"
          />
        ))}
      </div>
    </div>
  );
}
