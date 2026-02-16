// app/my-account/orders/OrdersList.jsx
import { prisma } from "@/lib/prisma";
import OrderCard from "./OrderCard";
import OrderCardMobile from "./OrderCardMobile";

export default async function OrdersList({ customerId }) {
  console.log('customerId', customerId)
  // ⚠️ replace customer_list_id with auth user id
  // const customerId = 1;

  const orders = await prisma.order_list.findMany({
    where: { customer_list_id: customerId },
    orderBy: { created_at: "desc" },
    include: {
      payments: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  if (!orders.length) {
    return (
      <p className="text-sm text-gray-600">
        You have no orders yet.
      </p>
    );
  }

  return (
  <div className="bg-[#0f0f0f] min-h-screen p-6 text-white">
    <div className="mx-auto max-w-6xl space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-gray-400">
          View and track your recent purchases
        </p>
      </div>

      {/* ORDERS CARD */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">

        {/* CARD HEADER */}
        <div className="border-b border-white/10 px-6 py-4 font-medium">
          Order History
        </div>

        {/* LIST */}
        <div className="divide-y divide-white/10">

          {orders.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              No orders found
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="p-4 md:p-6">
              {/* DESKTOP */}
              <div className="hidden md:block">
                <OrderCard order={order} />
              </div>

              {/* MOBILE */}
              <div className="block md:hidden">
                <OrderCardMobile order={order} />
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  </div>
);

}
