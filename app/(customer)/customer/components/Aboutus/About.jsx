"use client";

import Image from "next/image";
import Link from "next/link";
import ServiceHighlights from "../home/ServiceHighlights";

export default function AboutPage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden py-14 bg-gradient-to-r from-[#0f0f0f] to-[#111827]">

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

          <h1 className="text-4xl font-semibold text-white">
            About <span className="text-sky-400">Us</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-300">
            We are committed to delivering premium quality fashion that blends
            comfort, customization, and modern design — built for everyday style.
          </p>

        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="bg-[#0f0f0f] py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex justify-center gap-12">

            {/* LEFT CONTENT */}
            <div
              className="
                rounded-2xl
                bg-[#0D1117]
                p-8
                shadow-[0_10px_40px_rgba(0,0,0,0.8)]
                border border-gray-800
              "
            >

              <h2 className="text-2xl font-bold text-white">
                Who We Are
              </h2>

              {/* Divider */}
              <div className="my-5 h-[2px] w-28 bg-sky-400" />

              <div className="space-y-5 text-sm leading-relaxed text-gray-300">

                <p>
                  The Clevar is a modern apparel brand focused on delivering
                  high-quality t-shirts, hoodies, and customizable fashion
                  products. We combine premium fabrics with trend-driven
                  designs to create clothing that stands out.
                </p>

                <p>
                  Our mission is simple — provide stylish, comfortable, and
                  affordable fashion while giving customers the power to
                  personalize their outfits with unique designs.
                </p>

                <p>
                  From everyday basics to statement pieces, every product is
                  crafted with attention to detail, durability, and finish.
                </p>

              </div>

              {/* CTA */}
              <Link
                href="/shop"
                className="
                  mt-8 inline-flex items-center gap-2
                  rounded-lg bg-sky-500
                  px-6 py-3 text-sm font-semibold text-white
                  shadow-[0_0_20px_rgba(14,165,233,0.6)]
                  transition hover:bg-sky-400
                "
              >
                Shop Now →
              </Link>

            </div>

          

          </div>

        </div>
      </section>

      {/* ================= BRAND VALUES ================= */}
      <section className="bg-[#0f0f0f] py-16">

        <div className="mx-auto max-w-7xl px-6 text-center">

          <h3 className="text-2xl font-bold text-white">
            Why Choose <span className="text-sky-400">Us</span>
          </h3>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {/* CARD 1 */}
            <div
              className="
                rounded-2xl
                bg-[#0D1117]
                p-8
                border border-gray-800
                shadow-[0_10px_40px_rgba(0,0,0,0.8)]
                hover:border-sky-500 transition
              "
            >
              <h4 className="font-semibold text-white">
                Premium Quality
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                High-grade fabrics, durable stitching, and premium finishing.
              </p>
            </div>

            {/* CARD 2 */}
            <div
              className="
                rounded-2xl
                bg-[#0D1117]
                p-8
                border border-gray-800
                shadow-[0_10px_40px_rgba(0,0,0,0.8)]
                hover:border-sky-500 transition
              "
            >
              <h4 className="font-semibold text-white">
                Custom Designs
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                Personalize apparel with your own prints and branding.
              </p>
            </div>

            {/* CARD 3 */}
            <div
              className="
                rounded-2xl
                bg-[#0D1117]
                p-8
                border border-gray-800
                shadow-[0_10px_40px_rgba(0,0,0,0.8)]
                hover:border-sky-500 transition
              "
            >
              <h4 className="font-semibold text-white">
                PAN India Delivery
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                Fast, secure, and reliable shipping across India.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SERVICE HIGHLIGHTS ================= */}
      <ServiceHighlights />
    </>
  );
}
