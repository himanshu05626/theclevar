// lib/requireUser.js
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.id) return null;

  // 🔐 Session check
  const session = await prisma.customer_session.findFirst({
    where: {
      customer_list_id: payload.id,
      token,
      is_expired: false,
      token_expiry: { gt: new Date() },
    },
    include: {
      customer: true, // 🔗 join customer table
    },
  });

  if (!session) return null;

  // 🚫 Block / inactive checks
  if (
    session.customer?.is_active !== true ||
    session.customer?.is_blocked === true
  ) {
    return null;
  }

  // ✅ Valid user
  return payload;
}
