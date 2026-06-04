"use client"

import { useDesignStore } from "../../store/useDesignStore"
import { PHOTO_FRAME_LABELS } from "../../lib/constants"
import type { PhotoFrameType } from "../../lib/designDoc"

const GOLD = "#D4AF37"
const GOLD_DIM = "rgba(212,175,55,0.45)"
const HEART_PATH =
  "M50 88 C50 88 4 60 4 34 C4 13 21 3 37 3 C44 3 50 10 50 10 C50 10 56 3 63 3 C79 3 96 13 96 34 C96 60 50 88 50 88Z"

function FrameIcon({ type }: { type: PhotoFrameType }) {
  if (type === "gold_oval") {
    return (
      <div
        style={{
          width: 42,
          height: 52,
          borderRadius: "50%",
          border: `3px solid ${GOLD}`,
          boxShadow: `0 0 0 3px ${GOLD_DIM}, 0 0 0 6px ${GOLD}`,
          background: "#f5f0e8",
        }}
      />
    )
  }
  if (type === "heart_lg" || type === "heart_sm") {
    const sz = type === "heart_lg" ? 52 : 36
    return (
      <svg width={sz} height={(sz * 92) / 100} viewBox="0 0 100 92">
        <path d={HEART_PATH} fill="#f5f0e8" stroke={GOLD_DIM} strokeWidth="12" />
        <path d={HEART_PATH} fill="none" stroke={GOLD} strokeWidth="5" />
      </svg>
    )
  }
  if (type === "center") {
    return (
      <div
        style={{
          width: 46,
          height: 58,
          border: `3px solid ${GOLD}`,
          boxShadow: `inset 0 0 0 3px ${GOLD_DIM}, 0 0 0 2px ${GOLD}`,
          background: "#f5f0e8",
          borderRadius: 4,
        }}
      />
    )
  }
  // ornate-rect, ornate-square
  const isSquare = type === "square_sm"
  return (
    <div
      style={{
        width: isSquare ? 46 : 38,
        height: isSquare ? 46 : 58,
        border: `3px solid ${GOLD}`,
        boxShadow: `0 0 0 3px ${GOLD_DIM}, 0 0 0 6px ${GOLD}`,
        background: "#f5f0e8",
        borderRadius: 3,
      }}
    />
  )
}

const ALL_TYPES: PhotoFrameType[] = [
  "ornate_rect",
  "gold_oval",
  "heart_lg",
  "heart_sm",
  "square_sm",
  "center",
]

export function PhotoFramesStep() {
  const photoFrames   = useDesignStore((s) => s.photoFrames)
  const addPhotoFrame    = useDesignStore((s) => s.addPhotoFrame)
  const removePhotoFrame = useDesignStore((s) => s.removePhotoFrame)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Interior Photo Frames</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add decorative gold frames inside your gallery. Drag to arrange them on the canvas.
        </p>
      </div>

      {photoFrames.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 text-sm text-yellow-700">
          {photoFrames.length} frame
          {photoFrames.length !== 1 ? "s" : ""} added · Upload photos in the next step
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {ALL_TYPES.map((type) => {
          const count = photoFrames.filter((f) => f.type === type).length
          return (
            <div
              key={type}
              className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-3"
            >
              <div className="h-16 flex items-center justify-center">
                <FrameIcon type={type} />
              </div>
              <div className="text-xs text-center font-medium text-gray-700">
                {PHOTO_FRAME_LABELS[type]}
              </div>
              {count > 0 && (
                <div className="text-xs font-semibold text-yellow-700">
                  {count} added
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => addPhotoFrame(type)}
                  className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  + Add
                </button>
                {count > 0 && (
                  <button
                    onClick={() => {
                      const last = [...photoFrames]
                        .reverse()
                        .find((f) => f.type === type)
                      if (last) removePhotoFrame(last.id)
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
