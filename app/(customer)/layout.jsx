import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

import TopNavbar from "./customer/components/Navbar/TopNavbar";
import BNavbar from "./customer/components/Navbar/BNavbar";
import Footer from "./customer/components/Footer/Footer";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ToastProvider } from "../admin/context/ToastProvider";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../component/CartDrawer";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import TopNavbarClient from "./customer/components/Navbar/TopNavbarClient";
import { requireUser } from "@/lib/requireUser";
import { clientFetch } from "@/lib/clientFetch";

/* =========================
   FONTS
========================= */

// ✅ PRIMARY UI FONT
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ✅ OPTIONAL (if used anywhere)
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/* =========================
   METADATA
========================= */

export const metadata = {
  metadataBase: new URL("https://theclevar.com"),

 title: {
  default: "The Clevar | Custom Dresses & Premium Fashion",
  template: "%s | The Clevar",
},

  description:
    "The Clevar provides advanced custom dresses and premium fashion solutions across India. Trusted, reliable, and professional services.",

  applicationName: "The Clevar",

  keywords: [
    "The Clevar",
    "Custom Dresses ",
    "Premium Fashion",
    "theclevar",
    "Fashion Company",
  ],

  authors: [{ name: "The Clevar" }],
  creator: "The Clevar",


  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },

  openGraph: {
    title: "The Clevar | Custom Dresses & Premium Fashion",
    description:
      "Professional custom dresses and premium fashion solutions across India.",
    url: "https://theclevar.com",
    siteName: "The Clevar",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================
   ROOT LAYOUT
========================= */

  let category = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/first-categories`, {
      cache: "no-store",
    });

    // Check if response is okay before parsing JSON
    if (res.ok) {
      category = await res.json();
    } else {
      console.error("Failed to fetch categories:", res.status);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

export default async function RootLayout({ children }) {

  const isLoggedIn = await requireUser();

  return (
    <html lang="en" className="mobile_mode">
      <body
        className={`
          ${poppins.className}
          ${inter.className}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased 
        bg-black
        `}
      >
        <CartProvider isLoggedIn={isLoggedIn}>
          <BNavbar isLoggedIn={isLoggedIn} />

          <ToastProvider>
            <CartDrawer isLoggedIn={isLoggedIn} />
            <NextTopLoader showSpinner={false} />
            <div className="">
              {children}</div>
          </ToastProvider>

          <Footer category={category} />
        </CartProvider>
      </body>
    </html>
  );
}
