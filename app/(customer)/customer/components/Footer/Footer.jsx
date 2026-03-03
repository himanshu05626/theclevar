"use client";

import Image from "next/image";
import pkg from "../../../../../package.json";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer({ category = [] }) {
  const filteredCategories = category.filter(
    (cat) => cat.slug !== "uncategorized"
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden">

      {/* 🔵 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div className="space-y-4">
            <Image
              src="/images/logo4.png"
              alt="The Clevar Logo"
              width={160}
              height={40}
              priority
            />

            <p className="text-sm text-gray-400 leading-relaxed">
              Premium Gen-Z fashion brand delivering quality-first apparel
              across India. Built for style, comfort & expression.
            </p>

            <p className="text-sky-400 font-medium text-sm">
              ✦ Never Compromise With Quality
            </p>

            <p className="text-xs text-gray-500">
              v{pkg.version}
            </p>
          </div>

          {/* GLASS CARD */}
          <FooterCard
            title="Categories"
            links={filteredCategories.map((cat) => ({
              label: cat.name,
              href: `/product-category/${cat.path || cat.slug}`,
            }))}
          />

          <FooterCard
            title="Explore"
            links={[
              { label: "New Arrivals", href: "/new-arrivals" },
              { label: "Trending", href: "/trending" },
              { label: "Best Sellers", href: "/best-sellers" },
              { label: "Customize Shirt", href: "/customize-shirt" },
            ]}
          />

          <FooterCard
            title="Support"
            links={[
              { label: "About Us", href: "/about-us" },
              { label: "Contact Us", href: "/contact-us" },
              { label: "Orders", href: "/my-account/orders" },
              { label: "My Account", href: "/my-account" },
            ]}
          />
        </div>

        {/* CONTACT STRIP */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-sm text-gray-300">
            📍 Varanasi, India • Pan India Delivery
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:info@theclevar.com" className="hover:text-sky-400">
              info@theclevar.com
            </a>
            <a href="tel:+91XXXXXXXXXX" className="hover:text-sky-400">
              +91 XXXXX XXXXX
            </a>
          </div>

          <Image
            src="/images/razorpay1.png"
            alt="Payment"
            width={150}
            height={20}
          />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center py-5 text-sm text-gray-500">
        © 2026 <span className="text-white font-medium">The Clevar</span> — Built by Mizna ✦
      </div>

    </footer>
  );
}

/* 🔹 CARD COMPONENT */
function FooterCard({ title, links = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 hover:border-sky-400/40 transition-all">

      <h4 className="mb-4 text-sm font-semibold text-white">
        {title}
      </h4>

      <ul className="space-y-2 text-sm text-gray-400">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="hover:text-sky-400 transition-all hover:translate-x-1 inline-block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}