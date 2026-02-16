"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin({adminToken}) {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     const res = await fetch("/admin/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await res.json();

if (!res.ok) {
  throw new Error(data.message || "Login failed");
}

// ✅ store in localStorage
localStorage.setItem("userEmail", data.user.email);
localStorage.setItem("userName", data.user.name);

console.log("Login success:", data);


      // ✅ NO localStorage
      // ✅ Cookie already set by server
      router.replace("/admin/dashboard");
      router.refresh(); // ensures SSR auth state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
  if(adminToken){
      router.replace("/admin/dashboard");
    
  }

},[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-8">

        {/* ================= LOGO ================= */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-56 relative">
            <Image
              src="/images/logo4.png"
              alt="The Clevar Admin Logo"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          <div className="text-2xl font-semibold text-slate-800">
            The Clevar Admin
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Secure administrative access
          </p>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              // type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theclevar.com"
              className="w-full rounded border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-800 placeholder-slate-400 outline-none transition
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-800 placeholder-slate-400 outline-none transition
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded bg-blue-600 py-2.5 text-sm font-semibold text-white transition
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* ================= FOOTER ================= */}
        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} The Clevar. All rights reserved.
        </p>
      </div>
    </div>
  );
}
