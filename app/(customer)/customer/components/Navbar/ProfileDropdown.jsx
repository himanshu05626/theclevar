"use client";

import { useState } from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}   // desktop hover
      onMouseLeave={() => setOpen(false)} // desktop leave
    >
      
      {/* PROFILE BUTTON */}
      <div
        onClick={() => setOpen(!open)} // mobile click
        className="flex items-center gap-2 text-white hover:text-[#38bdf8] transition cursor-pointer"
      >
        <UserIcon className="w-6 h-6" />

        <span className="text-[14px] hidden md:block font-semibold">
          Profile
        </span>
      </div>

      {/* DROPDOWN */}
      <div
        className={`
          absolute -right-20 mt-3 w-64
          rounded-2xl
          backdrop-blur-xl
          border border-white/10
          bg-[#0f0f0f]/95
          shadow-[0_0_30px_rgba(14,165,233,0.15)]
          transition-all duration-300
          ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
        `}
      >
        {/* TOP SECTION */}
        <div className="p-4 border-b border-white/10">
          <p className="text-sm font-medium text-white">
            Hello User
          </p>
          <p className="text-xs text-gray-400">
            To access your theclevar account
          </p>
<Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
          <button className="
            mt-3 w-full py-2 rounded-lg
            bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]
            text-black font-semibold
            hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]
            transition cursor-pointer
          ">
            Sign Up / Log In
          </button>
          </Link>

        </div>

        {/* MENU ITEMS */}
        <Link
          href="/orders"
          className="
            block px-4 py-3 text-sm text-gray-300
            hover:bg-white/5 hover:text-[#38bdf8]
            transition
          "
        >
          My Orders
        </Link>

        <button
          className="
            block w-full text-left px-4 py-3 text-sm
            text-red-400
            hover:bg-red-500/10 hover:text-red-300
            transition
          "
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}