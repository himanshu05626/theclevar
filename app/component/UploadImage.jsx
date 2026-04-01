"use client";

import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function UploadImage({
  uploadType = "productImage",
  onSuccess,
  onRemove,
}) {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", uploadType);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error("Upload failed");
        }

        uploadedUrls.push(data.imageUrl);
      }

      setImageUrls((prev) => {
        const updated = [...prev, ...uploadedUrls];
        onSuccess?.(uploadedUrls);
        return updated;
      });

      // reset input
      e.target.value = "";
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
   <label
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg 
      bg-indigo-600 text-white text-sm font-medium 
      hover:bg-indigo-700 transition 
      cursor-pointer
      ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <ArrowUpTrayIcon className="w-5 h-5" />
      Upload Images

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={loading}
        className="hidden"
      />
    </label>
      {loading && (
        <p className="text-sm text-gray-500">Uploading...</p>
      )}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative h-32 w-32 overflow-hidden rounded border">
              <img
                src={url}
                alt={`Uploaded ${i}`}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                aria-label={`Remove uploaded image ${i + 1}`}
                onClick={() => {
                  setImageUrls((prev) => prev.filter((_, index) => index !== i));
                  onRemove?.(url);
                }}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
