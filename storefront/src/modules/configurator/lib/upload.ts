/**
 * Upload a File to the Medusa file module.
 * Returns { fileId, url } — never stores bytes in state; only the URL lives in
 * the design doc / line-item metadata.
 *
 * Falls back to a local object URL in dev when the backend upload endpoint is
 * unavailable (useful for offline / early-stage development).
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? ""
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

export interface UploadedFile {
  fileId: string
  url: string
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData()
  formData.append("files", file)

  try {
    const res = await fetch(`${BACKEND}/store/uploads`, {
      method: "POST",
      headers: { "x-publishable-api-key": PUB_KEY },
      body: formData,
    })

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

    const json = await res.json()
    const f = json.files?.[0]
    if (!f?.id || !f?.url) throw new Error("Unexpected upload response shape")

    return { fileId: f.id, url: f.url }
  } catch (err) {
    // ── Dev fallback: use a temporary object URL ──────────────────────────
    // This is NOT suitable for production — object URLs are not persistent.
    console.warn(
      "[configurator/upload] Medusa upload endpoint unavailable, using " +
        "temporary object URL. Configure the Medusa File Module for production.",
      err
    )
    const url = URL.createObjectURL(file)
    return { fileId: `local-${Date.now()}`, url }
  }
}

/**
 * Upload a base64 / data-URL string as a PNG file (used for the canvas preview).
 */
export async function uploadDataUrl(
  dataUrl: string,
  filename = "preview.png"
): Promise<UploadedFile> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const file = new File([blob], filename, { type: "image/png" })
  return uploadFile(file)
}
