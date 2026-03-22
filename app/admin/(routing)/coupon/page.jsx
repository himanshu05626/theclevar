"use client";

import { useState } from "react";

export default function AddCoupon() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "FIXED",
    discount_value: "",
    min_order_value: "",
    max_discount: "",
    usage_limit: "",
    starts_at: "",
    expires_at: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/admin/api/coupon/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Coupon created!");

      setForm({
        code: "",
        description: "",
        discount_type: "FIXED",
        discount_value: "",
        min_order_value: "",
        max_discount: "",
        usage_limit: "",
        starts_at: "",
        expires_at: "",
        is_active: true,
      });
    } catch (err) {
      alert(err.message || "Error creating coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl w-full mx-auto bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          🎟️ Create Coupon
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CODE */}
          <div>
            <label className="text-sm text-gray-500">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="SAVE50"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-500">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm text-gray-500">Discount Type</label>
            <select
              name="discount_type"
              value={form.discount_type}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            >
              <option value="FIXED">Fixed (₹)</option>
              <option value="PERCENTAGE">Percentage (%)</option>
            </select>
          </div>

          {/* VALUE */}
          <div>
            <label className="text-sm text-gray-500">Discount Value</label>
            <input
              type="number"
              name="discount_value"
              value={form.discount_value}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              required
            />
          </div>

          {/* MIN ORDER */}
          <div>
            <label className="text-sm text-gray-500">Min Order Value</label>
            <input
              type="number"
              name="min_order_value"
              value={form.min_order_value}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          {/* MAX DISCOUNT */}
          {form.discount_type === "PERCENTAGE" && (
            <div>
              <label className="text-sm text-gray-500">Max Discount</label>
              <input
                type="number"
                name="max_discount"
                value={form.max_discount}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          )}

          {/* USAGE LIMIT */}
          <div>
            <label className="text-sm text-gray-500">Usage Limit</label>
            <input
              type="number"
              name="usage_limit"
              value={form.usage_limit}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Start Date</label>
              <input
                type="datetime-local"
                name="starts_at"
                value={form.starts_at}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Expiry Date</label>
              <input
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            <label className="text-sm text-gray-600">
              Active Coupon
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
}