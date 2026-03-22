import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin"; // you should have admin auth

export async function POST(req) {
  try {
    // 🔐 ADMIN AUTH
    const admin = await requireAdmin();
    if (!admin?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      code,
      description,
      discount_type, // "PERCENTAGE" | "FIXED"
      discount_value,
      min_order_value,
      max_discount,
      usage_limit,
      starts_at,
      expires_at,
      is_active = true,
    } = body;

    /* ================= VALIDATION ================= */

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["PERCENTAGE", "FIXED"].includes(discount_type)) {
      return NextResponse.json(
        { success: false, message: "Invalid discount type" },
        { status: 400 }
      );
    }

    if (discount_value <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid discount value" },
        { status: 400 }
      );
    }

    if (discount_type === "PERCENTAGE" && discount_value > 100) {
      return NextResponse.json(
        { success: false, message: "Percentage cannot exceed 100%" },
        { status: 400 }
      );
    }

    if (starts_at && expires_at && new Date(starts_at) > new Date(expires_at)) {
      return NextResponse.json(
        { success: false, message: "Start date must be before expiry date" },
        { status: 400 }
      );
    }

    /* ================= UNIQUE CODE CHECK ================= */

    const existing = await prisma.coupons.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    /* ================= CREATE COUPON ================= */

    const coupon = await prisma.coupons.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || null,
        discount_type,
        discount_value: Number(discount_value),

        min_order_value: min_order_value
          ? Number(min_order_value)
          : null,

        max_discount:
          discount_type === "PERCENTAGE" && max_discount
            ? Number(max_discount)
            : null,

        usage_limit: usage_limit ? Number(usage_limit) : null,

        starts_at: starts_at ? new Date(starts_at) : null,
        expires_at: expires_at ? new Date(expires_at) : null,

        is_active,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("ADMIN COUPON CREATE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}