import { z } from "zod"

// ─── Primitives ───────────────────────────────────────────────────────────────

const Norm = z.number().min(0).max(1) // normalised 0–1 coordinate
const Angle = z.number() // degrees

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

export const PhotoDataSchema = z.object({
  fileId: z.string(),
  url: z.string(),
  /** Pan offset from the centred-cover position, as a fraction of inner opening (-1…+1) */
  offsetX: z.number().default(0),
  offsetY: z.number().default(0),
  /** Zoom multiplier on top of the cover fit (1 = cover-fit, >1 = zoomed in) */
  scale: z.number().min(0.5).max(8).default(1),
})

export const SpotlightSchema = z.object({
  id: z.string(),
  model: z.enum(["spot1", "spot2"]),
  x: Norm,
  y: Norm,
  rot: Angle.default(0),
})

export const PhotoFrameSchema = z.object({
  id: z.string(),
  type: z.enum([
    "ornate_rect",
    "gold_oval",
    "heart_lg",
    "heart_sm",
    "square_sm",
    "center",
  ]),
  /** Top-left corner, normalised */
  x: Norm,
  y: Norm,
  /** Dimensions as fraction of canvas size */
  w: z.number().min(0.05).max(1),
  h: z.number().min(0.05).max(1),
  rot: Angle.default(0),
  photo: PhotoDataSchema.optional(),
})

export const FigurineSchema = z.object({
  id: z.string(),
  type: z.enum(["male_1", "male_2", "female_1", "female_2"]),
  x: Norm,
  y: Norm,
  scale: z.number().min(0.5).max(3).default(1),
  flip: z.boolean().default(false),
})

export const BackgroundSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("color"), value: z.string() }),
  z.object({
    type: z.literal("preset"),
    value: z.enum(["design1", "design2", "design3"]),
  }),
  z.object({
    type: z.literal("upload"),
    fileId: z.string(),
    url: z.string(),
  }),
])

// ─── Root ─────────────────────────────────────────────────────────────────────

export const DesignDocSchema = z.object({
  version: z.literal(1),
  frame: z.object({
    size: z.enum(["20x20", "30x30", "40x40"]),
    color: z.enum(["black", "white"]),
  }),
  background: BackgroundSchema,
  lights: z.array(SpotlightSchema),
  photoFrames: z.array(PhotoFrameSchema),
  figurines: z.array(FigurineSchema),
  /** Rendered PNG uploaded after canvas.toDataURL() */
  previewUrl: z.string().optional(),
})

// ─── Exported types ───────────────────────────────────────────────────────────

export type DesignDoc = z.infer<typeof DesignDocSchema>
export type PhotoData = z.infer<typeof PhotoDataSchema>
export type Spotlight = z.infer<typeof SpotlightSchema>
export type PhotoFrame = z.infer<typeof PhotoFrameSchema>
export type Figurine = z.infer<typeof FigurineSchema>
export type Background = z.infer<typeof BackgroundSchema>
export type PhotoFrameType = PhotoFrame["type"]
export type SpotlightModel = Spotlight["model"]
export type FigurineType = Figurine["type"]
export type FrameSize = DesignDoc["frame"]["size"]
export type FrameColor = DesignDoc["frame"]["color"]

// ─── DPI check ────────────────────────────────────────────────────────────────

/**
 * Returns a warning string if the uploaded image is too low-res for the chosen
 * frame size, or null if quality is acceptable.
 * @param naturalW   Image naturalWidth in pixels
 * @param frame      The PhotoFrame it will fill
 * @param frameSizeCm Physical size of the outer frame (e.g. 30 for "30x30")
 * @param minDpi     Minimum acceptable DPI (default 150)
 */
export function checkPhotoDpi(
  naturalW: number,
  frame: Pick<PhotoFrame, "w">,
  frameSizeCm: number,
  minDpi = 150
): string | null {
  // inner opening ≈ 78% of the frame element width
  const openingCm = frame.w * frameSizeCm * 0.78
  const requiredPx = (openingCm / 2.54) * minDpi
  if (naturalW < requiredPx) {
    const actualDpi = Math.round(naturalW / (openingCm / 2.54))
    return `Image resolution is low (~${actualDpi} DPI). For best print quality, upload at least ${Math.ceil(requiredPx)} px wide.`
  }
  return null
}
