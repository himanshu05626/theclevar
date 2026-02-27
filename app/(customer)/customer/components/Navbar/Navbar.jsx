"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, CartIcon } from "./Icons";
// import { menuData } from "./menuData";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { clientFetch } from "@/lib/clientFetch";
import { useRef } from "react";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Navbar({ menuData = [], isLoggedIn }) {

  const pathname = usePathname();
  const isQuickOrder = pathname.startsWith("/quick-order");


  const { setOpen, cartItems } = useCart();
  const router = useRouter();
  const [openNewMenu, setOpenNewMenu] = useState(null);

  const [openLeft, setOpenLeft] = useState(false);
  const level3Ref = useRef(null);


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setMenuOpen] = useState({});

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [drawerOpen]);

  const toggle = (key) => {
    setMenuOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = (path) => {
    if (path) {
      router.push(path);
      setDrawerOpen(false);
      // setOpen({});
    }
  };


  // DESKTOP ACCORDION (LEVEL 3 → LEVEL 4)
  const [openL3, setOpenL3] = useState(null);

  const toggleL3 = (key) => {
    setOpenL3((prev) => (prev === key ? null : key));
  };

  // Alias to keep naming consistent
  const handleNavigate = navigate;
  const [topPosition, setTopPosition] = useState(132);
  useEffect(() => {
    console.log('topPosition', topPosition)
  }, [topPosition])

  useEffect(() => {


    function handleScroll() {
      if (window.scrollY > 50) {
        setTopPosition(58);
      } else {
        setTopPosition(105);
      }
    }

    // Initial set
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (isQuickOrder) {


    return (
      <nav className="md:sticky top-0 z-20 w-full bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">

          {/* ROW 1: LOGO + ICONS */}
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo4.png"
                alt="The Clevar"
                width={140}
                height={60}
                priority
                className="w-[110px] sm:w-[130px] md:w-[140px]"
              />
            </Link>
            <ul
              className="
              flex items-center justify-center
              gap-6
              text-sm font-medium
              whitespace-nowrap
              md:flex-wrap hidden md:flex
            "
            >
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-200 hover:text-sky-400 transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-200 hover:text-sky-400 transition"
                >
                  Contact Us
                </Link>
              </li>
              {isLoggedIn === null && (
                <li>
                  <Link
                    href="/auth/login?redirect=/quick-order"

                    className="text-gray-200 hover:text-sky-400 transition"
                  >
                    Login/Signup
                  </Link>
                </li>
              )}

            </ul>
            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* WISHLIST */}
              <Link
                href="/my-account/wishlist"
                className="flex items-center gap-2 text-white hover:text-gray-700"
              >
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className=" text-sm font-semibold">
                  Wishlist
                </span>
              </Link>
              <Divider />
              {/* CART */}
              <button
                onClick={() => setOpen(true)}
                className="relative flex items-center gap-2 cursor-pointer text-white hover:text-gray-700"
                aria-label="Open cart"
              >
                <div className="relative">
                  <Image
                    src="/images/page/Navbar/bag.svg"
                    alt="Cart"
                    width={26}
                    height={26}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />

                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-white">
                      {cartItems.length}
                    </span>
                  )}
                </div>

                <span className="text-sm font-semibold">
                  Cart
                </span>
              </button>
            </div>
          </div>

          {/* ROW 2: ABOUT / CONTACT */}
          <div className="mt-3 md:hidden flex justify-center">
            <ul
              className="
              flex items-center justify-center
              gap-6
              text-sm font-medium
              whitespace-nowrap
              md:flex-wrap
            "
            >
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-200 hover:text-sky-400 transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-200 hover:text-sky-400 transition"
                >
                  Contact Us
                </Link>
              </li>
              {isLoggedIn === null && (
                <li>
                  <Link
                    href="/auth/login?redirect=/quick-order"

                    className="text-gray-200 hover:text-sky-400 transition"
                  >
                    Login/Signup
                  </Link>
                </li>
              )}
            </ul>
          </div>

        </div>
      </nav>
    );

  }


  return (
    <nav
      className="sticky top-0 z-10 w-full
             bg-gradient-to-r
             from-[#0f0f0f]
             via-[#1a1a1a]
             to-[#111827]
             border-b border-white/10
             shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
    >

      {/* ================= TOP BAR ================= */}
      <div className="mx-auto max-w-7xl  px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/images/logo4.png" alt="The Clevar" width={140} height={60} />
        </div>


        {/* ================= DESKTOP MENU ================= */}
        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden lg:flex gap-8 px-6  font-medium">
          {Array.isArray(menuData) &&
            menuData.map((menu, index) => {

              const columnCount = Array.isArray(menu.children) ? menu.children.length : 0;
              // console.log('columnCount', columnCount, menu.children)

              const widthClass =
                columnCount >= 4
                  ? "!max-w-6xl bg-black"
                  : columnCount === 5
                    ? "!max-w-5xl bg-black"
                    : columnCount === 2
                      ? "!max-w-[1000px] "
                      : "!max-w-[1000px]";

              const gridColsClass =
                columnCount === 8
                  ? "col-span-4 columns-4 overflow-hidden gap-0 striped-cols [column-fill:auto] max-h-[400px]"
                  : columnCount === 6
                    ? "col-span-4 columns-4 gap-0 overflow-hidden striped-cols [column-fill:auto] max-h-[400px]"
                    : columnCount === 4
                      ? "col-span-4 columns-4 gap-0 striped-cols [column-fill:auto] max-h-[380px]"
                      : columnCount === 2
                        ? "col-span-1 columns-1 gap-0 [column-fill:auto] max-h-[300px]"
                        : "col-span-1 columns-1 gap-0 overflow-hidden [column-fill:auto] max-h-[320px]";

              return (
                <li
                  key={menu.title}
                  className="relative"
                  onMouseEnter={() => setOpenNewMenu(menu.title)}
                  onMouseLeave={() => setOpenNewMenu(null)}
                >
                  <div className={`
    flex items-center gap-1
    cursor-pointer
    
    transition-colors
    ${openNewMenu === menu.title
                      ? "text-sky-600"
                      : "text-gray-200 hover:text-sky-400"
                    }
  `}>
                    <Link href={menu.path} className="flex items-center gap-1">
                      {menu.title}
                    </Link>
                    {menu.children && <ChevronDown size={16} />}
                  </div>


                  {/* MEGA MENU */}
                  <div
                    style={{ top: topPosition }}
                    className={`fixed left-1/2 -translate-x-1/2 z-50
                  transition-all duration-200
                  ${widthClass}
                  ${openNewMenu === menu.title
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                      }
                      
                      `}

                  >
                    <div className="bg-[#0f0f0f]
border-t border-white/10
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
backdrop-blur-xl

 rounded p-6 flex gap-6 !m-0 !p-0">

                      {/* LEFT CONTENT */}
                      {/* <div className={`col-span-4 grid ${gridColsClass}  overflow-hidden gap-0 p-0 !m-0 striped-cols `}> */}
                      <div className={`${gridColsClass}   `}>


                        {Array.isArray(menu.children) &&
                          menu.children.map((lvl2) => (

                            <div key={lvl2.title} className="p-6 !min-w-[200px] break-inside-avoid">
                              <h4 className="font-semibold mb-3 text-white ">
                                <Link href={lvl2.path} className="flex items-center gap-1">

                                  {lvl2.title}
                                </Link>
                              </h4>

                              <ul className="space-y-2">
                                {lvl2.children?.map((lvl3) => (
                                  <li
                                    key={lvl3.title}
                                    className="relative group text-sm text-gray-400 hover:text-sky-400 flex justify-between items-center cursor-pointer"
                                  >
                                    <Link href={lvl3.path} className="flex justify-between items-center w-full">
                                      {lvl3.title}
                                      {lvl3.children && <ChevronRight size={14} />}
                                    </Link>

                                    {/* LEVEL 4 */}
                                    {lvl3.children && (
                                      <ul

                                        className="absolute left-full top-0 w-70 bg-[#111827]
shadow-[0_10px_40px_rgba(0,0,0,0.9)]
border border-white/10 rounded p-2 space-y-2 max-h-[200px] overflow-y-auto z-[999] opacity-0 invisible group-hover:visible group-hover:opacity-100 transition"

                                      >
                                        {lvl3.children.map((lvl4) => (
                                          <li
                                            key={lvl4.title}
                                            className="px-2 py-1 !mb-0 text-sm rounded hover:bg-sky-500 hover:text-white z-90 bg-white"
                                          >
                                            <Link href={lvl4.path} className="block">
                                              {lvl4.title}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </div>

                      {/* RIGHT IMAGE */}
                      <div
                        className="pr-6 flex flex-col gap-4 justify-center items-center"
                      >
                        {/* INNER CARD */}

                        {/* INNER CARD */}




                      </div>

                    </div>
                  </div>
                </li>
              );
            })}
        </ul>



        {/* ================= RIGHT ICONS ================= */}
        <div className="flex items-center gap-4">
          {/* DESKTOP SEARCH */}
          <div className="relative hidden md:block">
            {/* Search Icon */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" hidden lg:block pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg> */}

            {/* Input */}
            {/* <input
              type="text"
              placeholder="Search for Products"
              className="
      w-64
      rounded-full
      border border-gray-300
      bg-white
      hidden lg:block
      py-2 pl-10 pr-4
      text-sm text-gray-700
      placeholder-gray-400
      outline-none
      focus:border-gray-400
      focus:ring-0
    "
            /> */}
          </div>

          <Link href="/my-account/wishlist" className="relative flex items-center gap-2 text-white hover:text-gray-700 transition cursor-pointer"


          >

            {/* ICON WRAPPER */}
            <div className="relative flex items-center justify-center">
              <div className="relative mr-2">
                <HeartIcon className="w-6 h-6" />

              </div>
              {/* BADGE */}


              {/* TEXT */}
              <span
                className="
    font-inter
    text-[14px]
    font-semibold
    leading-none
    align-middle
  "
              >
                Wishlist
              </span>

            </div>

          </Link>
          <Divider />

          <button
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="
    relative
    flex items-center gap-2
    text-white
    hover:text-gray-700
    transition
    cursor-pointer
  "
          >

            {/* ICON WRAPPER */}
            <div className="relative flex items-center justify-center">
              <div className="relative mr-2">
                {/* <Image
                  src="/images/page/Navbar/bag.svg"
                  alt="Cart"
                  width={26}
                  height={26}
                /> */}
                <ShoppingBagIcon className="w-6 h-6" />
                {cartItems.length > 0 && (<span
                  className="
        absolute -top-1 -right-1
        flex h-4 w-4 items-center justify-center
        rounded-full
        bg-white
        text-[10px]
        font-semibold
        text-black
      "
                >
                  {cartItems.length}
                </span>)}
              </div>
              {/* BADGE */}


              {/* TEXT */}
              <span
                className="
    font-inter
    text-[14px]
    font-semibold
    leading-none
    align-middle
  "
              >
                Cart
              </span>

            </div>

          </button>




          {/* HAMBURGER */}
          <button
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <span className="block w-6 h-[2px] bg-white mb-1" />
            <span className="block w-6 h-[2px] bg-white mb-1" />
            <span className="block w-6 h-[2px] bg-white" />
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-90 lg:hidden transition-opacity duration-300
        ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-white/60 transition-opacity duration-300
          ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* DRAWER PANEL */}
        <div
          className={`absolute left-0 top-0 h-full w-[100%] 
          bg-gradient-to-b from-[#0f0f0f] via-[#111827] to-[#020617]
          text-white
          transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <Image src="/images/logo4.png" alt="The Clevar" width={120} height={50} />
            <button
              className="text-2xl"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          {/* MENU CONTENT */}
          <div className="overflow-y-auto h-full pb-24">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer text-[15px] font-medium"
            >
              <Link href={'/'} onClick={() => setDrawerOpen(false)} className="flex items-center  gap-1">

                <span className="text-sky-400">Home</span></Link>

            </div>
            {menuData.map((l1) => (
              <div key={l1.title} className="border-b border-white/10">
                {/* LEVEL 1 */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer text-[15px] font-medium"
                  onClick={() => (l1.children ? toggle(l1.title) : navigate(l1.path))}
                >
                  <Link onClick={() => setDrawerOpen(false)} href={l1.path} className="flex items-center gap-1">

                    <span className="text-sky-400">{l1.title}</span></Link>
                  {l1.children && (
                    <ChevronDown
                      className={`transition-transform duration-300 ${openMenu[l1.title] ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </div>

                {/* LEVEL 2 */}
                <div
                  className={`pl-5 overflow-hidden transition-all duration-300 ease-in-out
                  ${openMenu[l1.title] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {l1.children?.map((l2) => (
                    <div key={l2.title}>
                      <div
                        className="flex items-center justify-between py-3  pr-4 cursor-pointer text-sm"
                        onClick={() =>
                          l2.children
                            ? toggle(l1.title + l2.title)
                            : navigate(l2.path)
                        }
                      >
                        <Link onClick={() => setDrawerOpen(false)} href={l2.path} className="flex items-center gap-1">

                          {l2.title}
                        </Link>
                        {l2.children && (
                          <ChevronDown
                            className={`transition-transform duration-300 ${openMenu[l1.title + l2.title] ? "rotate-180" : ""
                              }`}
                          />
                        )}
                      </div>

                      {/* LEVEL 3 */}
                      <div
                        className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out
                        ${openMenu[l1.title + l2.title]
                            ? "max-h-[800px] opacity-100"
                            : "max-h-0 opacity-0"
                          }`}
                      >
                        {l2.children?.map((l3) => (
                          <div key={l3.title}>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer text-[13px] text-gray-300"
                              onClick={() =>
                                l3.children
                                  ? toggle(l1.title + l2.title + l3.title)
                                  : navigate(l3.path)
                              }
                            >
                              <Link onClick={() => setDrawerOpen(false)} href={l3.path} className="flex items-center gap-1">

                                {l3.title}
                              </Link>
                              {l3.children && (
                                <ChevronDown
                                  className={`transition-transform duration-300 ${openMenu[l1.title + l2.title + l3.title]
                                    ? "rotate-180"
                                    : ""
                                    }`}
                                />
                              )}
                            </div>

                            {/* LEVEL 4 */}
                            <div
                              className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out
                              ${openMenu[l1.title + l2.title + l3.title]
                                  ? "max-h-[600px] opacity-100"
                                  : "max-h-0 opacity-0"
                                }`}
                            >
                              {l3.children?.map((l4) => (
                                <div
                                  key={l4.title}
                                  className="py-2 text-[12px] text-gray-400 cursor-pointer"
                                  onClick={() => navigate(l4.path)}
                                >
                                  {l4.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
function Divider() {
  return <span className="h-6 w-px mx-0 bg-white/40 hidden md:block" />;
}
