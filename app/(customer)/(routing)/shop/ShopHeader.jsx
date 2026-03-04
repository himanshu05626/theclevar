export default function ShopHeader({ count = 0 }) {
  return (
    <div className="relative mb-8 overflow-hidden  border border-white/10 bg-[#0b0b0b]">

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_60%)]" />

      {/* CONTENT */}
      <div className="relative py-16 text-center space-y-3">

        <p className="text-xs tracking-[0.25em] text-[#38bdf8] font-medium">
          BROWSE THE COLLECTION
        </p>

        <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-white">
          THE SHOP
        </h1>

        <p className="text-sm text-gray-400">
          {count} products found
        </p>
      </div>
    </div>
  );
}