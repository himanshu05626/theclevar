"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";

export default function TopNavbarClient({isLoggedIn}) {
  const pathname = usePathname();

  const isQuickOrder = pathname.startsWith("/quick-order");

  // hide TopNavbar completely on quick-order
  if (isQuickOrder) return null;

  return <TopNavbar isLoggedIn={isLoggedIn} />;
}
