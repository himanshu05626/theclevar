import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto 
                        bg-gradient-to-r 
                        from-[#0f0f0f] 
                        via-[#1a1a1a] 
                        to-[#111827]">

      <div className="px-0 pr-0 py-0">
        <div className="relative py-20">

          {/* LEFT CONTENT */}
          <div className="mx-5 md:ml-20 z-90" style={{ zIndex: 9999 }}>

            {/* HEADING */}
            <div className="text-4xl font-semibold leading-tight 
                            text-white md:text-5xl">
              Wear Your Style V1 <br />
              <span className="text-sky-400">Designed by You</span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed 
                          text-gray-300">
              Discover premium T-shirts and shirts crafted for comfort
              and street-ready style. Customize your own designs with
              The Clevar — because we never compromise with quality and
              always follow the latest trends.
            </p>

            {/* CTA BUTTON */}
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl
                         bg-sky-500/90 px-7 py-3 text-sm font-medium
                         text-white backdrop-blur-md
                         transition-all duration-300
                         hover:bg-sky-400 hover:shadow-lg
                         hover:shadow-sky-500/30"
            >
              Shop Now
              <span className="text-lg">→</span>
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="absolute top-0 right-0 flex justify-center md:justify-end">
            <Image
              src="/model/mode4.png"
              alt="Customizable shirts by The Clevar"
              width={700}
              height={400}
              priority
              className="w-full h-150 srounded hidden md:block 
                         -scale-x-100 opacity-95 
                         drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
