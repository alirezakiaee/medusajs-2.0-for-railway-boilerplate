"use client"

import { useRef } from "react"
import { useDesignStore } from "../../store/useDesignStore"
import { uploadFile } from "../../lib/upload"
import type { Background } from "../../lib/designDoc"

const PLAIN_COLORS: { value: string; label: string; bg: string; textColor: string }[] = [
  { value: "#111111", label: "Gallery Black",    bg: "#111111", textColor: "#fff" },
  { value: "#f8f8f5", label: "Classic White",    bg: "#f8f8f5", textColor: "#333" },
  { value: "#2d4a2d", label: "Victorian Green",  bg: "#2d4a2d", textColor: "#d4edda" },
]

const DESIGNS: { value: "design1" | "design2" | "design3"; label: string; style: React.CSSProperties }[] = [
  {
    value: "design1",
    label: "Crimson Damask",
    style: {
      backgroundColor: "#8B1A1A",
      backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,0.09) 8px,rgba(0,0,0,0.09) 16px)",
    },
  },
  {
    value: "design2",
    label: "Midnight Geometry",
    style: {
      backgroundColor: "#1a1a4e",
      backgroundImage: "radial-gradient(circle,rgba(212,175,55,0.45) 1px,transparent 1px)",
      backgroundSize: "20px 20px",
    },
  },
  {
    value: "design3",
    label: "Sage Linen",
    style: {
      backgroundColor: "#3d4f3d",
      backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 12px,rgba(255,255,255,0.04) 12px,rgba(255,255,255,0.04) 13px)",
    },
  },
]

type Tab = "color" | "preset" | "upload"

export function BackgroundStep() {
  const background = useDesignStore((s) => s.background)
  const setBackground = useDesignStore((s) => s.setBackground)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeTab: Tab = background.type === "upload" ? "upload" : background.type === "preset" ? "preset" : "color"

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { fileId, url } = await uploadFile(file)
    setBackground({ type: "upload", fileId, url } satisfies Background)
  }

  const tabs: { value: Tab; label: string }[] = [
    { value: "color",  label: "Plain Color" },
    { value: "preset", label: "Pattern" },
    { value: "upload", label: "Upload" },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Gallery Background</h3>
        <p className="text-sm text-gray-500 mt-1">Design the wall of your miniature gallery.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              if (value === "color") setBackground({ type: "color", value: "#111111" })
              if (value === "preset") setBackground({ type: "preset", value: "design1" })
              if (value === "upload") setTimeout(() => fileRef.current?.click(), 50)
            }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Plain color swatches */}
      {activeTab === "color" && (
        <div className="grid grid-cols-3 gap-3">
          {PLAIN_COLORS.map(({ value, label, bg, textColor }) => {
            const isSelected = background.type === "color" && background.value === value
            return (
              <button
                key={value}
                onClick={() => setBackground({ type: "color", value })}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="h-20 flex items-end justify-center pb-2" style={{ backgroundColor: bg }}>
                  <span className="text-xs font-medium" style={{ color: textColor }}>{label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Pattern thumbnails */}
      {activeTab === "preset" && (
        <div className="grid grid-cols-3 gap-3">
          {DESIGNS.map(({ value, label, style }) => {
            const isSelected = background.type === "preset" && background.value === value
            return (
              <button
                key={value}
                onClick={() => setBackground({ type: "preset", value })}
                className={`flex flex-col gap-2 p-2 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="w-full h-20 rounded-lg" style={style} />
                <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Upload */}
      {activeTab === "upload" && (
        <div className="space-y-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {background.type === "upload" ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={background.url} alt="Custom background" className="w-full h-40 object-cover" />
              <button
                onClick={() => {
                  setBackground({ type: "color", value: "#111111" })
                  if (fileRef.current) fileRef.current.value = ""
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
              >×</button>
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-lg hover:bg-white">
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-all"
            >
              <svg className="w-9 h-9 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">Click to upload background image</span>
              <span className="text-xs text-gray-400">JPG, PNG, or WEBP</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
