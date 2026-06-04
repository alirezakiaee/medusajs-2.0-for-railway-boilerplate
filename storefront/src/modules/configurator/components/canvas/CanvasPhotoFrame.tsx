"use client"

import { useConfigurator } from "../../context/ConfiguratorContext"
import {
  type CanvasPhotoFrame,
  CANVAS_SIZE,
  PHOTO_FRAME_DIMS,
} from "../../types"
import { DraggableItem } from "./DraggableItem"

const GOLD = "#D4AF37"
const GOLD_MID = "rgba(212,175,55,0.5)"
const GOLD_GLOW = "rgba(212,175,55,0.25)"
const HEART_PATH =
  "M50 88 C50 88 4 60 4 34 C4 13 21 3 37 3 C44 3 50 10 50 10 C50 10 56 3 63 3 C79 3 96 13 96 34 C96 60 50 88 50 88Z"

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="absolute -top-2 -right-2 hidden group-hover:flex w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full items-center justify-center text-xs font-bold z-20 transition-colors"
      title="Remove"
    >
      ×
    </button>
  )
}

function EmptyPhotoPlaceholder({ w, h }: { w: number; h: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "linear-gradient(135deg, #f5f0e8 0%, #ede5d8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="20"
        height="20"
        fill="none"
        stroke={GOLD}
        viewBox="0 0 24 24"
        opacity={0.7}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )
}

function HeartFrame({
  frame,
  w,
  h,
}: {
  frame: CanvasPhotoFrame
  w: number
  h: number
}) {
  const clipId = `heart-clip-${frame.id}`
  const glowId = `heart-glow-${frame.id}`
  return (
    <svg width={w} height={h} viewBox="0 0 100 92" style={{ display: "block" }}>
      <defs>
        <clipPath id={clipId}>
          <path d={HEART_PATH} />
        </clipPath>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Photo or placeholder */}
      {frame.photo ? (
        <image
          href={frame.photo}
          x="0"
          y="0"
          width="100"
          height="92"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <rect
          x="0"
          y="0"
          width="100"
          height="92"
          fill="url(#placeholder-grad)"
          clipPath={`url(#${clipId})`}
        />
      )}
      {/* Glow ring */}
      <path
        d={HEART_PATH}
        fill="none"
        stroke={GOLD_GLOW}
        strokeWidth="14"
        filter={`url(#${glowId})`}
      />
      {/* Outer gold ring */}
      <path
        d={HEART_PATH}
        fill="none"
        stroke={GOLD_MID}
        strokeWidth="10"
      />
      {/* Inner gold line */}
      <path
        d={HEART_PATH}
        fill="none"
        stroke={GOLD}
        strokeWidth="4"
      />
    </svg>
  )
}

function RectOvalFrame({
  frame,
  w,
  h,
  borderRadius,
}: {
  frame: CanvasPhotoFrame
  w: number
  h: number
  borderRadius: string
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        borderRadius,
        overflow: "hidden",
        border: `3px solid ${GOLD}`,
        boxShadow: `0 0 0 3px ${GOLD_MID}, 0 0 0 6px ${GOLD}, inset 0 0 12px rgba(212,175,55,0.1)`,
      }}
    >
      {frame.photo ? (
        <img
          src={frame.photo}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          draggable={false}
        />
      ) : (
        <EmptyPhotoPlaceholder w={w} h={h} />
      )}
    </div>
  )
}

export function CanvasPhotoFrameItem({
  frame,
}: {
  frame: CanvasPhotoFrame
}) {
  const { movePhotoFrame, removePhotoFrame } = useConfigurator()
  const { w, h } = PHOTO_FRAME_DIMS[frame.type]
  const isHeart =
    frame.type === "heart-large" || frame.type === "heart-small"

  const borderRadius =
    frame.type === "ornate-oval"
      ? "50%"
      : frame.type === "center-display"
      ? "6px"
      : "3px"

  return (
    <DraggableItem
      position={frame.position}
      onMove={(pos) => movePhotoFrame(frame.id, pos)}
      bounds={{ w: CANVAS_SIZE, h: CANVAS_SIZE, ew: w, eh: h }}
    >
      <div className="group relative">
        {isHeart ? (
          <HeartFrame frame={frame} w={w} h={h} />
        ) : (
          <RectOvalFrame
            frame={frame}
            w={w}
            h={h}
            borderRadius={borderRadius}
          />
        )}
        <RemoveButton onClick={() => removePhotoFrame(frame.id)} />
      </div>
    </DraggableItem>
  )
}
