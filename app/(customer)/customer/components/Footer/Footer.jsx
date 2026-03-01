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
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<footer className="bg-gradient-to-b 
from-[#020617] 
to-black 
border-t border-white/10">


      {/* TOP FOOTER */}
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-6">
          
          {/* LOGO + BRAND TEXT */}
          <div className="md:col-span-2 pr-6 md:border-r md:border-white/10">
            <Image
              src="/images/logo4.png"
              alt="The Clevar Logo"
              width={180}
              height={40}
              priority
            />

            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300">
              The Clevar is a modern fashion brand delivering premium quality
              T-shirts and shirts across Pan India. We never compromise on
              fabric, fit, or finish — and offer custom design shirts tailored
              to your unique style.
            </p>

            <p className="mt-3 text-sm text-sky-400 font-medium">
              “Never Compromise With Quality.”
            </p>

            <p className="mt-3 text-xs text-gray-500">
              Version {pkg.version}
            </p>
          </div>

          {/* CATEGORIES */}
          <FooterColumn
            title="Categories"
            links={filteredCategories.map((cat) => ({
              label: cat.name,
              href: `/product-category/${cat.path || cat.slug}`,
            }))}
          />

          {/* INFORMATION */}
          <FooterColumn
            title="Information"
            links={[
              { label: "About Us", href: "/about-us" },
              { label: "Contact Us", href: "/contact-us" },
              { label: "My Account", href: "/my-account" },
              { label: "Orders", href: "/my-account/orders" },
            ]}
          />

          {/* QUICK LINKS */}
          <FooterColumn
            title="Quick Links"
            links={[
              { label: "Customize Shirt", href: "/customize-shirt" },
              { label: "New Arrivals", href: "/new-arrivals" },
              { label: "Trending Designs", href: "/trending" },
              { label: "Best Sellers", href: "/best-sellers" },
            ]}
          />

          {/* CONTACT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white">
              Contact Us
            </h4>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                Varanasi, Uttar Pradesh <br />
                India – Pan India Delivery
              </li>

              <li>
                <a
                  href="mailto:support@theclevar.com"
                  className="hover:text-sky-400"
                >
                  info@theclevar.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-sky-400"
                >
                  +91 XXXXX XXXXX
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SCROLL TO TOP */}
        <button
          onClick={scrollToTop}
          className={`
            fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center
            rounded-full border border-white/20 bg-white/10 text-white
            backdrop-blur-md shadow-lg
            transition-all duration-300
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }
            hover:bg-sky-500
          `}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#070B14]">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between px-6 py-4 text-sm text-gray-400 gap-2 md:gap-0">
          
          <p>
            © 2026 <span className="font-semibold text-white">The Clevar</span>.  
            All Rights Reserved. MOHD 
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs">
              Secure Payments • UPI • Cards • Net Banking
            </span>

            <Image
              src="/images/PayPal.png"
              alt="Payment Methods"
              width={80}
              height={20}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* REUSABLE COLUMN */
function FooterColumn({ title, links = [] }) {
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold tracking-wide text-white">
        {title}
      </h4>

      <ul className="space-y-2 text-sm text-gray-300">
        {links.map((link, i) => (
          <li key={i}>
            {link.href ? (
              <Link
                href={link.href}
                className="hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <span className="cursor-pointer hover:text-sky-400">
                {link.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
