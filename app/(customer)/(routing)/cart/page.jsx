import { prisma } from "@/lib/prisma";
import MyCart from "../../UI/Cart/MyCart";
import CartTotal from "../../UI/Cart/CartTotal";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page() {
  /* =========================
     AUTH + CUSTOMER
  ========================= */
  const c = await cookies();
  const token = c.get("authToken")?.value;

  if (!token) return null;

  const user = verifyToken(token);
  if (!user?.id) return null;

  const customer = await prisma.customer_list.findUnique({
    where: { id: user.id },
    select: {
      customer_group_id: true,
      price_tier: true,
    },
  });

  if (!customer) return null;

  const customerGroupId = customer.customer_group_id;
  const priceTier = customer.price_tier;

  console.log(
    `🛒 Cart pricing | groupId=${customerGroupId} | tier=${priceTier ?? "NULL"}`
  );

  /* =========================
     FETCH CART
  ========================= */
  const cartData = await prisma.customer_cart.findMany({
    where: {
      customer_list_id: user.id,
      is_deleted: false,
    },
    include: {
      product: {
        include: {
          images: true,

          pricing: customerGroupId
            ? {
                where: { customer_group_id: customerGroupId },
                take: 1,
              }
            : false,

          tier_product_pricing: {
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
          },
        },
      },
    },
  });

  /* =========================
     TIER PRICE HELPER
  ========================= */
  const getTierPrice = (tierPricing, tier) => {
    if (!tierPricing || !tier) return null;

    const map = {
      TIER_1: tierPricing.tier_1_price,
      TIER_2: tierPricing.tier_2_price,
      TIER_3: tierPricing.tier_3_price,
      TIER_4: tierPricing.tier_4_price,
      TIER_5: tierPricing.tier_5_price,
      TIER_6: tierPricing.tier_6_price,
      TIER_7: tierPricing.tier_7_price,
      TIER_8: tierPricing.tier_8_price,
      TIER_9: tierPricing.tier_9_price,
      TIER_10: tierPricing.tier_10_price,
    };

    return map[tier] ?? null;
  };

  /* =========================
     APPLY PRICING
  ========================= */
 const pricedCartData = cartData.map((item) => {
  const product = item.product;

  let finalPrice =
    product.sale_price ?? product.regular_price;

  let pricingSource = "DEFAULT_PRICE";

  // 1️⃣ group pricing
  if (product.pricing?.length) {
    finalPrice = product.pricing[0].price;
    pricingSource = "GROUP_PRICE";
  }

  // 2️⃣ tier pricing (✅ FIXED)
  else if (product.tier_product_pricing && priceTier) {
    const tierPrice = getTierPrice(
      product.tier_product_pricing, // ✅ OBJECT
      priceTier
    );

    if (tierPrice !== null) {
      finalPrice = Number(tierPrice);
      pricingSource = `TIER_PRICE (${priceTier})`;
    }
  }

  return {
    ...item,
    finalPrice,
    pricingSource,
  };
});


  /* =========================
     RENDER
  ========================= */
  console.log('pricedCartData',pricedCartData)

return (
  <div className="mx-auto max-w-7xl px-4 py-8">

    {/* HEADER */}
    <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">

      {/* CONTINUE SHOPPING */}
      <Link
        href="/shop"
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        CONTINUE SHOPPING
      </Link>

      {/* CART TITLE */}
      <h1 className="text-md w-full  md:text-xl font-semibold tracking-wider text-white">
        YOUR CART
        <span className="ml-1 text-cyan-400">
          ({pricedCartData.length})
        </span>
      </h1>

      {/* Spacer (keeps title centered) */}
      <div className="w-[140px]" />
    </div>

    {/* CART LAYOUT */}
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

      {/* CART ITEMS */}
      <div className="lg:col-span-2">
        <MyCart cartData={pricedCartData} />
      </div>

      {/* ORDER SUMMARY */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartTotal cartData={pricedCartData} />
        </div>
      </div>

    </div>

  </div>
);
}
