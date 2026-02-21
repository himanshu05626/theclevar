import Link from "next/link";

export default function LetsWorkTogether() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f0f] py-20">

      {/* 🔥 Glow Background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#38bdf8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#0ea5e9]/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        {/* HEADING */}
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
          Design Your Perfect Fit
        </h2>

        {/* SUBTEXT */}
        <p className="mx-auto mt-5 max-w-2xl text-xs md:text-base leading-relaxed text-gray-400">
          From concept to stitch — we craft outfits tailored to your style.
          <br />
          Whether it’s custom dresses, bulk orders, or unique designs,
          we bring your vision to life with precision and speed.
        </p>

        {/* CTA */}
        <Link
          href="/contact-us"
          className="group mt-10 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]"
        >
          Start Your Custom Order

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        {/* OPTIONAL SMALL TRUST LINE */}
        <p className="mt-6 text-xs text-gray-500">
          Premium fabrics • Custom sizing • Fast delivery
        </p>

      </div>
    </section>
  );
}