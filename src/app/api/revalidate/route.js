import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const REPLAY_TOLERANCE_MS = 5 * 60 * 1000;

function timingSafeHexEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Revalidation secret is not configured" }, { status: 500 });
  }

  const signature = req.headers.get("x-throve-signature");
  const timestamp = req.headers.get("x-throve-timestamp");
  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 401 });
  }

  const numericTs = Number(timestamp);
  if (!Number.isFinite(numericTs)) {
    return NextResponse.json({ error: "Invalid webhook timestamp" }, { status: 401 });
  }
  const tsMs = numericTs > 1e12 ? numericTs : numericTs * 1000;
  if (Math.abs(Date.now() - tsMs) > REPLAY_TOLERANCE_MS) {
    return NextResponse.json({ error: "Stale webhook timestamp" }, { status: 401 });
  }

  const rawBody = await req.text();
  const expectedHmac = crypto
    .createHmac("sha256", secret)
    .update(`${String(timestamp)}.${rawBody}`)
    .digest("hex");

  if (!timingSafeHexEqual(signature.trim().toLowerCase(), `sha256=${expectedHmac}`.toLowerCase())) {
    return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed webhook JSON" }, { status: 400 });
  }

  const tags = Array.isArray(body?.tags) ? body.tags.filter((t) => typeof t === "string" && t.length > 0) : [];
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ ok: true, revalidated: tags });
}

