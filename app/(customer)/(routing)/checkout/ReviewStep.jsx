export default function ReviewStep({ cartData, onNext, onBack }) {

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-6">
        REVIEW YOUR ORDER
      </h2>

      <div className="space-y-4">

        {cartData.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-4 border border-white/10 rounded-xl p-4"
          >

            <img
              src={item.product.images?.[0]?.image_url}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">

              <p className="font-semibold">
                {item.product.name}
              </p>

              <p className="text-sm text-gray-400">
                Size: {item.product.size}
              </p>

            </div>

            <div className="text-cyan-400 font-semibold">
              ₹{item.product.price}
            </div>

          </div>

        ))}

      </div>

      <button
        onClick={onNext}
        className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg"
      >
        CONTINUE TO PAYMENT
      </button>

    </div>
  );
}