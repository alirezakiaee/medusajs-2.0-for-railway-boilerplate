"use client"

import { useDesignStore } from "../../store/useDesignStore"
import { FRAME_SIZE_LABELS } from "../../lib/constants"
import type { FrameSize } from "../../lib/designDoc"

const SIZES: { value: FrameSize; scale: number; price: string }[] = [
  { value: "20x20", scale: 56, price: "Small" },
  { value: "30x30", scale: 72, price: "Medium" },
  { value: "40x40", scale: 88, price: "Large" },
]

export function FrameSizeStep() {
  const { frame, setFrameSize } = useDesignStore()
  const state = { frameSize: frame.size }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Choose Frame Size</h3>
        <p className="text-sm text-gray-500 mt-1">
          Select the physical dimensions of your memory frame.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {SIZES.map(({ value, scale, price }) => {
          const isSelected = state.frameSize === value
          return (
            <button
              key={value}
              onClick={() => setFrameSize(value)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              }`}
            >
              <div className="flex items-end justify-center h-24">
                <div
                  className={`rounded transition-colors ${
                    isSelected ? "bg-gray-800" : "bg-gray-300"
                  }`}
                  style={{ width: scale, height: scale }}
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800">
                  {FRAME_SIZE_LABELS[value]}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{price}</div>
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

      <p className="text-xs text-gray-400 italic">
        All frames are square-format and handcrafted to order.
      </p>
    </div>
  )
}
