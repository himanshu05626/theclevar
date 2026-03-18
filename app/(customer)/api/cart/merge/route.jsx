import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(req) {
  try {
    const user = await requireUser(); // logged-in user
    const body = await req.json();

    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid cart data" },
        { status: 400 }
      );
    }

    // 🔥 STEP 1: Fetch existing cart items of user
    const existingCart = await prisma.customer_cart.findMany({
      where: {
        customer_list_id: user.id,
        is_deleted: false,
      },
    });

    // Convert to map for fast lookup
    const cartMap = new Map();

    existingCart.forEach((item) => {
      const key = `${item.product_list_id}_${item.product_variant_id || "null"}`;
      cartMap.set(key, item);
    });

    const operations = [];

    // 🔥 STEP 2: Merge logic
    for (const item of items) {
      const productId = item.product_id;
      const variantId = item.variant_id?.id || null;
      const qty = item.quantity || 1;

      const key = `${productId}_${variantId || "null"}`;

      if (cartMap.has(key)) {
        // ✅ UPDATE quantity
        const existing = cartMap.get(key);

        operations.push(
          prisma.customer_cart.update({
            where: { id: existing.id },
            data: {
              quantity: existing.quantity + qty,
            },
          })
        );
      } else {
        // ✅ CREATE new cart item
        operations.push(
          prisma.customer_cart.create({
            data: {
              customer_list_id: user.id,
              product_list_id: productId,
              product_variant_id: variantId,
              quantity: qty,
            },
          })
        );
      }
    }

    // 🔥 STEP 3: Run all operations in transaction
    await prisma.$transaction(operations);

    return NextResponse.json({
      success: true,
      message: "Cart merged successfully",
    });
  } catch (error) {
    console.error("MERGE CART ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}