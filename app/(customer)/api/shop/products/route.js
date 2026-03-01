import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const page = Number(searchParams.get("page") || 1);

    const limit = 8;
    const skip = (page - 1) * limit;

    /* =========================
       🔐 AUTH USER
    ========================= */
    const user = await requireUser();

    let customer = null;

    if (user?.id) {
      customer = await prisma.customer_list.findUnique({
        where: { id: user.id },
        select: {
          customer_group_id: true,
          price_tier: true,
        },
      });
    }

    /* =========================
       🛒 FETCH PRODUCTS
    ========================= */
    const products = await prisma.product_list.findMany({
      where: {
        is_active: true,
        is_deleted: false,

        ...(category && {
          category: { slug: category },
        }),

        ...(size && {
          variants: {
            some: {
              size,
              stock_qty: { gt: 0 },
              is_deleted: false,
            },
          },
        }),

        stock_qty: { gt: 0 },
      },

      include: {
        images: {
          where: {
            is_primary: true,
            is_deleted: false,
          },
          take: 1,
        },

        variants: {
          where: {
            is_deleted: false,
          },
          select: {
            id: true,
            size: true,
            stock_qty: true,
          },
        },

        /* ✅ FILTERED CUSTOMER GROUP PRICING */
        pricing: customer?.customer_group_id
          ? {
              where: {
                customer_group_id: customer.customer_group_id,
              },
              take: 1,
            }
          : false,

        /* ✅ TIER PRICING */
        tier_product_pricing: true,
      },

      skip,
      take: limit,
    });

    /* =========================
       💰 PRICE CALCULATION
    ========================= */
    const finalProducts = products.map((p) => {
      let price = p.sale_price || p.regular_price;

      /* ✅ 1. CUSTOMER GROUP PRICE */
      if (p.pricing?.length) {
        price = p.pricing[0].price;
      }

      /* ✅ 2. TIER PRICING (HIGHEST PRIORITY) */
      if (customer?.price_tier && p.tier_product_pricing) {
        const tierKey = customer.price_tier.toLowerCase(); 
        // TIER_1 → tier_1_price

        const tierPrice =
          p.tier_product_pricing[`${tierKey}_price`];

        if (tierPrice) {
          price = Number(tierPrice);
        }
      }

    return {
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  image: p.images[0]?.image_url || null,
  price,
  rating: 4.5,

  /* ✅ show only when discount exists */
  regular_price:
    p.regular_price && p.regular_price > price
      ? p.regular_price
      : null,

  variants: p.variants
    .filter((v) => v.stock_qty > 0)
    .map((v) => ({
      id: v.id,
      size: v.size,
    })),
};
    });

    /* =========================
       📄 COUNT (PAGINATION)
    ========================= */
    const totalProducts = await prisma.product_list.count({
      where: {
        is_active: true,
        is_deleted: false,

        ...(category && {
          category: { slug: category },
        }),

        ...(size && {
          variants: {
            some: {
              size,
              stock_qty: { gt: 0 },
              is_deleted: false,
            },
          },
        }),

        stock_qty: { gt: 0 },
      },
    });

    const totalPages = Math.ceil(totalProducts / limit);

    /* =========================
       ✅ RESPONSE
    ========================= */
    return NextResponse.json({
      products: finalProducts,
      meta: {
        totalProducts,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}