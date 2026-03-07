"use client";

import { useEffect, useState } from "react";

export default function AddressStep({ addresses, onNext }) {

  const [selected, setSelected] = useState(null);

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
     HANDLE SELECT
  ========================= */
  const handleSelect = (id) => {
    setSelected(id);

    localStorage.setItem("shipping_address_id", id);
    localStorage.setItem("billing_address_id", id);
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

      <h2 className="text-lg font-semibold mb-6 text-white">
        SELECT DELIVERY ADDRESS
      </h2>

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

      {/* BUTTON */}
      <button
        onClick={handleNext}
        disabled={!selected}
        className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        CONTINUE TO REVIEW
      </button>

    </div>
  );
}