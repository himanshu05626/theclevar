"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function OrderCardMobile({ order }) {
  const total = parseFloat(order?.total);
const statusMap = {
  delivered: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Delivered",
  },
  created: {
    text: "text-blue-300",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
    label: "Created",
  },
  pending: {
    text: "text-yellow-300",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
    label: "Pending",
  },
  cancelled: {
    text: "text-red-300",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    dot: "bg-red-400",
    label: "Cancelled",
  },
  paid: {
    text: "text-green-300",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    dot: "bg-green-400",
    label: "Paid",
  },
};

  const status =
    statusMap[order?.status?.toLowerCase()] || {
      text: "text-gray-400",
      bg: "bg-gray-500/15",
      border: "border-gray-500/30",
      dot: "bg-gray-400",
      label: order?.status || "Unknown",
    };

  return (
    <Link
      href={`/order/${order.id}`}
      className="block group active:scale-[0.98] transition"
    >
      <div className="relative overflow-hidden  border border-white/10 bg-[#0f0f0f] px-4 py-3 shadow-sm">

        {/* 🔥 subtle glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#0ea5e9]/10 via-transparent to-[#38bdf8]/10" />

        <div className="relative flex items-center justify-between">

          {/* LEFT */}
          <div className="flex flex-col gap-1.5">

            {/* Order ID */}
            <div className="text-sm font-semibold text-white tracking-wide">
              #{order?.order_number || "—"}
            </div>

            {/* Date */}
            <div className="text-[11px] text-gray-500">
              {order?.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : "—"}
            </div>

            {/* Status with dot */}
            <div className="flex items-center gap-1.5">
            {/* Status with dot */}
{/* Status Chip */}
{/* Status Chip */}
<div
  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${status.bg} ${status.border}`}
>
  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
  <span className={`text-[11px] font-medium ${status.text}`}>
    {status.label}
  </span>
</div>   </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* Price */}
            <div className="text-sm font-semibold text-white">
              ₹{!isNaN(total) ? total.toFixed(2) : "0.00"}
            </div>

            {/* Arrow */}
            <div className="rounded-full p-1 bg-white/5 group-hover:bg-white/10 transition">
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-white transition" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}