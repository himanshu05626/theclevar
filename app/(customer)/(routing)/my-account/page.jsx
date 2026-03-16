import { prisma } from "@/lib/prisma";
import EditMyAccount from "./EditMyAccount";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";

export default async function MyAccountPage() {

  const user = await requireUser();

  if (!user) {
    redirect("/auth/logout");
  }

  /* CUSTOMER */
  const customer = await prisma.customer_list.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      user_name: true,
      phone: true,
      whatsapp: true,

      image_gallery: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  if (!customer) {
    return <div className="text-red-500">Customer not found</div>;
  }

  /* ORDERS */
  const orders = await prisma.order_list.findMany({
    where: {
      customer_list_id: customer.id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 5,
    include: {
      items: {
        take: 1,
      },
    },
  });

  /* STATS */
  const totalOrders = orders.length;

  const totalSpent = await prisma.order_list.aggregate({
    where: {
      customer_list_id: customer.id,
      status: "DELIVERED",
    },
    _sum: {
      total: true,
    },
  });

  const lastOrder = orders[0] ?? null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <EditMyAccount
        customer={customer}
        totalOrders={totalOrders}
        totalSpent={Number(totalSpent._sum.total || 0)}
        lastOrder={lastOrder}
        orders={orders}
      />

    </div>
  );
}