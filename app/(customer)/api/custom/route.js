import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// =============================
// 🔹 R2 CONFIG
// =============================
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

// =============================
// 🔹 GEMINI IMAGE GENERATOR
// =============================
async function generateTshirtImage(prompt, hasUserImage, imageBase64) {
const systemPrompt = `
You are a professional 3D apparel mockup designer.

Create a high-quality, realistic 3D T-shirt mockup image.

INPUT:
- USER IDEA: "${prompt}"
- USER DESIGN IMAGE: ${hasUserImage ? "PROVIDED" : "NOT PROVIDED"}

CORE RULES:
- ALWAYS generate a realistic 3D T-shirt mockup
- Default view: FRONT
- If user asks "back" → show BACK side
- Slightly angled, natural 3D pose (not flat)

DESIGN SOURCE LOGIC:
1. If USER DESIGN IMAGE is PROVIDED:
   - Use the uploaded image EXACTLY as the print design
   - DO NOT redesign, modify, or reinterpret it
   - Preserve original colors, shapes, and layout
   - Fit it naturally onto the T-shirt fabric

2. If NO image is provided:
   - Generate a clean, minimal, Gen-Z style graphic from the text idea

DESIGN PLACEMENT:
- Center chest by default
- Scale properly to fit fabric
- Follow cloth perspective and folds

STYLE:
- Realistic 3D (Three.js / WebGL look)
- Premium streetwear aesthetic
- Soft lighting, subtle shadows
- Fabric wrinkles + depth

BACKGROUND:
- Plain (white / gray / soft gradient)

STRICT:
- ONLY one T-shirt
- NO humans
- NO mannequins
- NO extra objects

TEXT:
- Bold, clean, readable
- Integrated properly

OUTPUT:
Return ONLY the final 3D T-shirt mockup image.
`;
    const apiKey = process.env.GEMINI_NANO_API_KEY;
    const apiUrl =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:streamGenerateContent";

    console.log("[Gemini] Prompt:", systemPrompt);

    // ⏱ Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json",
        },
body: JSON.stringify({
  contents: [
    {
      role: "user",
      parts: [
        { text: systemPrompt },
        ...(imageBase64
          ? [{
              inlineData: {
                mimeType: "image/png",
                data: imageBase64,
              },
            }]
          : []),
      ],
    },
  ],
 generationConfig: {
  responseModalities: ["IMAGE"],
  imageConfig: {
    aspectRatio: "9:16" // 🔥 force portrait
  }
}
}),
    });

    clearTimeout(timeout);

    if (!res.ok) {
        const err = await res.text();
        console.error("[Gemini ERROR]:", err);
        throw new Error("Gemini API failed");
    }

    // ⚠️ STREAM RESPONSE (ARRAY)
    const data = await res.json();

    console.log("[Gemini] Chunks received:", data.length);

    let base64Image = null;

    for (const chunk of data) {
        const parts = chunk?.candidates?.[0]?.content?.parts || [];

        for (const part of parts) {
            if (part.inlineData?.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }

        if (base64Image) break;
    }

    if (!base64Image) {
        console.error("[Gemini] Full response:", JSON.stringify(data, null, 2));
        throw new Error("No image returned from Gemini");
    }

    console.log("[Gemini] Image generated, size:", base64Image.length);

    return base64Image;
}

// =============================
// 🔹 DAILY LIMIT
// =============================
const DAILY_LIMIT = 10;

// =============================
// 🔹 API ROUTE
// =============================
export async function POST(req) {
    try {
        const { prompt, imageBase64 } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { success: false, message: "Prompt is required" },
                { status: 400 }
            );
        }

        const user = await requireUser();
        const customer_list_id = user.id;

        console.log("[API] User:", customer_list_id);

        // 📅 Today (reset at midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 🔍 Check limit
        let limit = await prisma.tshirt_generation_limit.findUnique({
            where: {
                customer_list_id_date: {
                    customer_list_id,
                    date: today,
                },
            },
        });

        if (limit && limit.count >= DAILY_LIMIT) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Daily generation limit reached",
                },
                { status: 429 }
            );
        }

        // =============================
        // 🎨 GENERATE IMAGE
        // =============================
    const base64 = await generateTshirtImage(prompt, imageBase64 ? true : false, imageBase64);

        // =============================
        // ☁️ UPLOAD TO R2
        // =============================
        const buffer = Buffer.from(base64, "base64");
        const fileName = `userImage/${crypto.randomUUID()}.png`;

        console.log("[R2] Uploading:", fileName);

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: "image/png",
            })
        );

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

        console.log("[R2] Uploaded:", imageUrl);

        // =============================
        // 💾 SAVE TO DB
        // =============================
        const record = await prisma.tshirt_image_generation.create({
            data: {
                customer_list_id,
                prompt,
                image_url: imageUrl,
            },
        });

        console.log("[DB] Saved ID:", record.id);

        // =============================
        // 📊 UPDATE LIMIT
        // =============================
        if (limit) {
            await prisma.tshirt_generation_limit.update({
                where: { id: limit.id },
                data: {
                    count: { increment: 1 },
                },
            });
        } else {
            await prisma.tshirt_generation_limit.create({
                data: {
                    customer_list_id,
                    date: today,
                    count: 1,
                },
            });
        }

        // =============================
        // ✅ RESPONSE
        // =============================
        return NextResponse.json({
            success: true,
            id: record.id,
            imageUrl,
        });
    } catch (error) {
        console.error("[API ERROR]:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.name === "AbortError"
                        ? "Request timed out"
                        : error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const user = await requireUser();
        const customer_list_id = user.id;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [total, images] = await Promise.all([
            prisma.tshirt_image_generation.count({ where: { customer_list_id } }),
            prisma.tshirt_image_generation.findMany({
                where: { customer_list_id },
                orderBy: { id: "desc" },
                skip,
                take: limit,
            })
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return NextResponse.json({
            success: true,
            data: images,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        });
    } catch (error) {
        console.error("[API ERROR]:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}