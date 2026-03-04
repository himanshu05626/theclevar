"use client";

export default function AnnouncementBar() {
  const text =
    "FREE SHIPPING ABOVE ₹999 ★ CUSTOM PRINTS ★ PREMIUM QUALITY ★ 7-DAY RETURNS ★ NEW DROPS WEEKLY ★";

  return (
    <div className="w-full overflow-hidden bg-cyan-400 text-black text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em]">
      
      <div className="flex w-max whitespace-nowrap animate-marquee py-2">
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
      </div>

    </div>
  );
}