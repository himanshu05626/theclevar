import { prisma } from "@/lib/prisma";
import { generateVariants } from "@/lib/compressWithSharp";
import { uploadBuffer } from "@/lib/uploadImageHelper";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  // 🔐 Enable this in production
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  console.log("Secure Vercel cron executed");

  try {
    // 1️⃣ Get pending images (limit for safety)
    const images = await prisma.product_images.findMany({
      where: {
        is_variant: false,
        is_deleted: false,
      },
      take: 5, // prevent timeout (recommended)
    });

    console.log("Pending images:", images.length);

    for (const image of images) {
      try {
        console.log("Processing image:", image.id);

        // 2️⃣ Download original image
        const res = await fetch(image.image_url);
        if (!res.ok) throw new Error("Failed to fetch image");

        const buffer = Buffer.from(await res.arrayBuffer());

        // 3️⃣ Generate variants using Sharp
        const variants = await generateVariants(buffer);

        const uploadedUrls = {};

        // 4️⃣ Upload variants to R2
        await Promise.all(
          Object.entries(variants).map(async ([size, base64]) => {
            const binary = Buffer.from(base64, "base64");

            const url = await uploadBuffer(
              binary,
              `${image.id}_${size}.webp`,
              "productImage"
            );

            uploadedUrls[`url_${size}`] = url;
          })
        );

        // 5️⃣ Update DB
        await prisma.product_images.update({
          where: { id: image.id },
          data: {
            ...uploadedUrls,
            is_variant: true,
          },
        });

        console.log("Completed:", image.id);

      } catch (err) {
        console.error("Failed image:", image.id, err);
      }
    }

    return Response.json({
      success: true,
      processed: images.length,
    });

  } catch (error) {
    console.error("Cron error:", error);

    return Response.json(
      { success: false, error: "Cron failed" },
      { status: 500 }
    );
  }
}
