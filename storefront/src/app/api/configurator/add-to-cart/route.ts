import { NextRequest, NextResponse } from "next/server"
import { DesignDocSchema, ADDON_PRICES_CENTS_PLACEHOLDER } from "./pricing"

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { variantId, cartId, regionId, design: rawDesign } = body as Record<string, unknown>

  // ── 1. Validate the design document ────────────────────────────────────────
  const parsed = DesignDocSchema.safeParse(rawDesign)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid design document", details: parsed.error.flatten() },
      { status: 422 }
    )
  }
  const design = parsed.data

  if (!variantId || !cartId) {
    return NextResponse.json(
      { error: "variantId and cartId are required" },
      { status: 400 }
    )
  }

  // ── 2. Server-side price computation ───────────────────────────────────────
  // Fetch the base variant price from Medusa (never trust browser-sent price).
  const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  let baseUnitPrice = 0
  try {
    const priceRes = await fetch(
      `${BACKEND}/store/products/variants/${variantId}?region_id=${regionId ?? ""}`,
      { headers: { "x-publishable-api-key": PUB_KEY ?? "" } }
    )
    if (priceRes.ok) {
      const priceJson = await priceRes.json()
      baseUnitPrice =
        priceJson.variant?.calculated_price?.calculated_amount ?? 0
    }
  } catch {
    // If the lookup fails, we still proceed — the server will use 0 as base.
    // In production, you may want to reject here instead.
  }

  // Add-on prices (server-authoritative)
  const { SPOTLIGHT, PHOTO_FRAME, FIGURINE, CUSTOM_BG } = ADDON_PRICES_CENTS_PLACEHOLDER
  const addonTotal =
    design.lights.length * SPOTLIGHT +
    design.photoFrames.length * PHOTO_FRAME +
    design.figurines.length * FIGURINE +
    (design.background.type === "upload" ? CUSTOM_BG : 0)

  const unitPrice = baseUnitPrice + addonTotal

  const priceBreakdown = {
    baseUnitPrice,
    addons: {
      lights: design.lights.length * SPOTLIGHT,
      photoFrames: design.photoFrames.length * PHOTO_FRAME,
      figurines: design.figurines.length * FIGURINE,
      customBg: design.background.type === "upload" ? CUSTOM_BG : 0,
    },
    total: unitPrice,
  }

  // ── 3. Add to cart via Medusa addToCart endpoint ───────────────────────────
  const cartRes = await fetch(`${BACKEND}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUB_KEY ?? "",
    },
    body: JSON.stringify({
      variant_id: variantId,
      quantity: 1,
      metadata: {
        design,
        priceBreakdown,
      },
    }),
  })

  if (!cartRes.ok) {
    const errBody = await cartRes.text()
    return NextResponse.json(
      { error: "Failed to add item to cart", upstream: errBody },
      { status: cartRes.status }
    )
  }

  const cartJson = await cartRes.json()
  return NextResponse.json({ cart: cartJson.cart, priceBreakdown })
}
