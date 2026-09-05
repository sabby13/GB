import { NextResponse } from "next/server";

/**
 * Approximate visitor location — WITHOUT storing an IP address.
 *
 * On Vercel, every request carries edge-geo headers derived from the IP at the
 * network layer. We read only the coarse country/city and hand them back; the
 * IP itself is never exposed to the client or written to the database.
 *
 * Locally (or off Vercel) these headers are absent, so we return nulls.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const h = request.headers;
  const country = h.get("x-vercel-ip-country");
  const cityRaw = h.get("x-vercel-ip-city");

  return NextResponse.json(
    {
      country: country || null,
      // Vercel URL-encodes the city header (e.g. "San%20Francisco").
      city: cityRaw ? safeDecode(cityRaw) : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

function safeDecode(v: string): string {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
