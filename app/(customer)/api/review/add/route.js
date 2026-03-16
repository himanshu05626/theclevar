import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(req) {
  try {

    const body = await req.json();

    const productId = Number(body.productId);
    const rating = Number(body.rating);
    const review = body.review || "";

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Invalid rating" },
        { status: 400 }
      );
    }

    const token = await requireUser();

    if (!token?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const customerId = token.id;

    /* CHECK PURCHASE */

    const purchased = await prisma.order_items.findFirst({
      where: {
        product_list_id: productId,
        order: {
          customer_list_id: customerId,
          status: {
            in: ["PAID", "DELIVERED", "PROCESSING"]
          }
        }
      }
    });

    if (!purchased) {
      return NextResponse.json(
        { message: "You can review only purchased products" },
        { status: 403 }
      );
    }

    /* PREVENT DUPLICATE */

    const existing = await prisma.product_reviews.findFirst({
      where: {
        product_list_id: productId,
        customer_id: customerId
      }
    });

    if (existing) {
      return NextResponse.json(
        { message: "You already reviewed this product" },
        { status: 400 }
      );
    }

    /* CREATE REVIEW */

    const newReview = await prisma.product_reviews.create({
      data: {
        product_list_id: productId,
        customer_id: customerId,
        rating,
        review,
        is_verified: true,
      }
    });

    return NextResponse.json({
      success: true,
      review: newReview
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}