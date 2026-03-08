"use client";

import Image from "next/image";
import Link from "next/link";
import pkg from "../../../../../package.json";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Footer({ category = [] }) {
  const filteredCategories = category.filter(
    (cat) => cat.slug !== "uncategorized"
  );

  return (
    <footer className="bg-black text-gray-400 border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo4.png"
                alt="The Clevar"
                width={140}
                height={40}
              />
            </div>

            <p className="text-sm leading-relaxed mb-6">
              Premium Gen-Z fashion redefining the street culture.
              Built for the bold. Designed for expression.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="border border-white/20 p-2 hover:border-cyan-400 hover:text-cyan-400 transition">
                IG
              </a>
              <a href="#" className="border border-white/20 p-2 hover:border-cyan-400 hover:text-cyan-400 transition">
                TW
              </a>
              <a href="#" className="border border-white/20 p-2 hover:border-cyan-400 hover:text-cyan-400 transition">
                YT
              </a>
            </div>

            <p className="text-xs text-gray-600 mt-6">
              v{pkg.version}
            </p>
          </div>

          {/* SHOP */}
          <FooterColumn
            title="SHOP"
            links={filteredCategories.map((cat) => ({
              label: cat.name,
              href: `/product-category/${cat.path || cat.slug}`,
            }))}
          />

          {/* SUPPORT */}
          <FooterColumn
            title="SUPPORT"
            links={[
              { label: "Sizing Guide", href: "/size-guide" },
              { label: "Shipping Info", href: "/shipping" },
              { label: "Returns & Exchanges", href: "/returns" },
              { label: "Track Order", href: "/track-order" },
              { label: "Contact Us", href: "/contact-us" },
            ]}
          />

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              JOIN THE SIGNAL
            </h4>

            <p className="text-sm mb-6">
              Get early access to drops, exclusive discounts,
              and street energy straight to your inbox.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-black border border-white/20 px-4 py-2 text-sm focus:outline-none focus:border-cyan-400"
              />
              <button className="bg-cyan-400 text-black px-4 hover:bg-cyan-300 transition">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">

 <p className="text-center">
  © 2026 The Clevar. All Rights Reserved. 
  Developed & Designed by{" "}
  <a href="https://www.mizna.me/" target="_blank" rel="noopener noreferrer">
    Mohd Mizna Ansari
  </a>
</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-cyan-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cyan-400">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-cyan-400">
              Cookies
            </Link>
          </div>

          <p className="text-gray-500 flex gap-2">
            MADE WITH <span className="text-red-500"><HeartIcon height={20} /></span> FOR THE CULTURE
          </p>
        </div>
      </div>
    </footer>
  );
}


/* COLUMN COMPONENT */
function FooterColumn({ title, links = [] }) {
  return (
    <div>
      <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
        {title}
      </h4>

      <ul className="space-y-3 text-sm">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="hover:text-cyan-400 transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}