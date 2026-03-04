import {
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export default function ServiceHighlights() {
  const items = [
    {
      icon: TruckIcon,
      title: "FREE SHIPPING",
      desc: "On orders above ₹999",
      color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    },
    {
      icon: ShieldCheckIcon,
      title: "PREMIUM QUALITY",
      desc: "240–380 GSM fabrics",
      color: "text-pink-400 border-pink-400/30 bg-pink-400/10",
    },
    {
      icon: ArrowPathIcon,
      title: "7-DAY RETURNS",
      desc: "Hassle-free returns",
      color: "text-green-400 border-green-400/30 bg-green-400/10",
    },
    {
      icon: BoltIcon,
      title: "FAST PRINTS",
      desc: "5–7 day custom delivery",
      color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    },
  ];

  return (
    <section className=" py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i} className="flex flex-col items-center">

                {/* ICON BOX */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* TITLE */}
                <h4 className="mt-4 text-white text-sm tracking-widest font-semibold">
                  {item.title}
                </h4>

                {/* DESCRIPTION */}
                <p className="text-gray-400 text-sm mt-1">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}