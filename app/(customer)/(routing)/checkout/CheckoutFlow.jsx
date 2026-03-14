"use client";

import { useState, useEffect } from "react";

import CheckoutSteps from "./CheckoutSteps";
import AddressStep from "./AddressStep";
import ReviewStep from "./ReviewStep";

import CheckoutTotal from "./CheckoutTotal";
import PaymentStep from "./PaymentStep";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CheckoutFlow({ addresses, cartData }) {

  const [step, setStep] = useState(1);

  /* =========================
     SCROLL TO TOP ON STEP CHANGE
  ========================= */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto  text-white">

      <div className="max-w-7xl mx-auto px-4 py-6">

    <div className="flex items-center gap-4 mb-8 justify-between">

  <Link
  href="/cart"
    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition"
  >
    <ArrowLeftIcon className="w-4 h-4" />
    Back
  </Link>

  <h1 className="text-lg font-semibold">
    Secure Checkout
  </h1>

</div>

        {/* STEPS */}
        <CheckoutSteps step={step} />

        {/* LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT */}
          <div className="lg:col-span-2">

            {step === 1 && (
              <AddressStep
                addresses={addresses}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <ReviewStep
                cartData={cartData}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <PaymentStep
                onBack={() => setStep(2)}
              />
            )}

          </div>

          {/* RIGHT */}
          <CheckoutTotal cartData={cartData} />

        </div>
      </div>
    </div>
  );
}