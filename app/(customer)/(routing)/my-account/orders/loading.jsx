// app/my-account/orders/loading.jsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">

      <p className="mb-2 text-md text-gray-400">Orders</p>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a]"
        >
          {/* HEADER */}
          <div className="grid grid-cols-2 gap-4 bg-[#111827] px-4 py-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-14 animate-pulse rounded bg-[#1a1a1a]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[#1a1a1a]" />
              </div>
            ))}
          </div>

          {/* ITEMS */}
          <div className="space-y-4 px-4 py-4">
            {[1, 2, 3].map((k) => (
              <div
                key={k}
                className="flex flex-col gap-3 border-b border-white/10 pb-4 last:border-0 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded border border-white/10 bg-[#111827]" />

                  <div className="space-y-2">
                    <div className="h-4 w-56 animate-pulse rounded bg-[#111827]" />
                    <div className="h-3 w-24 animate-pulse rounded bg-[#111827]" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-4 w-10 animate-pulse rounded bg-[#111827]" />
                  <div className="h-4 w-12 animate-pulse rounded bg-[#111827]" />
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-3 border-t border-white/10 bg-[#111827] px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-[#1a1a1a]" />

            <div className="flex gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#1a1a1a]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
