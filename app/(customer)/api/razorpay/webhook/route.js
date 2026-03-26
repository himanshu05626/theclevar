import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const start = Date.now();

  try {
    console.log("🔔 Razorpay webhook received");

    // ✅ 1. Raw body (DO NOT use req.json())
    const body = await req.text();

    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("❌ Missing signature");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error("❌ Missing webhook secret");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // ✅ 2. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("✅ Signature verified");

    // ✅ 3. Parse event safely
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error("❌ JSON parse failed");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = event.event;
    console.log("📢 Event:", eventType);

    const payment = event.payload?.payment?.entity;

    if (!payment) {
      console.warn("⚠️ No payment entity found");
      return NextResponse.json({ status: "ignored" });
    }

    const localOrderId = payment.notes?.localOrderId;

    if (!localOrderId) {
      console.error("❌ Missing localOrderId in notes");
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const orderId = Number(localOrderId);

    console.log("🧾 Local Order ID:", orderId);

    // ✅ 4. Idempotency check (prevent duplicate webhook processing)
    const existingPayment = await prisma.payments.findUnique({
      where: { provider_txn_id: payment.id },
    });

    if (existingPayment) {
      console.log("⚠️ Duplicate webhook ignored:", payment.id);
      return NextResponse.json({ status: "duplicate" });
    }

    // ✅ 5. DB transaction (atomic)
    await prisma.$transaction(async (tx) => {
      // 🔵 SUCCESS CASE
      if (
        eventType === "payment.captured" ||
        eventType === "order.paid"
      ) {
        await tx.order_list.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        await tx.payments.create({
          data: {
            order_id: orderId,
            provider: "razorpay",
            provider_order_id: payment.order_id,
            provider_txn_id: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: "SUCCESS",
            raw_response: JSON.stringify(event),
          },
        });

        console.log("✅ Payment SUCCESS handled");
      }

      // 🔴 FAILED CASE
      else if (eventType === "payment.failed") {
        await tx.order_list.update({
          where: { id: orderId },
          data: { status: "FAILED" },
        });

        await tx.payments.create({
          data: {
            order_id: orderId,
            provider: "razorpay",
            provider_order_id: payment.order_id,
            provider_txn_id: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: "FAILED",
            raw_response: JSON.stringify(event),
          },
        });

        console.log("❌ Payment FAILED handled");
      }

      // ⚪ OTHER EVENTS (ignore safely)
      else {
        console.log("ℹ️ Unhandled event:", eventType);
      }
    });

    console.log(`⚡ Done in ${Date.now() - start}ms`);

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("🔥 Webhook error:", err);

    // ⚠️ Always return 200 for Razorpay to avoid retry storms (optional strategy)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}