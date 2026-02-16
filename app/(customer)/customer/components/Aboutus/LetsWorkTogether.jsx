import Link from "next/link";

export default function LetsWorkTogether() {
  return (
    <section className="bg-[#0f0f0f] py-20">

      <div className="mx-auto max-w-5xl px-6">

        <div
          className="
            relative overflow-hidden
            rounded-2xl
            border border-gray-800
            bg-gradient-to-r from-[#0D1117] to-[#111827]
            p-10 text-center
            shadow-[0_10px_50px_rgba(0,0,0,0.9)]
          "
        >

          {/* Glow Accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-sky-500/10" />

          {/* CONTENT */}
          <div className="relative z-10 text-white">

            {/* HEADING */}
            <h2 className="text-2xl font-bold md:text-3xl">
              Let’s Work <span className="text-sky-400">Together</span>
            </h2>

            {/* SUBTEXT */}
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
              Need a quote? Working on a project? Just have a few questions?
              <br />
              Get in touch today — we’re here to help you find the right
              products, fast.
            </p>

            {/* BUTTON */}
            <Link
              href="/contact-us"
              className="
                mt-8 inline-flex items-center gap-2
                rounded-lg bg-sky-500
                px-7 py-3 text-sm font-semibold text-white
                shadow-[0_0_25px_rgba(14,165,233,0.6)]
                transition hover:bg-sky-400
              "
            >
              Contact Us →
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
