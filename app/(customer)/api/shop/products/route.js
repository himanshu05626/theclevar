import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const size = searchParams.get("size");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page") || 1);

  const limit = 8;
  const skip = (page - 1) * limit;

  const token = await requireUser();

  /* 🔥 FETCH PRODUCTS */
  const products = await prisma.product_list.findMany({
    where: {
      is_active: true,
      is_deleted: false,
      ...(category && {
        category: { slug: category },
      }),
      variants: size
        ? {
            some: {
              size,
              stock_qty: { gt: 0 },
            },
          }
        : undefined,
      stock_qty: { gt: 0 },
    },
    include: {
      images: {
        where: { is_primary: true },
        take: 1,
      },
      variants: { select: {
        id: true,
        size: true,  
        stock_qty: true      // if variant has images
      }
    },
      pricing: true,
      tier_product_pricing: true,
    },
    skip,
    take: limit,
  });

  /* 🔥 PRICE LOGIC */
  const finalProducts = products.map((p) => {
    let price = p.sale_price || p.regular_price;

    // customer group pricing
    if (p.pricing?.length) {
      price = p.pricing[0].price;
    }

    return {
      id: p.id,
      name: p.name,
      image: p.images[0]?.image_url,
      price,
     variants: p.variants
    .filter((v) => v.stock_qty > 0)
    .map((v) => ({
      id: v.id,
      size: v.size,
    })),
    };
  });

  return NextResponse.json({
    products: finalProducts,
    meta: { totalPages: 5 },
  });
}