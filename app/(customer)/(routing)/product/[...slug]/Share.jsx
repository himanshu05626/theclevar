"use client";

import { ShareIcon } from "@heroicons/react/24/outline";

export default function ShareButton({ product }) {
  const handleShare = async () => {
    const shareData = {
      title: product?.title || "Check this product",
      text: product?.description || "Have a look at this!",
      url: window.location.href,
    };

    try {
      // Native share (mobile / supported browsers)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard ✅");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <p
      onClick={handleShare}
      className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white transition"
    >
      <ShareIcon className="w-4 h-4" />
      Share this product
    </p>
  );
}