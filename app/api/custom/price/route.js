import { NextResponse } from "next/server";

// Example pricing logic (customize as needed)
const BASE_PRICES = {
  Cotton: { 160: 400, 180: 450, 200: 500 },
  Polyester: { 160: 350, 180: 400, 200: 450 },
  "Cotton Blend": { 160: 375, 180: 425, 200: 475 },
};

export async function POST(req) {
  try {
    const { size, fabric, gsm } = await req.json();
    // You can add more complex logic here (e.g., size upcharge)
    let price = BASE_PRICES[fabric]?.[gsm] || 0;
    if (["XL", "XXL"].includes(size)) price += 50; // Example upcharge
    return NextResponse.json({ success: true, price });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
  }
}
