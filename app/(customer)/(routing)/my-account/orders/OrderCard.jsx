import Link from "next/link";
import StatusChip from "@/app/admin/UI/common/StatusChip";

export default function OrderCard({ order }) {
const formattedDate = new Date(order.created_at).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true, // remove if you prefer 24-hour format
});

  return (
    <Link href={`/order/${order.id}`} className="group">
      <div
        className="
          relative overflow-hidden rounded-3xl
          bg-[#111]
          border border-white/10
          p-6
          transition-all duration-300
          hover:-translate-y-2
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          hover:border-[#38bdf8]/40
        "
      >

        {/* Glow Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#38bdf8]/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#a78bfa]/20 blur-3xl" />
        </div>

        <div className="relative space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Order
              </p>
              <h2 className="text-2xl font-bold text-white">
                #{order.order_number}
              </h2>
            </div>

            <StatusChip value={order.status} />
          </div>

          {/* Total */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total
            </p>
            <p className="
              text-3xl font-extrabold
              bg-gradient-to-r from-[#38bdf8] to-[#a78bfa]
              bg-clip-text text-transparent
            ">
              ${order.total.toFixed(2)}
            </p>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{formattedDate}</span>
            <span className="group-hover:text-white transition">
              View →
            </span>
          </div>

        </div>

      </div>
    </Link>
  );
}