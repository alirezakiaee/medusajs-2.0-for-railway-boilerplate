"use client"

import { useState } from "react"
import { useDesignStore } from "../../store/useDesignStore"
import { FRAME_SIZE_LABELS, PHOTO_FRAME_LABELS } from "../../lib/constants"

export function SummaryStep() {
  const frame       = useDesignStore((s) => s.frame)
  const background  = useDesignStore((s) => s.background)
  const lights      = useDesignStore((s) => s.lights)
  const photoFrames = useDesignStore((s) => s.photoFrames)
  const figurines   = useDesignStore((s) => s.figurines)
  const getDesignDoc = useDesignStore((s) => s.getDesignDoc)
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const bgDescription = () => {
    if (background.type === "color") {
      const map: Record<string, string> = { "#111111": "Gallery Black", "#f8f8f5": "Classic White", "#2d4a2d": "Victorian Green" }
      return `Plain — ${map[background.value] ?? background.value}`
    }
    if (background.type === "preset") {
      const map: Record<string, string> = { design1: "Crimson Damask", design2: "Midnight Geometry", design3: "Sage Linen" }
      return `Pattern — ${map[background.value] ?? background.value}`
    }
    return "Custom uploaded image"
  }

  const framesWithPhotos = photoFrames.filter((f) => f.photo).length
  const maleCount   = figurines.filter((f) => f.type === "male_1" || f.type === "male_2").length
  const femaleCount = figurines.filter((f) => f.type === "female_1" || f.type === "female_2").length

  const handleOrder = async () => {
    setStatus("loading")
    setErrorMsg("")
    try {
      // In production: replace these with real IDs fetched from Medusa
      const variantId = process.env.NEXT_PUBLIC_GALLERY_FRAME_VARIANT_ID ?? ""
      const cartId    = ""
      const design    = getDesignDoc()
      if (!variantId) {
        // No variant configured — just show confirmation
        setStatus("done")
        return
      }
      const res = await fetch("/api/configurator/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, cartId, design }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setStatus("done")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error")
      setStatus("error")
    }
  }

  const rows: [string, string][] = [
    ["Frame Size",  FRAME_SIZE_LABELS[frame.size]],
    ["Frame Color", frame.color === "black" ? "Matte Black" : "Pearl White"],
    ["Background",  bgDescription()],
    ["Spotlights",  lights.length ? `${lights.length} fixture${lights.length !== 1 ? "s" : ""}` : "None"],
    ["Photo Frames", photoFrames.length ? `${photoFrames.length} frame${photoFrames.length !== 1 ? "s" : ""} · ${framesWithPhotos} with photos` : "None"],
    ["Figurines",   figurines.length ? [maleCount > 0 ? `${maleCount} male` : "", femaleCount > 0 ? `${femaleCount} female` : ""].filter(Boolean).join(", ") : "None"],
  ]

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Review Your Configuration</h3>
        <p className="text-sm text-gray-500 mt-1">
          A summary of your Personalized Miniature Art Gallery Memory Frame.
        </p>
      </div>

      {/* Summary table */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between items-center px-4 py-3 text-sm ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800 text-right max-w-[55%]">{value}</span>
          </div>
        ))}
      </div>

      {/* Frame types list */}
      {photoFrames.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Photo Frame Types</p>
          {photoFrames.map((f, idx) => (
            <div key={f.id} className="flex items-center justify-between text-xs px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-lg">
              <span className="text-yellow-800">Frame {idx + 1} — {PHOTO_FRAME_LABELS[f.type]}</span>
              <span className={f.photo ? "text-green-600 font-medium" : "text-gray-400"}>{f.photo ? "✓ Photo" : "No photo"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Handcraft notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-amber-800">Handcrafted to Order</p>
        <p className="text-xs text-amber-700 mt-1">
          Your miniature gallery is individually crafted based on your configuration.
          Production takes 5–7 business days. We will contact you to confirm pricing
          and details after your request.
        </p>
      </div>

      {status === "done" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800 font-medium">
          ✓ Order request received! We will contact you to confirm pricing and production details.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleOrder}
        disabled={status === "loading" || status === "done"}
        className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-colors text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Placing order…" : status === "done" ? "Order placed ✓" : "Request Custom Order →"}
      </button>
    </div>
  )
}
