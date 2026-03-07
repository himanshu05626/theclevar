export default function LoadingCheckout() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      {/* BACK */}
      <div className="mb-4 h-4 w-28 bg-white/10 rounded animate-pulse" />

      {/* TITLE */}
      <div className="flex justify-center mb-6">
        <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center gap-6 mb-8">

        {[1,2,3].map((step)=>(
          <div key={step} className="flex items-center gap-2">

            <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse" />

            <div className="h-3 w-16 bg-white/10 rounded animate-pulse hidden sm:block"/>

            {step !== 3 && (
              <div className="w-20 h-[1px] bg-white/10 hidden md:block"/>
            )}

          </div>
        ))}

      </div>


      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* LEFT */}
        <div className="lg:col-span-2">

          <div className="rounded-xl border border-white/10 bg-[#111] p-6">

            {/* TITLE */}
            <div className="h-4 w-56 bg-white/10 rounded animate-pulse mb-6"/>

            {/* ADDRESS CARD */}
            <div className="border border-white/10 rounded-lg p-4 mb-6">

              <div className="flex justify-between items-center">

                <div className="space-y-2 w-full">

                  <div className="h-4 w-40 bg-white/10 rounded animate-pulse"/>

                  <div className="h-3 w-56 bg-white/10 rounded animate-pulse"/>

                  <div className="h-3 w-48 bg-white/10 rounded animate-pulse"/>

                </div>

                <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse"/>
              </div>

            </div>

            {/* BUTTON */}
            <div className="h-12 w-full bg-cyan-400/30 rounded-lg animate-pulse"/>

          </div>

        </div>


        {/* RIGHT PRICE */}
        <div>

          <div className="rounded-xl border border-white/10 bg-[#111] p-6">

            {/* TITLE */}
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-6"/>

            {/* SUBTOTAL */}
            <div className="flex justify-between mb-3">
              <div className="h-3 w-28 bg-white/10 rounded animate-pulse"/>
              <div className="h-3 w-16 bg-white/10 rounded animate-pulse"/>
            </div>

            {/* SHIPPING */}
            <div className="flex justify-between mb-4">
              <div className="h-3 w-20 bg-white/10 rounded animate-pulse"/>
              <div className="h-3 w-10 bg-white/10 rounded animate-pulse"/>
            </div>

            <div className="border-t border-white/10 my-4"/>

            {/* TOTAL */}
            <div className="flex justify-between mb-6">
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse"/>
              <div className="h-4 w-20 bg-cyan-400/40 rounded animate-pulse"/>
            </div>

            {/* SECURITY BADGE */}
            <div className="h-10 w-full bg-green-400/20 rounded-lg animate-pulse"/>

          </div>

        </div>

      </div>

    </div>
  );
}