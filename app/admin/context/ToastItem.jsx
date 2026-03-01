"use client";

import {
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function ToastItem({ toast, onClose }) {
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`relative w-80 rounded-xl p-[1px]
      ${isSuccess
        ? "bg-gradient-to-r from-[#0ea5e9]/40 to-[#38bdf8]/40"
        : "bg-gradient-to-r from-red-500/40 to-red-400/40"}
      animate-slide-in`}
    >
      {/* INNER CARD */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl
        bg-[#0f0f0f]/90 backdrop-blur-xl
        border border-white/10
        shadow-[0_0_25px_rgba(0,0,0,0.6)]"
      >
        {/* ICON */}
        <div
          className={`h-9 w-9 flex items-center justify-center rounded-full
          ${isSuccess
            ? "bg-[#0ea5e9]/20 text-[#38bdf8] shadow-[0_0_15px_rgba(14,165,233,0.5)]"
            : "bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"}
        `}
        >
          {isSuccess ? (
            <CheckBadgeIcon className="h-5 w-5" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5" />
          )}
        </div>

        {/* TEXT */}
        <div className="flex-1">
          <p
            className={`text-sm font-semibold tracking-wide
            ${isSuccess ? "text-[#38bdf8]" : "text-red-400"}`}
          >
            {isSuccess ? "Success" : "Error"}
          </p>

          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/10 transition"
        >
          <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}