import Link from "next/link";
import Home from "./customer/components/home/home";
import BrandStrip from "./customer/components/home/BrandStrip";
import Category from "./customer/components/home/Category";
import BestSellingProducts from "./customer/components/home/BestSellingProducts";
import WhyChoosetheclevar from "./customer/components/home/WhyChoosetheclevar";
import StatsCounter from "./customer/components/home/StatsCounter";
import FAQAccordion from "./customer/components/home/FAQAccordion";
import ServiceHighlights from "./customer/components/home/ServiceHighlights";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import Banner from "./customer/components/home/Banner";
import LetsWorkTogether from "./customer/components/Aboutus/LetsWorkTogether";
import AnnouncementBar from "./customer/components/home/AnnouncementBar";

const brands = [
  { path: "/logo/SVG-1.png", alt: "Brand 1" },
  { path: "/logo/SVG-2.png", alt: "Brand 2" },
  { path: "/logo/SVG-3.png", alt: "Brand 3" },
  { path: "/logo/SVG-4.png", alt: "Brand 4" },
  { path: "/logo/SVG-5.png", alt: "Brand 5" },
  { path: "/logo/SVG-6.png", alt: "Brand 6" },
  { path: "/logo/SVG-7.png", alt: "Brand 7" },
  { path: "/logo/SVG-8.png", alt: "Brand 8" },
  { path: "/logo/SVG-9.png", alt: "Brand 9" },
  { path: "/logo/SVG-10.png", alt: "Brand 10" },
  { path: "/logo/SVG-11.png", alt: "Brand 11" },
  { path: "/logo/SVG-12.png", alt: "Brand 12" },
  { path: "/logo/SVG-13.png", alt: "Brand 13" },
  { path: "/logo/SVG-14.png", alt: "Brand 14" },
  { path: "/logo/SVG-15.png", alt: "Brand 15" },
];



export default async function Page() {
  const skus = [
    "SHIRT1", "SHIRT2"



  ];
  const user = await requireUser();
  let isLoggedIn = user ? true : false;
  let customer;
  if (user) {
    customer = await prisma.customer_list.findUnique({
      where: { id: user?.id }, // No user logged in
      select: {
        id: true,
        customer_group_id: true,
        price_tier: true,
      },
    });
  }
  console.log('skus', skus)
  const products = await prisma.product_list.findMany({
    where: {
      sku: { in: skus },
      is_deleted: false,
      is_active: true,
    },
    include: {
      variants: true,
      images: {
        where: { is_primary: true },
      },
      category: true,

      pricing: customer?.customer_group_id
        ? {
          where: { customer_group_id: customer.customer_group_id },
          take: 1,
        }
        : false,

      tier_product_pricing: isLoggedIn
        ? {
          select: {
            tier_1_price: true,
            tier_2_price: true,
            tier_3_price: true,
            tier_4_price: true,
            tier_5_price: true,
            tier_6_price: true,
            tier_7_price: true,
            tier_8_price: true,
            tier_9_price: true,
            tier_10_price: true,
          },
        }
        : false,
    },
  });


  return (
    <>
      <Home />
      <AnnouncementBar />
      {/* <BrandStrip brands={brands} /> */}
      {/* <Category /> */}
      <BestSellingProducts products={products} customerId={user?.id} />
      {/* <WhyChoosetheclevar />
       */}
      <LetsWorkTogether />

      {/* <StatsCounter /> */}
      {/* <Banner products={products} /> */}
      <ServiceHighlights />
    </>
  );
}
