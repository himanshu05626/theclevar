// app/my-account/orders/OrderCard.jsx
// "use client" ;

import { Suspense } from "react";
import OrderItems from "./OrderItems";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import StatusChip from "@/app/admin/UI/common/StatusChip";
// import { useRouter } from "next/navigation";

export default function OrderCard({ order }) {
    //   const router = useRouter();

   return (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition hover:shadow-[0_10px_40px_rgba(0,0,0,0.9)]">

    {/* HEADER */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-[#111827] px-4 py-4 text-sm md:grid-cols-4">
      <div>
        <div className="text-gray-400">Order ID</div>
        <div className="font-medium">#{order.order_number}</div>
      </div>

      <div>
        <div className="text-gray-400">Order Placed</div>
        <div className="font-medium">
          {new Date(order.created_at).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
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
        <StatusChip value={order.status} />
      </div>
    </div>

    {/* ITEMS */}
    <div className="bg-[#1a1a1a]">
      <Suspense
        fallback={
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0"
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
        }
      >
        <OrderItems orderId={order.id} />
      </Suspense>
    </div>

    {/* FOOTER */}
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#111827] px-4 py-4 text-sm">
      <div className="font-semibold text-white">
        Total: ${order.total.toFixed(2)}
      </div>

      <Link
        href={`/order/${order.id}`}
        className="flex items-center gap-1 font-medium text-[#38bdf8] hover:text-[#7dd3fc]"
      >
        View order details
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

}
