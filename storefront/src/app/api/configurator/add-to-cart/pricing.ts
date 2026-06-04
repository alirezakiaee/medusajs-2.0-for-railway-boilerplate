/**
 * Re-export DesignDocSchema for use in the API route without pulling in the
 * entire modules/configurator package (edge-runtime safe).
 */
export { DesignDocSchema } from "@modules/configurator/lib/designDoc"

/** Add-on prices in cents — single source of truth for server pricing */
export const ADDON_PRICES_CENTS_PLACEHOLDER = {
  SPOTLIGHT:   500,   // $5 per spotlight
  PHOTO_FRAME: 1000,  // $10 per photo frame
  FIGURINE:    800,   // $8 per figurine
  CUSTOM_BG:   500,   // $5 for a custom background upload
}
