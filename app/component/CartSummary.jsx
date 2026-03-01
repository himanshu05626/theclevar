"use client";

export default function CartSummary({ items, loading }) {
  const subtotal = items.reduce(
    (sum, i) =>
      sum + (i.product?.price ?? i.price) * i.quantity,
    0
  );

  const gst = subtotal * 0.1;
  const delivery = subtotal > 1000 ? 0 : 49; // example logic
  const total = subtotal + gst + delivery;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      className="rounded-2xl p-5 space-y-4
      bg-gradient-to-b from-[#1a1a1a] to-[#111]
      border border-white/10
      shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold text-[15px]">
          Order Summary
        </h4>

        <span className="text-xs text-gray-400">
          {totalItems} item{totalItems !== 1 && "s"}
        </span>
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="space-y-3 text-sm">
        {/* SUBTOTAL */}
        <Row
          label="Subtotal"
          loading={loading}
          value={`₹${subtotal.toFixed(2)}`}
        />

        {/* GST */}
        <Row
          label="GST (10%)"
          loading={loading}
          value={`₹${gst.toFixed(2)}`}
        />

        {/* DELIVERY */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Delivery</span>

          {loading ? (
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
          ) : delivery === 0 ? (
            <span className="text-green-400 font-medium">
              Free
            </span>
          ) : (
            <span className="text-gray-200">
              ₹{delivery.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10 pt-4" />

      {/* TOTAL */}
      <div className="flex items-center justify-between">
        <span className="text-white text-[15px] font-semibold">
          Total Amount
        </span>

        {loading ? (
          <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-xl font-bold text-[#38bdf8]">
            ₹{total.toFixed(2)}
          </span>
        )}
      </div>

      {/* SAVINGS */}
      {!loading && delivery === 0 && (
        <div className="text-xs text-green-400">
          🎉 You saved ₹49 on delivery
        </div>
      )}
    </div>
  );
}

/* =========================
   REUSABLE ROW
========================= */
function Row({ label, value, loading }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>

      {loading ? (
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      ) : (
        <span className="text-gray-200">{value}</span>
      )}
    </div>
  );
}