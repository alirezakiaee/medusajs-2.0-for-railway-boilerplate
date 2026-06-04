"use client"

import { useDesignStore } from "../../store/useDesignStore"
import type { FrameColor } from "../../lib/designDoc"

const COLORS: {
  value: FrameColor
  label: string
  subtitle: string
  bg: string
  border: string
  ring: string
}[] = [
  {
    value: "black",
    label: "Matte Black",
    subtitle: "Sleek, modern gallery style",
    bg: "#1a1a1a",
    border: "#000",
    ring: "ring-gray-900",
  },
  {
    value: "white",
    label: "Pearl White",
    subtitle: "Classic, timeless elegance",
    bg: "#f0ede8",
    border: "#d1cdc7",
    ring: "ring-gray-400",
  },
]

export function FrameColorStep() {
  const frame = useDesignStore((s) => s.frame)
  const setFrameColor = useDesignStore((s) => s.setFrameColor)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Frame Finish</h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose the colour and finish for the outer gallery frame.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {COLORS.map(({ value, label, subtitle, bg, border, ring }) => {
          const isSelected = frame.color === value
          return (
            <button
              key={value}
              onClick={() => setFrameColor(value)}
              className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                isSelected
                  ? `border-gray-900 ring-2 ${ring} ring-offset-2 shadow-sm`
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Frame preview */}
              <div
                className="w-24 h-24 rounded-sm flex items-center justify-center"
                style={{
                  background: bg,
                  border: `3px solid ${border}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-sm"
                  style={{ background: "#2d4a2d", opacity: 0.6 }}
                />
              </div>

              <div className="text-center">
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
