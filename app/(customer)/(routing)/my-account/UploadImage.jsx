"use client";

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function UploadImage({
  uploadType = "productImage",
  onSuccess,
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
        onSuccess?.(updated); // ✅ RETURN ALL URLS
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
  bg-[#111]
  border border-cyan-400/40
  text-cyan-300 text-sm font-medium
  shadow-[0_0_10px_rgba(6,182,212,0.25)]
  hover:bg-cyan-500/10
  hover:border-cyan-400
  hover:text-white
  hover:shadow-[0_0_18px_rgba(6,182,212,0.55)]
  transition-all duration-200
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

      {/* PREVIEW GRID */}
      {/* {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Uploaded ${i}`}
              className="w-32 h-32 object-cover rounded border"
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
