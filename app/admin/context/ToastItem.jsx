"use client";

import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function ToastItem({ toast, onClose }) {
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`
        w-80 rounded border shadow-lg p-4 flex gap-3 items-center
        animate-slide-in
        ${isSuccess
          ? "bg-blue-50 border-blue-200"
          : "bg-red-50 border-red-200"}
      `}
    >
   <div
  className={`
    h-8 w-8 flex items-center justify-center rounded-full text-white
    ${isSuccess ? "bg-blue-600" : "bg-red-600"}
  `}
>
  {isSuccess ? (
    <CheckBadgeIcon className="h-6 w-6" />  // ✅ Set explicit size
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6" // ✅ Also set size here
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )}
</div>


      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">
          {isSuccess ? "Success" : "Error"}
        </p>
        <p className="text-sm text-gray-600">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
}
