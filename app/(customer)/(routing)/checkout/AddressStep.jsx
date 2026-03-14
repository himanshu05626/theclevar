"use client";

import { useEffect, useState } from "react";
import { createAddress } from "./actions";

export default function AddressStep({ addresses, onNext }) {

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    email: "",
    country: "India"
  });

  /* =========================
     LOAD DEFAULT ADDRESS
  ========================= */
  useEffect(() => {

    const stored = localStorage.getItem("shipping_address_id");

    if (stored) {
      setSelected(Number(stored));
      return;
    }

    const primary = addresses.find((a) => a.is_default);

    if (primary) {
      setSelected(primary.id);
      localStorage.setItem("shipping_address_id", primary.id);
      localStorage.setItem("billing_address_id", primary.id);
    }

  }, [addresses]);

  /* =========================
     SELECT ADDRESS
  ========================= */
  const handleSelect = (id) => {
    setSelected(id);

    localStorage.setItem("shipping_address_id", id);
    localStorage.setItem("billing_address_id", id);
  };

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* =========================
     SAVE ADDRESS
  ========================= */
  const handleSave = async () => {

    setLoading(true);

    const res = await createAddress(form);

    setLoading(false);

    if (res?.error) {
      alert(res.error);
      return;
    }

    location.reload();
  };

  /* =========================
     NEXT STEP
  ========================= */
  const handleNext = () => {

    if (!selected) return;

    localStorage.setItem("shipping_address_id", selected);
    localStorage.setItem("billing_address_id", selected);

    onNext();
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-white">
          SELECT DELIVERY ADDRESS
        </h2>

    

      </div>
          <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm mb-3 w-full bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg"
        >
          + Add New Address
        </button>

      {/* ADDRESS LIST */}
      <div className="space-y-4">

        {addresses.map((a) => (

          <label
            key={a.id}
            className={`block p-4 rounded-xl border cursor-pointer transition
            ${
              selected === a.id
                ? "border-cyan-400 bg-cyan-400/5"
                : "border-white/10 hover:border-cyan-400/40"
            }`}
          >

            <div className="flex justify-between gap-4">

              <div>

                <p className="font-semibold text-white">
                  {a.first_name} {a.last_name}
                </p>

                <p className="text-sm text-gray-400">
                  {a.address_1}
                </p>

                <p className="text-sm text-gray-400">
                  {a.city}, {a.state} - {a.postal_code}
                </p>

              </div>

              <input
                type="radio"
                checked={selected === a.id}
                onChange={() => handleSelect(a.id)}
              />

            </div>

          </label>

        ))}

      </div>

      {/* ========================
         ADD ADDRESS FORM
      ======================== */}

      {showForm && (

        <div className="mt-8 border-t border-white/10 pt-6">

          <h3 className="text-white font-semibold mb-4">
            Add New Address
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="address_1"
              placeholder="Address"
              onChange={handleChange}
              className="md:col-span-2 bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

            <input
              name="postal_code"
              placeholder="Postal Code"
              onChange={handleChange}
              className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg text-white"
            />

          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>

        </div>

      )}

      {/* CONTINUE */}
      <button
        onClick={handleNext}
        disabled={!selected}
        className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        CONTINUE TO REVIEW
      </button>

    </div>
  );
}