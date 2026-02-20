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
    <div className="bg-[#0f0f0f] min-h-screen p-2 md:p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">


        {/* ORDERS CARD */}
        <div className="rounded-xl  border-white/10 ">

          {/* CARD HEADER */}
          <div className=" px-6 py-4 font-medium">
            Order History
            <p className="text-sm text-gray-400">
              View and track your recent purchases
            </p>
          </div>

          {/* LIST */}
          <div className="">

            {orders.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No orders found
              </div>
            )}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {orders.map((order) => (


              <div className="block md:hidden">
                <OrderCardMobile order={order} />
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );

}
