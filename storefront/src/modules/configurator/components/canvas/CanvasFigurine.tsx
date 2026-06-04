"use client"

import { useConfigurator } from "../../context/ConfiguratorContext"
import {
  type CanvasFigurine,
  CANVAS_SIZE,
  FIGURINE_DIMS,
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

function MaleBody({ w, h }: { w: number; h: number }) {
  return (
    <svg viewBox="0 0 32 72" width={w} height={h}>
      {/* Head */}
      <circle cx="16" cy="9" r="8" fill="#3b5998" />
      <circle cx="13" cy="7" r="2" fill="rgba(255,255,255,0.15)" />
      {/* Torso */}
      <rect x="9" y="18" width="14" height="26" rx="3" fill="#3b5998" />
      <rect x="9" y="40" width="14" height="3" fill="#2d4a7a" />
      {/* Legs */}
      <rect x="9" y="44" width="6" height="22" rx="3" fill="#2d3e50" />
      <rect x="17" y="44" width="6" height="22" rx="3" fill="#2d3e50" />
      {/* Arms */}
      <rect x="2" y="20" width="7" height="20" rx="3" fill="#3b5998" />
      <rect x="23" y="20" width="7" height="20" rx="3" fill="#3b5998" />
    </svg>
  )
}

function FemaleBody({ w, h }: { w: number; h: number }) {
  return (
    <svg viewBox="0 0 32 72" width={w} height={h}>
      {/* Head */}
      <circle cx="16" cy="9" r="7" fill="#c0392b" />
      {/* Hair */}
      <path
        d="M8 9 Q16 1 24 9"
        fill="none"
        stroke="#7b241c"
        strokeWidth="3"
      />
      <circle cx="13" cy="7" r="2" fill="rgba(255,255,255,0.15)" />
      {/* Dress */}
      <path d="M9 18 L23 18 L28 54 L4 54 Z" fill="#c0392b" />
      <path
        d="M16 18 L16 54"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      {/* Legs */}
      <rect x="8" y="54" width="6" height="18" rx="3" fill="#922b21" />
      <rect x="18" y="54" width="6" height="18" rx="3" fill="#922b21" />
      {/* Arms */}
      <rect x="2" y="19" width="6" height="18" rx="3" fill="#c0392b" />
      <rect x="24" y="19" width="6" height="18" rx="3" fill="#c0392b" />
    </svg>
  )
}

export function CanvasFigurineItem({
  figurine,
}: {
  figurine: CanvasFigurine
}) {
  const { moveFigurine, removeFigurine } = useConfigurator()
  const dims = FIGURINE_DIMS[figurine.gender]

  return (
    <DraggableItem
      position={figurine.position}
      onMove={(pos) => moveFigurine(figurine.id, pos)}
      bounds={{ w: CANVAS_SIZE, h: CANVAS_SIZE, ew: dims.w, eh: dims.h }}
    >
      <div className="group relative">
        {figurine.gender === "male" ? (
          <MaleBody w={dims.w} h={dims.h} />
        ) : (
          <FemaleBody w={dims.w} h={dims.h} />
        )}
        <RemoveButton onClick={() => removeFigurine(figurine.id)} />
      </div>
    </DraggableItem>
  )
}
