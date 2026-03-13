import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "image/jpeg";

    const res = await fetch(
      "https://ai.theclevar.com/webhook/fetch-info-by-img",
      {
        method: "POST",
        headers: {
          "Content-Type": contentType
        },
        body: Buffer.from(arrayBuffer)
      }
    );

    const data = await res.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "AI service failed",
      },
      { status: 500 }
    );
  }
}