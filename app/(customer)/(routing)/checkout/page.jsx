// app/checkout/page.tsx
import { cookies } from "next/headers";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

import MyCart from "../../UI/Checkout/MyCart";
import CheckoutTotal from "../../UI/Checkout/CheckoutTotal";
import GuestCartClient from "../../UI/Checkout/GuestCartClient";
import AddressSection from "../../UI/Checkout/AddressSection";

/* =========================
   TIER PRICE HELPER
========================= */
function getTierPrice(tierPricing, tier) {
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
}

export default async function Page() {
  const token = await requireUser();

  /* =========================t
     GUEST USER
  ========================= */
  if (!token) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <GuestCartClient />
      </div>
    );
  }

  /* =========================
     LOGGED-IN USER
  ========================= */
  const user = await requireUser();
  if (!user) return null;

  /* =========================
     CUSTOMER DATA
  ========================= */
  const customer = await prisma.customer_list.findUnique({
    where: { id: user.id },
    select: {
      customer_group_id: true,
      price_tier: true,
    },
  });

  if (!customer) return null;

  /* =========================
     ADDRESSES
  ========================= */
  const addresses = await prisma.customer_address.findMany({
    where: {
      customer_list_id: user.id,
      is_deleted: false,
    },
    orderBy: { created_at: "desc" },
  });

  /* =========================
     CART DATA
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

          // customer group pricing (ARRAY)
          pricing: customer.customer_group_id
            ? {
              where: {
                customer_group_id: customer.customer_group_id,
              },
              take: 1,
            }
            : false,

          // tier pricing (OBJECT)
          tier_product_pricing: true,
        },
      },
        // ✅ ADD THIS
    variant: true,
    },
  });
  console.log('cartDatacartDatacartData',cartData)

  /* =========================
     APPLY PRICING (CORE LOGIC)
  ========================= */
  function toFloat(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;       // already float
    if (typeof value.toNumber === "function") return value.toNumber(); // Decimal
    return Number(value);
  }
  const pricedCartData = cartData.map((item) => {
    const p = item.product;
    const v = item.variant;

    let finalPrice = toFloat(p.regular_price);
    let priceSource = "REGULAR_PRICE";

    /* 1️⃣ GROUP PRICE */
    if (p.pricing?.length && p.pricing[0]?.price != null) {
      finalPrice = toFloat(p.pricing[0].price);
      priceSource = "GROUP_PRICE";
    }

    /* 2️⃣ TIER PRICE */
    else if (p.tier_product_pricing && customer.price_tier) {
      const tierMap = {
        TIER_1: p.tier_product_pricing.tier_1_price,
        TIER_2: p.tier_product_pricing.tier_2_price,
        TIER_3: p.tier_product_pricing.tier_3_price,
        TIER_4: p.tier_product_pricing.tier_4_price,
        TIER_5: p.tier_product_pricing.tier_5_price,
        TIER_6: p.tier_product_pricing.tier_6_price,
        TIER_7: p.tier_product_pricing.tier_7_price,
        TIER_8: p.tier_product_pricing.tier_8_price,
        TIER_9: p.tier_product_pricing.tier_9_price,
        TIER_10: p.tier_product_pricing.tier_10_price,
      };

      const tierValue = tierMap[customer.price_tier];

      if (tierValue != null) {
        finalPrice = toFloat(tierValue);
        priceSource = `TIER_PRICE (${customer.price_tier})`;
      }
    }

    /* 3️⃣ SALE PRICE */
    else if (p.sale_price != null) {
      finalPrice = toFloat(p.sale_price);
      priceSource = "SALE_PRICE";
    }

    return {
      id: item.id,
      quantity: item.quantity,

      product: {
        id: p.id,
        name: p.name,
        images: p.images,
        sku: p.sku,
        stepper_value: p.stepper_value,
        size: v?.size || null,
        price: finalPrice, // ✅ FLOAT
        priceSource,
      },
    };
  });


  /* =========================
     RENDER
  ========================= */
 return (
  <div className="mx-auto max-w-7xl px-4 py-6 bg-[#0f0f0f] min-h-screen">
    {/* PAGE TITLE */}
    <div className="mb-6 text-lg font-semibold text-white">
      Shopping Cart
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-white/10  ">
          <AddressSection addresses={addresses} />
        </div>

        <div className="rounded-xl border border-white/10  ">
          <MyCart cartData={pricedCartData} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-1">
        <div className="rounded-xl ">
          <CheckoutTotal cartData={pricedCartData} />
        </div>
      </div>
    </div>
  </div>
);

}
