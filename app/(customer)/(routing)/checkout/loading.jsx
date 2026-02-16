export default function LoadingCart() {
  return (
    <div className="mx-auto bg-[#1a1a1a] max-w-7xl px-4 py-4 text-white">

      {/* TITLE */}
      <div className="mb-4 text-md font-semibold">
        Shopping Cart
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* LEFT */}
        <div className="space-y-4 lg:col-span-2">

          {/* ADDRESS */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-16 text-gray-400">Shipping:</span>
              <div className="h-4 w-48 animate-pulse rounded bg-[#111827]" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="w-16 text-gray-400">Billing:</span>
              <div className="h-4 w-40 animate-pulse rounded bg-[#111827]" />
            </div>

            <div className="border-b border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Use my shipping address
              </span>
              <div className="h-8 w-24 animate-pulse rounded bg-[#111827]" />
            </div>
          </div>

          {/* CART */}
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">

            {/* HEADER */}
            <div className="hidden grid-cols-12 gap-4 border-b border-white/10 bg-[#111827] px-4 py-3 text-xs text-gray-400 md:grid">
              <div className="col-span-2">Code</div>
              <div className="col-span-4">Product</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-1">Remove</div>
            </div>

            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-b border-white/10 p-4 md:grid md:grid-cols-12 md:items-center md:gap-4"
              >
                <div className="hidden h-4 w-20 animate-pulse rounded bg-[#111827] md:block md:col-span-2" />

                <div className="hidden gap-3 md:flex md:col-span-4">
                  <div className="h-12 w-12 animate-pulse rounded bg-[#111827]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-[#111827]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#111827]" />
                  </div>
                </div>

                <div className="hidden h-4 w-6 animate-pulse rounded bg-[#111827] md:col-span-1 md:block" />
                <div className="hidden h-4 w-16 animate-pulse rounded bg-[#111827] md:col-span-2 md:block" />
                <div className="hidden h-8 w-14 animate-pulse rounded bg-[#111827] md:col-span-2 md:block" />
                <div className="hidden h-5 w-5 animate-pulse rounded bg-[#111827] md:col-span-1 md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* TOTALS */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
            <h3 className="border-b border-white/10 pb-2 text-lg font-semibold">
              Cart Totals
            </h3>

            <div className="space-y-2 text-sm text-gray-400">
              <div>◉ Delivery</div>
              <div>○ Pickup from store</div>
            </div>

            <div className="border-dashed border-white/10" />

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <div className="h-4 w-16 animate-pulse rounded bg-[#111827]" />
            </div>

            <div className="flex justify-between text-sm">
              <span>Sub Total</span>
              <div className="h-4 w-16 animate-pulse rounded bg-[#111827]" />
            </div>

            <div className="flex justify-between text-sm">
              <span>GST</span>
              <div className="h-4 w-16 animate-pulse rounded bg-[#111827]" />
            </div>

            <div className="my-3 border-t border-white/10" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <div className="h-5 w-20 animate-pulse rounded bg-[#38bdf8]/40" />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-4 rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
            <div className="text-sm font-semibold">Payment</div>

            <div className="space-y-1 text-sm text-gray-400">
              <div>◉ Paypal</div>
              <div>○ Purchase order</div>
            </div>

            <div className="h-10 w-full animate-pulse rounded bg-[#0ea5e9]/30" />
            <div className="h-10 w-full animate-pulse rounded bg-[#111827]" />
          </div>
        </div>

      </div>
    </div>
  );
}
