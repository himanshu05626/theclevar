import { Suspense } from "react";
import OrderItems from "./OrderItems";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function OrderCardMobile({ order }) {
    return (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition hover:shadow-[0_10px_40px_rgba(0,0,0,0.9)]">

    {/* HEADER */}
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 bg-[#111827] px-3 py-3 text-xs sm:px-4 sm:text-sm md:grid-cols-4">

      <div>
        <div className="text-gray-400">Order ID</div>
        <div className="font-medium">#{order.order_number}</div>
      </div>

      <div className="text-right">
        <div className="text-gray-400">Placed</div>
        <div className="font-medium">
          {new Date(order.created_at).toLocaleDateString()}
        </div>
      </div>

      <div>
        <div className="text-gray-400">Ship to</div>
        <div className="font-medium">
          {order.shipping_address?.split(" ").slice(0, 2).join(" ") + "..."}
        </div>
      </div>

      <div className="text-right">
        <div className="text-gray-400">Status</div>
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] sm:text-xs font-medium">
          {order.status}
        </span>
      </div>
    </div>

    {/* ITEMS */}
    <div>
      <Suspense
        fallback={
          <div className="space-y-2 p-3 sm:p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse rounded border border-white/10 bg-[#111827]" />

                  <div className="space-y-1">
                    <div className="h-3 w-40 sm:w-56 animate-pulse rounded bg-[#111827]" />
                    <div className="h-2.5 w-20 sm:w-24 animate-pulse rounded bg-[#111827]" />
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="h-3 w-8 animate-pulse rounded bg-[#111827]" />
                  <div className="h-3 w-10 animate-pulse rounded bg-[#111827]" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <OrderItems orderId={order.id} />
      </Suspense>
    </div>

    {/* FOOTER */}
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#111827] px-3 py-3 text-xs sm:px-4 sm:text-sm">

      <div className="font-semibold text-white">
        Total: ${order.total.toFixed(2)}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        <button
          className="
            inline-flex items-center justify-center
            rounded border border-white/10 bg-[#1a1a1a]
            px-3 py-1.5 text-xs font-medium text-gray-300
            transition hover:bg-white/5
            md:px-4 md:py-2 md:text-sm
          "
        >
          Invoice
        </button>

        <Link
          href={`/order/${order.id}`}
          className="
            inline-flex items-center justify-center
            rounded bg-[#0ea5e9]
            px-3 py-1.5 text-xs font-medium text-white
            shadow-[0_0_12px_rgba(14,165,233,0.35)]
            transition hover:bg-[#38bdf8]
            md:px-4 md:py-2 md:text-sm
          "
        >
          View
          <ArrowRightIcon className="ml-1 h-3 w-3 md:h-4 md:w-4" />
        </Link>

      </div>
    </div>
  </div>
);

}
