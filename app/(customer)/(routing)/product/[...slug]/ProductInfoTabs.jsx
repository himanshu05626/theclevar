"use client";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import Stars from "./Stars";

export default function ProductInfoTabs({
  product = {},
  description = "Drop-shoulder oversized fit with digital void artwork. Premium 240GSM cotton for the ultimate streetwear drape.",
  fabric = "Premium Cotton",
  fit = "Oversized",
  print = "Screen Print",
  wash = "Cold Machine Wash",

  sizing = [
    { size: "XS", chest: '36"', length: '26"', shoulder: '16"' },
    { size: "S", chest: '38"', length: '27"', shoulder: '17"' },
    { size: "M", chest: '40"', length: '28"', shoulder: '18"' },
    { size: "L", chest: '42"', length: '29"', shoulder: '19"' },
    { size: "XL", chest: '44"', length: '30"', shoulder: '20"' },
    { size: "XXL", chest: '46"', length: '31"', shoulder: '21"' },
  ],
}) {
  const [tab, setTab] = useState("description");

  const reviews = product?.reviews || [];
  const tabs = [
    { id: "description", label: "Description" },
    { id: "sizing", label: "Sizing" },
    { id: "reviews", label: "Reviews" },
  ];


  const avgRating = product?.ratingStats?._avg?.rating || 0;
  const reviewCount = product?.ratingStats?._count?.id || 0;
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tabsRef = useRef([]);

  useEffect(() => {
    const index = tabs.findIndex((t) => t.id === tab);
    const el = tabsRef.current[index];

    if (el) {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [tab]);

  return (
    <div className=" text-white mt-16 px-10 max-w-7xl mx-auto ">

      {/* Tabs */}
      <div className="relative border-b border-white/10 mb-8">

        <div className="flex gap-8 relative">

          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabsRef.current[i] = el)}
              onClick={() => setTab(t.id)}
              className={`pb-3 text-sm uppercase tracking-wider transition
            ${tab === t.id
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              {t.label}
            </button>
          ))}

          {/* Animated indicator */}
          <span
            className="absolute bottom-0 h-[2px] bg-cyan-400 transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
          />

        </div>
      </div>

      {/* DESCRIPTION */}
      {tab === "description" && (
        <div className="space-y-6">

          <p className="text-gray-300 max-w-3xl">
            {description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <FeatureCard title="Fabric" value={fabric} />
            <FeatureCard title="Fit" value={fit} />
            <FeatureCard title="Print" value={print} />
            <FeatureCard title="Wash" value={wash} />

          </div>

        </div>
      )}

      {/* SIZING */}
      {tab === "sizing" && (
        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-3">Size</th>
                <th>Chest (in)</th>
                <th>Length (in)</th>
                <th>Shoulder (in)</th>
              </tr>
            </thead>

            <tbody>
              {sizing.map((s, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3 text-cyan-400 font-medium">
                    {s.size}
                  </td>
                  <td>{s.chest}</td>
                  <td>{s.length}</td>
                  <td>{s.shoulder}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    
{tab === "reviews" && (
  <div className="space-y-10">

    {/* rating summary */}
    <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-6">

      <div className="text-6xl font-bold tracking-tight">
        {avgRating.toFixed(1)}
      </div>

      <div className="flex flex-col gap-1">

        <Stars rating={Math.round(avgRating)} />

        <p className="text-gray-400 text-sm">
          {reviewCount} customer reviews
        </p>

      </div>

    </div>


    {/* NO REVIEWS UI */}
    {reviews.length === 0 && (
      <div className="flex flex-col items-center justify-center text-center py-16 border border-white/10 rounded-2xl bg-white/[0.02]">

        <ChatBubbleLeftRightIcon className="w-14 h-14 text-gray-500 mb-4"/>

        <h3 className="text-lg font-semibold">
          No reviews yet
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Be the first to review this product
        </p>

      </div>
    )}


    {/* review list */}
    {reviews.length > 0 && (
      <div className="space-y-5">

        {reviews.map((r) => (
          <div
            key={r.id}
            className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] transition"
          >

            {/* top */}
            <div className="flex justify-between items-start mb-3">

              <div>

                <p className="font-semibold text-white">
                  {r.customer.first_name} {r.customer.last_name || ""}
                </p>

                {r.is_verified && (
                  <div className="flex items-center gap-1 text-green-400 text-xs mt-1">

                    <CheckBadgeIcon className="w-4 h-4"/>

                    Verified Purchase

                  </div>
                )}

              </div>

              <Stars rating={r.rating} />

            </div>


            {/* review text */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {r.review}
            </p>


            {/* review images */}
            {r.review_images?.length > 0 && (
              <div className="flex gap-2 mt-4">

                {r.review_images.map((img, i) => (
                  <img
                    key={i}
                    src={img.image_url}
                    className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:scale-105 transition"
                  />
                ))}

              </div>
            )}

          </div>
        ))}

      </div>
    )}

  </div>
)}

    </div>
  );
}

function FeatureCard({ title, value }) {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">

      <p className="text-gray-400 text-xs uppercase mb-1">
        {title}
      </p>

      <p className="font-semibold">
        {value}
      </p>

    </div>
  );
}

