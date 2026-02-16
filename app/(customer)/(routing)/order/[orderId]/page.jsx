"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StatusChip from "@/app/admin/UI/common/StatusChip";

const POLL_INTERVAL = 5000; // 5 sec
const MAX_POLL_TIME = 30000; // 30 sec

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        console.log('data', data)
    }, [data])

    /* =========================
       FETCH ORDER STATUS
    ========================= */
    const fetchStatus = async () => {
        try {
            const res = await fetch("/api/paypal/verify-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            const json = await res.json();
            setData(json);
            setLoading(false);

            // Stop polling on final states
            if (
                json?.order?.status === "PAID" ||
                json?.order?.status === "PAYMENT_FAILED" ||
                json?.paypal?.status === "COMPLETED"
            ) {
                stopPolling();
            }
        } catch (err) {
            console.error("Verify failed:", err);
            setLoading(false);
        }
    };

    /* =========================
       START POLLING
    ========================= */
    const startPolling = () => {
        if (isPolling) return;

        setIsPolling(true);
        setElapsed(0);

        intervalRef.current = setInterval(() => {
            fetchStatus();
            setElapsed((prev) => prev + POLL_INTERVAL);
        }, POLL_INTERVAL);

        timeoutRef.current = setTimeout(stopPolling, MAX_POLL_TIME);
    };

    /* =========================
       STOP POLLING
    ========================= */
    const stopPolling = () => {
        setIsPolling(false);
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
    };

    /* =========================
       INITIAL LOAD
    ========================= */
    useEffect(() => {
        fetchStatus();
        return () => stopPolling();
    }, [orderId]);

    /* =========================
       START POLLING IF PENDING
    ========================= */
    useEffect(() => {
        if (data?.paypal?.status === "PENDING") {
            startPolling();
        }
    }, [data?.paypal?.status]);

    /* =========================
       LOADING STATE
    ========================= */
    if (loading) {
        return (
            <div className="mx-auto mt-4 md:mt-4 p-4  pt-0 max-w-6xl space-y-6 animate-pulse">

                {/* ================= HEADER ================= */}
                  <p className=" flex text-md text-gray-600">
                    <div
                        className="cursor-pointer"
                        onClick={() => router.back()}
                    >   Orders</div>
                    <span className="mx-1 text-[#0172BC]">{">"}</span>
                    <span className="font-medium text-[#0172BC]"> Order Details</span>
                </p>

                {/* ================= ORDER META ================= */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded p-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-300 rounded" />
                        </div>
                    ))}
                </div>

                {/* ================= ADDRESSES + SUMMARY ================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-200 rounded p-6">

                    {/* Shipping */}
                    <div className="space-y-3">
                        <div className="h-4 w-36 bg-gray-300 rounded" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-3 w-full bg-gray-200 rounded" />
                        ))}
                    </div>

                    {/* Billing */}
                    <div className="space-y-3">
                        <div className="h-4 w-36 bg-gray-300 rounded" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-3 w-full bg-gray-200 rounded" />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <div className="h-4 w-40 bg-gray-300 rounded" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                            </div>
                        ))}
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                            <div className="h-4 w-28 bg-gray-300 rounded" />
                            <div className="h-4 w-20 bg-gray-300 rounded" />
                        </div>
                    </div>
                </div>

                {/* ================= ORDER ITEMS ================= */}
                <div className="border border-gray-200 rounded ">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex justify-between p-4 border-b border-dashed border-gray-200">
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-gray-300 rounded" />
                                <div className="h-3 w-28 bg-gray-200 rounded" />
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                                <div className="h-4 w-20 bg-gray-300 rounded ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================= PAYPAL INFO ================= */}
                <div className="border border-gray-200 rounded p-4 space-y-2">
                    <div className="h-3 w-64 bg-gray-200 rounded" />
                    <div className="h-3 w-72 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-300 rounded" />
                </div>

            </div>
        );
    }

    const { order, items, paypal } = data || {};
    const isPending = paypal?.status === "PENDING";
    console.log('orderorder', items)
    const billingAddress = order?.billing_address || "";
    const billingLines = billingAddress
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const shippingAddress = order?.shipping_address || "";
    const shippingLines = shippingAddress
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

  return (
  <div className="mx-auto max-w-6xl space-y-6 bg-[#0f0f0f] p-6 text-white">

    {/* ================= HEADER ================= */}
    <div className="flex items-center justify-between">
      <div>
        <div
          className="cursor-pointer text-sm text-gray-400 hover:text-[#38bdf8]"
          onClick={() => router.back()}
        >
          ← Back to Orders
        </div>

        <h1 className="mt-1 text-xl font-semibold">
          Order #{order?.order_number}
        </h1>
      </div>

      <StatusChip value={order?.status} />
    </div>

    {/* ================= META CARD ================= */}
    <div className="grid gap-4 rounded-xl border border-white/10 bg-[#1a1a1a] p-5 text-sm md:grid-cols-4">
      <Meta label="Order Placed">
        {new Date(order?.created_at).toLocaleString()}
      </Meta>

      <Meta label="Payment Mode">
        {order?.is_paypal ? "PayPal" : "Purchase Order"}
      </Meta>

      <Meta label="Shipping">
        ${order?.shipping_amount}
      </Meta>

      <Meta label="Tax">
        ${order?.tax_amount}
      </Meta>
    </div>

    {/* ================= ADDRESSES + SUMMARY ================= */}
    <div className="grid gap-6 md:grid-cols-3">

      {/* SHIPPING */}
      <Card title="Shipping Address">
        {shippingLines.map((line, i) => (
          <p key={i} className={i === 0 ? "font-medium" : "text-gray-400"}>
            {line}
          </p>
        ))}
      </Card>

      {/* BILLING */}
      <Card title="Billing Address">
        {billingLines.map((line, i) => (
          <p key={i} className={i === 0 ? "font-medium" : "text-gray-400"}>
            {line}
          </p>
        ))}
      </Card>

      {/* SUMMARY */}
      <Card title="Order Summary">
        <SummaryRow label="Sub Total" value={order?.sub_total} />
        <SummaryRow label="Shipping" value={order?.shipping_amount} />
        <SummaryRow label="GST" value={order?.tax_amount} />

        <div className="my-3 border-t border-white/10" />

        <div className="flex justify-between font-semibold text-[#38bdf8]">
          <span>Grand Total</span>
          <span>${order?.total}</span>
        </div>
      </Card>
    </div>

    {/* ================= ITEMS ================= */}
    <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
      {items?.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 border-b border-white/10 p-4 last:border-none md:flex-row md:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-white/10 bg-[#111827]">
              <Image
                src={item.product?.images?.[0]?.image_url || "/images/not-found.png"}
                alt={item.product_title}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-medium">{item.product_title}</p>
              <p className="text-xs text-gray-400">SKU: {item.sku}</p>
            </div>
          </div>

          <div className="text-right text-sm">
            <p className="text-gray-400">QTY: {item.quantity}</p>
            <p className="font-semibold text-[#38bdf8]">
              ${item.line_total}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* ================= PAYPAL ================= */}
    <Card title="PayPal Transactions">
      {paypal?.length ? (
        paypal.map((tx) => (
          <div
            key={tx.id}
            className="mb-3 rounded-lg border border-white/10 bg-[#111827] p-4 text-sm"
          >
            <div className="grid grid-cols-2 gap-3">
              <Meta label="Transaction ID">{tx.providerTxnId}</Meta>
              <Meta label="Amount">
                {tx.amount} {tx.currency}
              </Meta>
              <Meta label="Date">
                {new Date(tx.createdAt).toLocaleString()}
              </Meta>
              <Meta label="Status">{tx.status}</Meta>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No PayPal transactions found.</p>
      )}
    </Card>

  </div>
);

}
function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5 text-sm">
      <h4 className="mb-3 font-semibold">{title}</h4>
      {children}
    </div>
  );
}

function Meta({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-300">
      <span>{label}</span>
      <span>${value}</span>
    </div>
  );
}
