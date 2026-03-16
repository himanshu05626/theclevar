"use client";

import { useState } from "react";
import {
  CubeIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import UploadImage from "./UploadImage";
import { updateCustomerProfile } from "./newaction";
import Link from "next/link";
export default function EditMyyAccount({
  customer,
  totalOrders,
  totalSpent,
  lastOrder,
  orders
}) {

  console.log("Dashboard Data", {
    customer,
    totalOrders,
    totalSpent,
    lastOrder,
    orders,
  });

  const fullName = `${customer.first_name ?? ""} ${customer.last_name ?? ""}`;

  const [editing, setEditing] = useState(false);

  const [imageUrls, setImageUrls] = useState(
    customer.image_gallery?.url ? [customer.image_gallery.url] : []
  );

  const [form, setForm] = useState({
    first_name: customer.first_name ?? "",
    last_name: customer.last_name ?? "",
    phone: customer.phone ?? "",
    whatsapp: customer.whatsapp ?? "",
  });
const handleSave = async () => {

  const res = await updateCustomerProfile({
    ...form,
    imageUrls,
  });

  if (res.success) {
    alert(res.message);
    setEditing(false);
  } else {
    alert(res.message);
  }

};
  return (
    <div className="p-6 text-white min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          MY DASHBOARD
        </h1>

        <p className="text-gray-400 text-sm">
          Manage your profile, orders, and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">

        {/* PROFILE CARD */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6">

          {!editing ? (

            <div className="space-y-4">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">

                <div className="w-28 h-28 rounded-full border border-cyan-500/40 flex items-center justify-center bg-[#111] shadow-[0_0_20px_rgba(14,165,233,0.25)]">
                  <img
                    src={imageUrls?.[0] || "/images/not-found.png"}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold">{fullName}</h3>
                  <p className="text-xs text-gray-500">
                    Member since 2026
                  </p>
                </div>

              </div>

              {/* Info */}
              <div className="space-y-3 text-sm text-gray-300">

                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-cyan-400" />
                  {customer.email}
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-pink-400" />
                    {customer.phone}
                  </div>
                )}

              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full flex items-center justify-center gap-2 border border-cyan-500/30 rounded-lg py-2 text-sm hover:bg-cyan-500/10 transition"
              >
                <PencilSquareIcon className="w-4 h-4" />
                EDIT PROFILE
              </button>

            </div>

          ) : (

            <div className="space-y-5">

              {/* IMAGE */}
              <div className="flex flex-col items-center gap-3">

                <div className="flex flex-col items-center gap-2 w-full">

                  <div className="w-28 h-28 rounded-full border border-cyan-500/40 flex items-center justify-center bg-[#111] shadow-[0_0_20px_rgba(14,165,233,0.25)]">
                    <img
                      src={imageUrls?.[0] || "/images/not-found.png"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>

                  <div className="">
                    <UploadImage
                      uploadType="userImage"
                      onSuccess={(urls) => setImageUrls(urls)}
                    />
                  </div>

                </div>

              </div>

              {/* FORM */}
              <div className="space-y-4">

                <Input
                  label="FIRST NAME"
                  
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                />

                <Input
                  label="LAST NAME"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                />

                <Input
                  label="EMAIL"
                  value={customer.email}
                  disabled
                />

                <Input
                  label="PHONE"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />

                <Input
                  label="WHATSAPP"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value })
                  }
                />

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  onClick={handleSave}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2 rounded-lg transition">
                  SAVE
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 border border-white/20 rounded-lg py-2 text-sm hover:bg-white/5 transition"
                >
                  CANCEL
                </button>

              </div>

            </div>

          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4">

            <StatCard
              icon={<CubeIcon className="w-5 h-5 text-cyan-400" />}
              value={totalOrders}
              label="TOTAL ORDERS"
            />

            <StatCard
              icon={<CurrencyRupeeIcon className="w-5 h-5 text-pink-400" />}
              value={`₹${totalSpent}`}
              label="TOTAL SPENT"
            />

            <StatCard
              icon={<CheckCircleIcon className="w-5 h-5 text-green-400" />}
              value={orders?.filter(o => o.status === "DELIVERED").length}
              label="COMPLETED"
            />

          </div>

          {/* LAST TRANSACTION */}
          {lastOrder && (
            <Card title="LAST TRANSACTION">

              <Link href={`/order/${lastOrder.id}`} className="flex items-center gap-4 border border-white/10 rounded-lg p-4">

                <img
                  src="/images/not-found.png"
                  className="w-14 h-14 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {lastOrder.items?.[0]?.product_title}
                  </p>

                  <p className="text-xs text-gray-400">
                    Qty: {lastOrder.items?.[0]?.quantity}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-pink-400 text-xs font-semibold bg-pink-500/20 px-3 py-1 rounded-full">
                    {lastOrder.status}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    ₹{lastOrder.total}
                  </p>

                </div>

              </Link>

            </Card>
          )}

          {/* RECENT ORDERS */}
          <Card title="RECENT ORDERS">

            <div className="space-y-3">

              {orders?.map((order) => (
                <Link href={`/order/${order.id}`}
                  key={order.id}
                  className="flex items-center gap-4 border border-white/10 rounded-lg p-4"
                >

                  <img
                    src="/images/not-found.png"
                    className="w-14 h-14 rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {order.order_number}
                    </p>

                    <p className="text-xs text-gray-400">
                      {order.items.length} item(s) · ₹{order.total}
                    </p>
                  </div>

                  <span className="text-xs text-pink-400 bg-pink-500/20 px-3 py-1 rounded-full">
                    {order.status}
                  </span>

                </Link>
              ))}

            </div>

          </Card>

        </div>

      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/40 transition">
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      {icon}
    </div>
  );
}

/* CARD */
function Card({ title, children }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">

      <div className="flex justify-between mb-4">
        <h3 className="font-semibold tracking-wide">
          {title}
        </h3>

        <span className="text-xs text-cyan-400 cursor-pointer" >
          View →
        </span>
      </div>

      {children}

    </div>
  );
}

/* INPUT */
function Input({ label, value, onChange, disabled }) {
  return (
    <div>

      <label className="text-xs text-gray-400">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full text-base mt-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
      />

    </div>
  );
}