import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const customer = await requireUser();
    const body = await req.json();

    const { code } = body;

    // ✅ Validate
    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code required" },
        { status: 400 }
      );
    }

    // 🛒 1. Fetch cart from DB
    const cartItems = await prisma.customer_cart.findMany({
      where: {
        customer_list_id: customer.id,
        is_deleted: false,
      },
      include: {
        product: true,
      },
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // 💰 2. Calculate cart total (SERVER SIDE)
    let cartTotal = 0;

    for (const item of cartItems) {
      const price =
        item.product.sale_price ?? item.product.regular_price;

      cartTotal += price * item.quantity;
    }

    // 🔍 3. Find coupon
    const coupon = await prisma.coupons.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon" },
        { status: 404 }
      );
    }

    // ❌ inactive
    if (!coupon.is_active) {
      return NextResponse.json(
        { success: false, message: "Coupon is inactive" },
        { status: 400 }
      );
    }

    const now = new Date();

    // ⏰ start check
    if (coupon.starts_at && now < coupon.starts_at) {
      return NextResponse.json(
        { success: false, message: "Coupon not started yet" },
        { status: 400 }
      );
    }

    // ⏰ expiry check
    if (coupon.expires_at && now > coupon.expires_at) {
      return NextResponse.json(
        { success: false, message: "Coupon expired" },
        { status: 400 }
      );
    }

    // 📦 usage limit
    if (
      coupon.usage_limit !== null &&
      coupon.used_count >= coupon.usage_limit
    ) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // 👤 already used
    const alreadyUsed = await prisma.coupon_usage.findUnique({
      where: {
        coupon_id_customer_id: {
          coupon_id: coupon.id,
          customer_id: customer.id,
        },
      },
    });

    if (alreadyUsed) {
      return NextResponse.json(
        { success: false, message: "You already used this coupon" },
        { status: 400 }
      );
    }

    // 💰 min order check
    if (
      coupon.min_order_value &&
      cartTotal < coupon.min_order_value
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order ₹${coupon.min_order_value} required`,
        },
        { status: 400 }
      );
    }

    // ❗ safety
    if (!coupon.discount_value || coupon.discount_value <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon config" },
        { status: 400 }
      );
    }

    // 🧮 4. Calculate discount
    let discount = 0;

    if (coupon.discount_type === "PERCENTAGE") {
      discount = (cartTotal * coupon.discount_value) / 100;

      if (coupon.max_discount) {
        discount = Math.min(discount, coupon.max_discount);
      }
    } else {
      discount = coupon.discount_value;
    }

    // 🚫 prevent overflow
    discount = Math.min(discount, cartTotal);

    const finalTotal = cartTotal - discount;

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        couponId: coupon.id,
        code: coupon.code,
        cartTotal,
        discount,
        finalTotal,
      },
    });
  } catch (error) {
    console.error("COUPON ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}