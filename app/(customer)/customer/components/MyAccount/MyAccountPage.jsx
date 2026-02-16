"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      console.log('data',data)
      localStorage.setItem("userName", data.user.name);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#0f0f0f] to-[#111827]">

      {/* LEFT BRAND PANEL */}
      <div className="
        hidden lg:flex w-1/2 pt-32 justify-center
        
        text-white p-12
      ">
        <div className="max-w-md">
          <Image
            src="/images/logo4.png"
            alt="The Clevar"
            width={480}
            height={80}
            priority
          />

          <h2 className="mt-6 text-3xl font-semibold">
            Welcome Back to{" "}
            <span className="text-[#38bdf8]">The Clevar</span>
          </h2>

          <p className="mt-4 text-[#d1d5db] text-sm leading-relaxed">
            Premium fashion. Custom shirts. Trend-driven designs.
            We never compromise on quality — crafted to match
            your unique style.
          </p>

          <p className="mt-4 text-[#38bdf8] text-sm font-medium">
            Pan India Delivery Available 🇮🇳
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex w-full
      
      lg:w-1/2  justify-center pt-22 ">

        <div className="
          w-full max-w-md
          rounded-2xl 
        ">

          {/* Logo */}
          <Image
            src="/images/logo4.png"
            alt="The Clevar"
            width={140}
            height={60}
            priority
            className="w-[120px] pb-6"
          />

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-white mb-1">
            Login to Your Account
          </h1>

          <p className="text-sm text-[#9ca3af] mb-6">
            Access your orders, wishlist & custom designs
          </p>

          {/* Error */}
          {error && (
            <div className="
              mb-4 rounded-lg
              bg-red-500/10
              border border-red-500/30
              p-3 text-sm text-red-400
            ">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-[#d1d5db]">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="
                  w-full mt-1 rounded-lg
                  border border-white/10
                  bg-[#1a1a1a]
                  px-3 py-2 text-white
                  outline-none
                  focus:border-[#38bdf8]
                  focus:ring-1 focus:ring-[#38bdf8]
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[#d1d5db]">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className="
                  w-full mt-1 rounded-lg
                  border border-white/10
                  bg-[#1a1a1a]
                  px-3 py-2 text-white
                  outline-none
                  focus:border-[#38bdf8]
                  focus:ring-1 focus:ring-[#38bdf8]
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-lg
                bg-[#0ea5e9]
                py-2.5 font-semibold text-white
                shadow-[0_0_20px_rgba(14,165,233,0.35)]
                hover:bg-[#38bdf8]
                transition disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-[#9ca3af] pt-4">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="
                font-semibold
                text-[#38bdf8]
                hover:text-[#7dd3fc]
                hover:underline
                underline-offset-4
              "
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
