export const CANVAS_SIZE = 480 // px — screen render size

/** Outer frame border thickness in pixels */
export const FRAME_BORDER_PX = 22

/** Physical size in cm per frame SKU (used for DPI calculations) */
export const FRAME_SIZE_CM: Record<string, number> = {
  "20x20": 20,
  "30x30": 30,
  "40x40": 40,
}

/** Default photo frame dimensions as fraction of CANVAS_SIZE */
export const FRAME_DEFAULT_DIMS: Record<string, { w: number; h: number }> = {
  ornate_rect: { w: 100 / CANVAS_SIZE, h: 130 / CANVAS_SIZE },
  gold_oval:   { w: 100 / CANVAS_SIZE, h: 120 / CANVAS_SIZE },
  heart_lg:    { w: 110 / CANVAS_SIZE, h: 105 / CANVAS_SIZE },
  heart_sm:    { w: 70  / CANVAS_SIZE, h:  67 / CANVAS_SIZE },
  square_sm:   { w: 100 / CANVAS_SIZE, h: 100 / CANVAS_SIZE },
  center:      { w: 140 / CANVAS_SIZE, h: 165 / CANVAS_SIZE },
}

/** Default spotlight dimensions as fraction of CANVAS_SIZE */
export const SPOTLIGHT_DEFAULT_DIMS: Record<string, { w: number; h: number }> = {
  spot1: { w: 50 / CANVAS_SIZE, h: 70 / CANVAS_SIZE },
  spot2: { w: 80 / CANVAS_SIZE, h: 70 / CANVAS_SIZE },
}

/** Default figurine dimensions as fraction of CANVAS_SIZE */
export const FIGURINE_DEFAULT_DIMS: Record<string, { w: number; h: number }> = {
  male_1:   { w: 32 / CANVAS_SIZE, h: 72 / CANVAS_SIZE },
  male_2:   { w: 32 / CANVAS_SIZE, h: 72 / CANVAS_SIZE },
  female_1: { w: 32 / CANVAS_SIZE, h: 72 / CANVAS_SIZE },
  female_2: { w: 32 / CANVAS_SIZE, h: 72 / CANVAS_SIZE },
}

export const PHOTO_FRAME_LABELS: Record<string, string> = {
  ornate_rect: "Ornate Gold Rectangular",
  gold_oval:   "Large Ornate Gold Oval",
  heart_lg:    "Large Gold Heart",
  heart_sm:    "Small Gold Heart",
  square_sm:   "Ornate Gold Square",
  center:      "Center Display Frame",
}

export const FRAME_SIZE_LABELS: Record<string, string> = {
  "20x20": "20 × 20 cm",
  "30x30": "30 × 30 cm",
  "40x40": "40 × 40 cm",
}

export const CONFIGURATOR_STEPS = [
  { number: 1, title: "Frame Size",    description: "Choose your frame dimensions" },
  { number: 2, title: "Frame Color",   description: "Select the frame finish" },
  { number: 3, title: "Background",    description: "Design your gallery wall" },
  { number: 4, title: "Spotlights",    description: "Add gallery lighting" },
  { number: 5, title: "Photo Frames",  description: "Add decorative inner frames" },
  { number: 6, title: "Your Photos",   description: "Upload & place your memories" },
  { number: 7, title: "Figurines",     description: "Add tiny gallery visitors" },
  { number: 8, title: "Review",        description: "Final preview & add to cart" },
]

/** Add-on pricing (cents) — server validates these, browser just shows them */
export const ADDON_PRICES_CENTS = {
  spotlight: 500,    // $5 per spotlight
  photoFrame: 1000,  // $10 per photo frame
  figurine: 800,     // $8 per figurine
  customBg: 500,     // $5 for custom background upload
}
