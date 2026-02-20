"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { redirect } from "next/navigation";

/* ---------------- SLUG UTILITY ---------------- */
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* ---------------- SERVER ACTION ---------------- */
export async function updateProduct(prevState, formData) {

    const values = Object.fromEntries(formData);
    const errors = {};
    const productId = Number(values.id);
    /* ---------------- VALIDATION ---------------- */
    if (!values.name?.trim()) {
        errors.name = "Product name is required";
    }
    if (!values.meta_title?.trim()) {
        errors.meta_title = "Meta title is required";
    }
    if (!values.meta_description?.trim()) {
        errors.meta_description = "Meta description is required";
    }
    if (!values.focus_keyword?.trim()) {
        errors.focus_keyword = "Focus keyword is required";
    }
    if (!values.measure_unit?.trim()) {
        errors.measure_unit = "Measure unit is required";
    }
    if (!values.stepper_value?.trim()) {
        errors.stepper_value = "Stepper value is required";
    }





    let category_id;
    let category_path;

    if (!values.category?.trim()) {
        console.log('=======================no category===================');
        errors.category = "Category is required";
    } else {
        const [id, path] = values.category.split("||");

        if (!id || !path) {
            errors.category = "Invalid category selected";
        } else {
            category_id = Number(id);
            category_path = path;
        }
    }
    /* ---------------- SKU UNIQUE CHECK ---------------- */
    if (values.sku?.trim()) {
        const skuExists = await prisma.product_list.findFirst({
            where: {
                sku: values.sku,
                NOT: { id: productId },
            },
        });

        if (skuExists) {
            errors.sku = "This SKU already exists";
        }
    }
    let images = [];

    if (values.images) {
        try {
            images = JSON.parse(values.images);
        } catch (e) {
            errors.images = "Invalid images data";
        }
    }

    if (!values.regular_price || Number(values.regular_price) <= 0) {
        errors.regular_price = "Regular price must be greater than 0";
    }

    if (!values.stock_qty || Number(values.stock_qty) < 0) {
        errors.stock_qty = "Stock quantity is required";
    }
    const stockQty = Number(values.stock_qty);
const lowStockThreshold = values.low_stock_threshold
  ? Number(values.low_stock_threshold)
  : null;
    if (
    lowStockThreshold !== null &&
    (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0)
) {
    errors.low_stock_threshold = "Low stock threshold must be 0 or greater";
}

/* ❌ CRITICAL RULE */
if (
    lowStockThreshold !== null &&
    stockQty >= 0 &&
    lowStockThreshold > stockQty
) {
    errors.low_stock_threshold =
        "Low stock threshold cannot be greater than stock quantity";
}

    // ❌ If validation fails
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
            values,
        };
    }

    const admin = await requireAdmin();
    if (!admin) {
        console.log('user not authorized')
        return {
            success: false,
            errors: {
                general: "Unauthorized. Please log in again.",
            },
        };
    }
    console.log('==============sccuess=================')
    try {
        /* ---------------- UNIQUE SLUG ---------------- */
        const baseSlug = generateSlug(values.name);
        const addslug = `${category_path}/${baseSlug}`;

        let slug = addslug;
        let counter = 1;

        while (
            await prisma.product_list.findFirst({
                where: {
                    slug,
                    NOT: { id: productId },
                },
            })
        ) {
            slug = `${addslug}-${counter++}`;
        }

        console.log('======================0===================')

        /* ---------------- CREATE PRODUCT ---------------- */
        const product = await prisma.product_list.update({
            where: { id: productId },
            data: {
                name: values.name,
                slug,
                sku: values.sku || null,
                category: {
    connect: { id: category_id }
},
                low_stock_threshold: Number(values.low_stock_threshold) || null,
                description: values.description || null,
                stepper_value: Number(values.stepper_value) || null,
                regular_price: Number(values.regular_price),
                sale_price: values.sale_price ? Number(values.sale_price) : null,
                stock_qty: Number(values.stock_qty),
            },
        });

        console.log('======================1===================')
        /* ---------------- PRODUCT IMAGES ---------------- */
        // CASE 1: No images → delete all
        console.log('imagesimages', images)

        // CASE 1: No images → soft delete all
      if (!Array.isArray(images) || images.length === 0) {
    await prisma.product_images.updateMany({
        where: { product_list_id: productId },
        data: { is_deleted: true, is_primary: false },
    });

    await prisma.product_meta_data.update({
        where: { product_list_id: productId },
        data: {
            meta_title: values.meta_title,
            meta_description: values.meta_description,
            focus_keyword: values.focus_keyword,
        },
    });

    return { success: true, values };
}


        /* ───────────────────────────────
           1️⃣ Normalize & dedupe URLs
        ─────────────────────────────── */
        const incomingUrls = [
            ...new Set(
                images
                    .map(img => img?.image_url ?? img?.url)
                    .filter(url => typeof url === "string" && url.startsWith("http"))
            ),
        ];

        console.log("🔗 Incoming image URLs:", incomingUrls);

        /* ───────────────────────────────
           2️⃣ Soft delete ALL images
        ─────────────────────────────── */
        await prisma.product_images.updateMany({
            where: { product_list_id: productId },
            data: { is_deleted: true, is_primary: false },
        });

        /* ───────────────────────────────
           3️⃣ Restore incoming images
        ─────────────────────────────── */
        await prisma.product_images.updateMany({
            where: {
                product_list_id: productId,
                image_url: { in: incomingUrls },
            },
            data: { is_deleted: false },
        });

        /* ───────────────────────────────
           4️⃣ Fetch existing active images
        ─────────────────────────────── */
        const existingImages = await prisma.product_images.findMany({
            where: {
                product_list_id: productId,
                image_url: { in: incomingUrls },
                is_deleted: false,
            },
            distinct: ["image_url"],
            select: { image_url: true },
        });

        const existingUrls = existingImages.map(i => i.image_url);

        /* ───────────────────────────────
           5️⃣ Insert missing images
        ─────────────────────────────── */
        const newImages = incomingUrls
            .filter(url => !existingUrls.includes(url))
            .map(url => ({
                product_list_id: productId,
                image_url: url,
                is_deleted: false,
                is_primary: false, // ❗ NEVER set primary here
            }));

        if (newImages.length) {
            await prisma.product_images.createMany({ data: newImages });
        }

        /* ───────────────────────────────
           6️⃣ SET PRIMARY IMAGE (LAST)
        ─────────────────────────────── */
        const primaryUrl =
            images.find(img => img.is_primary)?.image_url ||
            images.find(img => img.is_primary)?.url;

        if (primaryUrl) {
            const primaryImage = await prisma.product_images.findFirst({
                where: {
                    product_list_id: productId,
                    image_url: primaryUrl,
                    is_deleted: false,
                },
                orderBy: { id: "asc" }, // ensure ONE row
            });

            if (primaryImage) {
                await prisma.product_images.update({
                    where: { id: primaryImage.id },
                    data: { is_primary: true },
                });
            }
        }





        /* ---------------- SEO DATA ---------------- */
        await prisma.product_meta_data.update({
            where: { product_list_id: productId },
            data: {
                meta_title: values.meta_title,
                meta_description: values.meta_description,
                focus_keyword: values.focus_keyword,
            },
        });

        try {
            console.log('======================2===================')
            // redirect("/admin/products/add?success=1");

            return {
                success: true,
                values,

            };
        } catch (err) {
            console.error("Add product error:", err)
        }


    } catch (error) {
        console.error("Add product error:", error);

        return {
            success: false,
            errors: {
                general: "Something went wrong. Please try again.",
            },
            values,
        };
    }
}
