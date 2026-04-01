// app/admin/(routing)/product/page.jsx

import { prisma } from "@/lib/prisma";
import ViewProduct from "./ViewProduct";


export const metadata = {
    title: "Products | Admin",
};

async function getProducts(searchParams) {
    try {
        const sp =
            searchParams instanceof Promise
                ? await searchParams
                : searchParams ?? {};

        const page = Math.max(Number(sp.page) || 1, 1);
        const limit = Math.min(Number(sp.limit) || 10, 100);
        const search = typeof sp.search === "string" ? sp.search.trim() : "";
        const category = typeof sp.category === "string" ? sp.category : "";
        const stock = typeof sp.stock === "string" ? sp.stock : "";

        const skip = (page - 1) * limit;
        const andFilters = [];

        if (search) {
            andFilters.push({
                OR: [
                    { name: { contains: search } },
                    { sku: { contains: search } },
                ],
            });
        }

        if (category && !Number.isNaN(Number(category))) {
            andFilters.push({
                category_id: Number(category),
            });
        }

        if (stock === "in") {
            andFilters.push({
                stock_qty: { gt: 0 },
            });
        } else if (stock === "out") {
            andFilters.push({
                stock_qty: { lte: 0 },
            });
        }

        const where = {
            is_deleted: false,
            ...(andFilters.length > 0 && { AND: andFilters }),
        };

        const [products, total] = await Promise.all([
            prisma.product_list.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    created_at: "desc",
                },
                include: {
                    category: true,
                    images: {
                        where: {
                            is_deleted: false,
                        },
                    },
                },
            }),
            prisma.product_list.count({ where }),
        ]);

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("❌ getProducts error:", error);

        return {
            data: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            },
        };
    }
}

export default async function ProductsPage({ searchParams }) {
    // ✅ ALWAYS await searchParams
    const data = await getProducts(searchParams);
    return (
        <ViewProduct
            products={data.data}
            pagination={data.pagination}
            searchParams={
                searchParams instanceof Promise
                    ? await searchParams
                    : searchParams ?? {}
            }
        />
    );
}