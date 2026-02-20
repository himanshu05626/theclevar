// app/api/razorpay/webhook/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      return NextResponse.json({ message: "Invalid webhook" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const localOrderId = payment.notes?.localOrderId;

      await prisma.order_list.update({
        where: { id: Number(localOrderId) },
        data: { status: "PAID" },
      });

      await prisma.payments.create({
        data: {
          order_id: Number(localOrderId),
          provider: "razorpay",
          provider_order_id: payment.order_id,
          provider_txn_id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: "SUCCESS",
          raw_response: JSON.stringify(event),
        },
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}