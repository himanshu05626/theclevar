// app/admin/products/page.jsx
import AddProductClient from "./AddProductClient";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  try {
    return await prisma.product_category.findMany({
      where: {
        is_active: true,
        is_deleted: false,
      },
      orderBy: {
        path: "asc",
      },
      select: {
        id: true,
        name: true,
        path: true,
      },
    });
  } catch (error) {
    console.error("❌ getCategories error:", error);
    return [];
  }
}

export default async function AddProductPage({ searchParams }) {
  const categories = await getCategories();

  return <AddProductClient categories={categories} searchParams={searchParams} />;
}
