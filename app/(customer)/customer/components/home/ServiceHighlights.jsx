import Image from "next/image";

export default function ServiceHighlights() {
  return (
    <section className="bg-gradient-to-r from-[#0f0f0f] to-[#111827] py-12">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-10 md:grid-cols-5">

          {/* ITEM 1 */}
          <div className="flex flex-col items-center text-center">

            <Image
              src="/icons/delivery-box.svg"
              alt="Fast Dispatch"
              width={42}
              height={42}
              className="mb-3 opacity-90"
            />

            <h4 className="font-semibold text-white">
              Fast Dispatch
            </h4>

            <p className="mt-1 text-sm text-gray-300">
              Ready to ship with quick processing
            </p>

          </div>

          {/* DIVIDER */}
          <div className="hidden md:flex justify-center">
            <div className="h-14 w-[1px] bg-gradient-to-b from-transparent via-sky-500 to-transparent opacity-60" />
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center text-center">

            <Image
              src="/icons/australia-wise.svg"
              alt="PAN India Delivery"
              width={42}
              height={42}
              className="mb-3 opacity-90"
            />

            <h4 className="font-semibold text-white">
              PAN India Delivery
            </h4>

            <p className="mt-1 text-sm text-gray-300">
              Fast & reliable shipping across India
            </p>

          </div>

          {/* DIVIDER */}
          <div className="hidden md:flex justify-center">
            <div className="h-14 w-[1px] bg-gradient-to-b from-transparent via-sky-500 to-transparent opacity-60" />
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center text-center">

            <svg
              className="mb-3 h-10 w-10 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0113 0" />
            </svg>

            <h4 className="font-semibold text-white">
              Friendly Support
            </h4>

            <p className="mt-1 text-sm text-gray-300">
              We’re here to help anytime
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}
