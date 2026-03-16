import { useState } from "react";

export function ReviewModal({ item, close }) {

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    const res = await fetch("/api/review/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: item.product_list_id,
        rating,
        review,
      }),
    });

    const json = await res.json();

    setLoading(false);

    if (res.ok) {
      alert("Review submitted");
      close();
    } else {
      alert(json.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#151515] border border-white/10 rounded-xl p-6 w-[420px]">

        {/* PRODUCT */}
        <div className="flex gap-3 items-center mb-4">
     <img
  src={
    item.product?.images?.[0]?.image_url ||
    "/images/not-found.png"
  }
  alt=""
  width="60"
  height="60"
  className="rounded object-cover"
/>

          <p className="font-semibold">{item.product_title}</p>
        </div>

        {/* STARS */}
        <div className="flex gap-2 text-2xl mb-4">
          {[1,2,3,4,5].map((star)=>(
            <button
              key={star}
              onClick={()=>setRating(star)}
            >
              {star <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        {/* REVIEW */}
        <textarea
          placeholder="Write review (optional)"
          value={review}
          onChange={(e)=>setReview(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-white/10 rounded p-2 text-sm"
          rows={4}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={close}
            className="text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={submitReview}
            disabled={!rating || loading}
            className="bg-[#38bdf8] text-black px-4 py-1 rounded"
          >
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}