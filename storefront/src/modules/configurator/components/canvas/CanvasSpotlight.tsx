"use client"

import { useConfigurator } from "../../context/ConfiguratorContext"
import {
  type CanvasSpotlight,
  CANVAS_SIZE,
  SPOTLIGHT_DIMS,
} from "../../types"
import { DraggableItem } from "./DraggableItem"

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="absolute -top-2 -right-2 hidden group-hover:flex w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full items-center justify-center text-xs font-bold z-10 transition-colors"
      title="Remove"
    >
      ×
    </button>
  )
}

function Spotlight1({ dims }: { dims: { w: number; h: number } }) {
  return (
    <svg viewBox="0 0 50 72" width={dims.w} height={dims.h}>
      {/* Mount bar */}
      <rect x="15" y="0" width="20" height="10" rx="3" fill="#444" />
      {/* Light cone */}
      <polygon points="5,72 45,72 36,10 14,10" fill="rgba(255,220,80,0.30)" />
      {/* Lamp housing */}
      <ellipse cx="25" cy="6" rx="13" ry="8" fill="#777" />
      {/* Lens */}
      <circle cx="25" cy="6" r="6" fill="#ddd" />
      <circle cx="25" cy="6" r="3" fill="#fff" opacity="0.8" />
    </svg>
  )
}

function Spotlight2({ dims }: { dims: { w: number; h: number } }) {
  return (
    <svg viewBox="0 0 80 72" width={dims.w} height={dims.h}>
      {/* Central mount bar */}
      <rect x="28" y="0" width="24" height="10" rx="3" fill="#444" />
      {/* Connecting arm */}
      <rect x="10" y="4" width="60" height="4" rx="2" fill="#555" />
      {/* Left cone */}
      <polygon points="0,72 28,72 20,10 2,10" fill="rgba(255,220,80,0.28)" />
      {/* Right cone */}
      <polygon points="52,72 80,72 78,10 60,10" fill="rgba(255,220,80,0.28)" />
      {/* Left lamp */}
      <ellipse cx="11" cy="6" rx="12" ry="8" fill="#777" />
      <circle cx="11" cy="6" r="6" fill="#ddd" />
      <circle cx="11" cy="6" r="3" fill="#fff" opacity="0.8" />
      {/* Right lamp */}
      <ellipse cx="69" cy="6" rx="12" ry="8" fill="#777" />
      <circle cx="69" cy="6" r="6" fill="#ddd" />
      <circle cx="69" cy="6" r="3" fill="#fff" opacity="0.8" />
    </svg>
  )
}

export function CanvasSpotlightItem({
  spotlight,
}: {
  spotlight: CanvasSpotlight
}) {
  const { moveSpotlight, removeSpotlight } = useConfigurator()
  const dims = SPOTLIGHT_DIMS[spotlight.model]

  return (
    <DraggableItem
      position={spotlight.position}
      onMove={(pos) => moveSpotlight(spotlight.id, pos)}
      bounds={{ w: CANVAS_SIZE, h: CANVAS_SIZE, ew: dims.w, eh: dims.h }}
    >
      <div className="group relative">
        {spotlight.model === "model1" ? (
          <Spotlight1 dims={dims} />
        ) : (
          <Spotlight2 dims={dims} />
        )}
        <RemoveButton onClick={() => removeSpotlight(spotlight.id)} />
      </div>
    </DraggableItem>
  )
}
