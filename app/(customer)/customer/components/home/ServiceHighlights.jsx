import { MapIcon, PresentationChartBarIcon, TruckIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ServiceHighlights() {
  return (
    <section className="bg-gradient-to-r from-[#0f0f0f] to-[#111827] py-12">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-10 md:grid-cols-5">

          {/* ITEM 1 */}
          <div className="flex flex-col items-center text-center">

           <TruckIcon color="white" className="h-10 w-10 mb-2" />

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

           <MapIcon color="white" className="h-10 w-10 mb-2"/>

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

           <UserIcon color="white" className="h-10 w-10 mb-2" />
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
