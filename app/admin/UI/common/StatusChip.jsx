"use client";

export default function StatusChip({ value, type = "order" }) {
  const ORDER_STATUS_STYLES = {
    CREATED: "bg-gray-100 text-gray-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    PAYMENT_FAILED: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
  };

  const DELIVERY_METHOD_STYLES = {
    PICKUP: "bg-slate-100 text-slate-700",
    DELIVERY: "bg-cyan-100 text-cyan-700",
  };

  const PAYMENT_STATUS_STYLES = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700", // PayPal only
    FAILED: "bg-red-100 text-red-700",
  };

  const DEFAULT_STATUS_STYLE = "bg-gray-100 text-gray-700";

  let map = ORDER_STATUS_STYLES;
  if (type === "delivery") map = DELIVERY_METHOD_STYLES;
  if (type === "payment") map = PAYMENT_STATUS_STYLES;

  const classes = map[value] || DEFAULT_STATUS_STYLE;

  // ✅ Friendly labels (IMPORTANT)
  const LABEL_MAP = {
    PAYMENT_FAILED: "Payment Failed",
    DELIVERED: "Completed", // 👈 UI label only
  };

  const label =
    LABEL_MAP[value] ||
    (typeof value === "string"
      ? value.replace(/_/g, " ")
      : "—");

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${classes}`}
    >
      {label}
    </span>
  );
}
