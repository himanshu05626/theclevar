"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

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

    console.log("🟢 [updateProduct] Action Started");

    const values = Object.fromEntries(formData);
    const errors = {};
    const productId = Number(values.id);

    console.log("📦 Incoming Form Values:", values);
    console.log("🆔 Product ID:", productId);

    /* ---------------- VALIDATION ---------------- */

    if (!values.name?.trim()) errors.name = "Product name is required";
    if (!values.meta_title?.trim()) errors.meta_title = "Meta title is required";
    if (!values.meta_description?.trim()) errors.meta_description = "Meta description is required";
    if (!values.focus_keyword?.trim()) errors.focus_keyword = "Focus keyword is required";
    if (!values.stepper_value?.trim()) errors.stepper_value = "Stepper value is required";

    let category_id;
    let category_path;

    if (!values.category?.trim()) {
        console.warn("⚠️ Category missing");
        errors.category = "Category is required";
    } else {
        const [id, path] = values.category.split("||");

        if (!id || !path) {
            console.warn("⚠️ Invalid category format:", values.category);
            errors.category = "Invalid category selected";
        } else {
            category_id = Number(id);
            category_path = path;
            console.log("📂 Category Parsed:", { category_id, category_path });
        }
    }

    /* ---------------- SKU UNIQUE CHECK ---------------- */
    if (values.sku?.trim()) {
        console.log("🔎 Checking SKU uniqueness:", values.sku);

        const skuExists = await prisma.product_list.findFirst({
            where: {
                sku: values.sku,
                NOT: { id: productId },
            },
        });

        if (skuExists) {
            console.warn("⚠️ Duplicate SKU Found");
            errors.sku = "This SKU already exists";
        }
    }

    /* ---------------- IMAGE PARSE ---------------- */
    let images = [];
    let deletedImageIds = [];
    let variants = [];
    if (values.images) {
        try {
            images = JSON.parse(values.images);
            console.log("🖼 Parsed Images:", images);
        } catch (e) {
            console.error("❌ Invalid images JSON:", e);
            errors.images = "Invalid images data";
        }
    }

    if (values.deletedImageIds) {
        try {
            deletedImageIds = JSON.parse(values.deletedImageIds);
            console.log("🗑 Parsed Deleted Image IDs:", deletedImageIds);
        } catch (e) {
            console.error("❌ Invalid deletedImageIds JSON:", e);
        }
    }

    if (values.variants) {
        try {
            variants = JSON.parse(values.variants);
            console.log("📐 Parsed Variants:", variants);
        } catch (e) {
            console.error("❌ Invalid variants JSON:", e);
            errors.variants = "Invalid variants data";
        }
    }

    const normalizedVariants = Array.isArray(variants)
        ? variants
            .map((variant) => ({
                id: variant?.id ? Number(variant.id) : null,
                size: String(variant?.size ?? "").trim(),
                stock_qty: Number(variant?.stock_qty),
            }))
            .filter((variant) => variant.size.length > 0 || variant.id)
        : [];

    if (!normalizedVariants.length) {
        errors.variants = "At least one size variant is required";
    } else {
        const duplicateSizes = normalizedVariants.reduce((map, variant) => {
            const key = variant.size.toLowerCase();
            map[key] = (map[key] || 0) + 1;
            return map;
        }, {});

        if (Object.values(duplicateSizes).some((count) => count > 1)) {
            errors.variants = "Variant sizes must be unique";
        }

        for (const variant of normalizedVariants) {
            if (!variant.size) {
                errors.variants = "Each variant must have a size";
                break;
            }

            if (!Number.isInteger(variant.stock_qty) || variant.stock_qty < 0) {
                errors.variants = "Variant stock must be 0 or greater";
                break;
            }
        }
    }

    /* ---------------- PRICE & STOCK ---------------- */

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

    if (
        lowStockThreshold !== null &&
        stockQty >= 0 &&
        lowStockThreshold > stockQty
    ) {
        errors.low_stock_threshold =
            "Low stock threshold cannot be greater than stock quantity";
    }

    /* ---------------- RETURN IF VALIDATION FAILS ---------------- */

    if (Object.keys(errors).length > 0) {
        console.warn("❌ Validation Failed:", errors);
        return { success: false, errors, values };
    }

    /* ---------------- ADMIN CHECK ---------------- */

    console.log("🔐 Checking Admin Access...");
    const admin = await requireAdmin();

    if (!admin) {
        console.error("❌ Unauthorized Access Attempt");
        return {
            success: false,
            errors: { general: "Unauthorized. Please log in again." },
        };
    }

    console.log("✅ Admin Verified:", admin.id);

    try {
        /* ---------------- UNIQUE SLUG ---------------- */

        const baseSlug = generateSlug(values.name);
        let slug = baseSlug;
        let counter = 1;

        console.log("🔗 Generating slug from:", baseSlug);

        while (
            await prisma.product_list.findFirst({
                where: {
                    slug,
                    NOT: { id: productId },
                },
            })
        ) {
            slug = `${baseSlug}-${counter++}`;
        }

        console.log("✅ Final Slug:", slug);

        /* ---------------- UPDATE PRODUCT ---------------- */

        const normalizedImages = Array.isArray(images)
            ? images
                .map((img) => ({
                    id: img?.id ? Number(img.id) : null,
                    url: img?.image_url ?? img?.url ?? "",
                    is_primary: Boolean(img?.is_primary),
                }))
                .filter((img) => typeof img.url === "string" && img.url.startsWith("http"))
            : [];

        const product = await prisma.$transaction(async (tx) => {
            console.log("💾 Updating Product...");

            const updatedProduct = await tx.product_list.update({
                where: { id: productId },
                data: {
                    name: values.name,
                    slug,
                    sku: values.sku || null,
                    category: { connect: { id: category_id } },
                    low_stock_threshold: lowStockThreshold,
                    description: values.description || null,
                    stepper_value: Number(values.stepper_value) || null,
                    regular_price: Number(values.regular_price),
                    sale_price: values.sale_price ? Number(values.sale_price) : null,
                    stock_qty: stockQty,
                },
            });

            console.log("✅ Product Updated:", updatedProduct.id);

            /* ---------------- VARIANT HANDLING ---------------- */
            const submittedVariantIds = normalizedVariants
                .map((variant) => variant.id)
                .filter((id) => Number.isInteger(id));

            await tx.product_variant.updateMany({
                where: {
                    product_list_id: productId,
                    id: { notIn: submittedVariantIds.length > 0 ? submittedVariantIds : [-1] },
                },
                data: { is_deleted: true },
            });

            for (const variant of normalizedVariants) {
                if (variant.id) {
                    await tx.product_variant.update({
                        where: { id: variant.id },
                        data: {
                            size: variant.size,
                            stock_qty: variant.stock_qty,
                            is_deleted: false,
                        },
                    });
                } else {
                    await tx.product_variant.create({
                        data: {
                            product_list_id: productId,
                            size: variant.size,
                            stock_qty: variant.stock_qty,
                            is_deleted: false,
                        },
                    });
                }
            }

            /* ---------------- IMAGE HANDLING ---------------- */

            if (!normalizedImages.length) {
                console.log("🧹 No images provided → soft deleting all");

                await tx.product_images.updateMany({
                    where: { product_list_id: productId },
                    data: { is_deleted: true, is_primary: false },
                });
            } else {
                console.log("🖼 Processing Images...");

                const keepIds = normalizedImages
                    .map((img) => img.id)
                    .filter((id) => Number.isInteger(id));

                const keepUrlSet = new Set(normalizedImages.map((img) => img.url));

                console.log("🔗 Keep IDs:", keepIds);
                console.log("🔗 Keep URLs:", [...keepUrlSet]);

                if (deletedImageIds.length > 0) {
                    console.log("🗑 Soft-deleting images:", deletedImageIds);
                    await tx.product_images.updateMany({
                        where: {
                            id: { in: deletedImageIds },
                            product_list_id: productId,
                        },
                        data: { is_deleted: true, is_primary: false },
                    });
                }

                await tx.product_images.updateMany({
                    where: {
                        product_list_id: productId,
                        id: { notIn: keepIds.length > 0 ? keepIds : [-1] },
                    },
                    data: { is_deleted: true, is_primary: false },
                });

                if (keepIds.length > 0) {
                    await tx.product_images.updateMany({
                        where: {
                            product_list_id: productId,
                            id: { in: keepIds },
                        },
                        data: { is_deleted: false },
                    });
                }

                const existingImages = await tx.product_images.findMany({
                    where: {
                        product_list_id: productId,
                    },
                    select: {
                        id: true,
                        image_url: true,
                        is_deleted: true,
                    },
                });

                const existingUrlSet = new Set(existingImages.map((img) => img.image_url));

                const newImages = normalizedImages
                    .filter((img) => !img.id && !existingUrlSet.has(img.url))
                    .map((img) => ({
                        product_list_id: productId,
                        image_url: img.url,
                        is_deleted: false,
                        is_primary: false,
                    }));

                if (newImages.length) {
                    console.log("➕ Inserting New Images:", newImages.length);
                    await tx.product_images.createMany({ data: newImages });
                }

                const primaryImageRef = normalizedImages.find((img) => img.is_primary);

                await tx.product_images.updateMany({
                    where: { product_list_id: productId },
                    data: { is_primary: false },
                });

                if (primaryImageRef) {
                    const primaryImage = primaryImageRef.id
                        ? await tx.product_images.findFirst({
                            where: {
                                id: primaryImageRef.id,
                                product_list_id: productId,
                                is_deleted: false,
                            },
                        })
                        : await tx.product_images.findFirst({
                            where: {
                                image_url: primaryImageRef.url,
                                product_list_id: productId,
                                is_deleted: false,
                            },
                            orderBy: { id: "asc" },
                        });

                    if (primaryImage) {
                        await tx.product_images.update({
                            where: { id: primaryImage.id },
                            data: { is_primary: true },
                        });
                    }
                }
            }

            /* ---------------- SEO UPDATE ---------------- */

            console.log("🔍 Updating SEO Data...");

            await tx.product_meta_data.update({
                where: { product_list_id: productId },
                data: {
                    meta_title: values.meta_title,
                    meta_description: values.meta_description,
                    focus_keyword: values.focus_keyword,
                },
            });

            return updatedProduct;
        });

        console.log("🎉 Product Update Completed Successfully");

        return { success: true, values };

    } catch (error) {
        console.error("💥 CRITICAL ERROR in updateProduct:", error);

        return {
            success: false,
            errors: {
                general: "Something went wrong. Please try again.",
            },
            values,
        };
    }
}