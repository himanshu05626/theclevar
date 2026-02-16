"use client";

export default function CartSummary({ items, loading }) {
  const subtotal = items.reduce(
    (sum, i) =>
      sum + (i.product?.price ?? i.price) * i.quantity,
    0
  );

  const gst = subtotal * 0.1;

  return (
    <div className="border border-white/10 bg-[#1a1a1a] rounded-xl p-4 text-sm space-y-2 shadow-lg">
      <h4 className="font-semibold mb-2 text-white">Cart Totals</h4>

      {/* SUBTOTAL */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400">Subtotal</span>

        {loading ? (
          <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-gray-200">₹{subtotal.toFixed(2)}</span>
        )}
      </div>

      {/* GST */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400">GST</span>

        {loading ? (
          <div className="h-4 w-14 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-gray-200">₹{gst.toFixed(2)}</span>
        )}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center font-semibold pt-3 border-t border-white/10">
        <span className="text-white">Total</span>

        {loading ? (
          <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-lg text-[#38bdf8]">
            ₹{(subtotal + gst).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
