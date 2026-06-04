"use client"

import { useRef, useCallback, type RefObject } from "react"
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Ellipse,
  Line,
  Path,
  Group,
  Image as KonvaImage,
  Text,
} from "react-konva"
import useImage from "use-image"
import type Konva from "konva"
import { useDesignStore } from "../../store/useDesignStore"
import { CANVAS_SIZE } from "../../lib/constants"
import type { Spotlight, PhotoFrame, Figurine, Background } from "../../lib/designDoc"

const GOLD = "#D4AF37"
const GOLD_MID = "rgba(212,175,55,0.45)"
const BORDER_PX = 9 // gold border thickness in pixels

// ─── Heart path helpers ───────────────────────────────────────────────────────

function heartClipFn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  inset = BORDER_PX
) {
  const cx = w / 2
  ctx.beginPath()
  ctx.moveTo(cx, h * 0.84 - inset)
  ctx.bezierCurveTo(w * 0.04 + inset, h * 0.60, inset, h * 0.30, w * 0.20 + inset, h * 0.15 + inset)
  ctx.bezierCurveTo(w * 0.36, -inset,           cx, h * 0.25,    cx, h * 0.25)
  ctx.bezierCurveTo(cx, h * 0.25,               w * 0.64, -inset, w * 0.80 - inset, h * 0.15 + inset)
  ctx.bezierCurveTo(w - inset, h * 0.30,        w * 0.96 - inset, h * 0.60, cx, h * 0.84 - inset)
  ctx.closePath()
}

function heartSvgData(w: number, h: number): string {
  const cx = w / 2
  return (
    `M ${cx} ${h * 0.84} ` +
    `C ${w * 0.04} ${h * 0.60} 0 ${h * 0.30} ${w * 0.20} ${h * 0.15} ` +
    `C ${w * 0.36} 0 ${cx} ${h * 0.25} ${cx} ${h * 0.25} ` +
    `C ${cx} ${h * 0.25} ${w * 0.64} 0 ${w * 0.80} ${h * 0.15} ` +
    `C ${w} ${h * 0.30} ${w * 0.96} ${h * 0.60} ${cx} ${h * 0.84} Z`
  )
}

// ─── Background ───────────────────────────────────────────────────────────────

function BackgroundLayer({ bg }: { bg: Background }) {
  const [bgImg] = useImage(
    bg.type === "upload" ? bg.url : "",
    "anonymous"
  )

  if (bg.type === "upload" && bgImg) {
    return (
      <Layer>
        <KonvaImage
          image={bgImg}
          x={0}
          y={0}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
        />
      </Layer>
    )
  }

  const color =
    bg.type === "color"
      ? bg.value
      : bg.type === "preset"
      ? { design1: "#8B1A1A", design2: "#1a1a4e", design3: "#3d4f3d" }[
          bg.value
        ] ?? "#111"
      : "#111111"

  const isPreset = bg.type === "preset"

  return (
    <Layer>
      <Rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} fill={color} />

      {/* design1 — diagonal hatch */}
      {isPreset && bg.value === "design1" &&
        Array.from({ length: 64 }).map((_, i) => (
          <Line
            key={i}
            points={[i * 16 - CANVAS_SIZE, 0, i * 16, CANVAS_SIZE]}
            stroke="rgba(0,0,0,0.07)"
            strokeWidth={7}
          />
        ))}

      {/* design2 — gold dots */}
      {isPreset && bg.value === "design2" &&
        Array.from({ length: 576 }).map((_, i) => {
          const col = i % 24
          const row = Math.floor(i / 24)
          return (
            <Circle
              key={i}
              x={(col + 0.5) * 20}
              y={(row + 0.5) * 20}
              radius={1.5}
              fill="rgba(212,175,55,0.42)"
            />
          )
        })}

      {/* design3 — grid lines */}
      {isPreset && bg.value === "design3" &&
        Array.from({ length: 40 }).flatMap((_, i) => [
          <Line key={`h${i}`} points={[0, i * 13, CANVAS_SIZE, i * 13]} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />,
          <Line key={`v${i}`} points={[i * 13, 0, i * 13, CANVAS_SIZE]} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />,
        ])}

      {/* subtle vignette */}
      <Rect
        x={0}
        y={0}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        fillLinearGradientStartPoint={{ x: CANVAS_SIZE / 2, y: 0 }}
        fillLinearGradientEndPoint={{ x: CANVAS_SIZE / 2, y: CANVAS_SIZE }}
        fillLinearGradientColorStops={[0, "rgba(0,0,0,0.0)", 1, "rgba(0,0,0,0.18)"]}
      />
    </Layer>
  )
}

// ─── Spotlights ───────────────────────────────────────────────────────────────

function SpotlightItem({
  light,
  canDrag,
}: {
  light: Spotlight
  canDrag: boolean
}) {
  const moveLight = useDesignStore((s) => s.moveLight)
  const removeLight = useDesignStore((s) => s.removeLight)
  const selectItem = useDesignStore((s) => s.selectItem)

  const px = light.x * CANVAS_SIZE
  const py = light.y * CANVAS_SIZE
  const is2 = light.model === "spot2"
  const gw = is2 ? 80 : 50
  const gh = 70

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      moveLight(light.id, e.target.x() / CANVAS_SIZE, e.target.y() / CANVAS_SIZE)
    },
    [light.id, moveLight]
  )

  return (
    <Group
      x={px}
      y={py}
      draggable={canDrag}
      onDragEnd={handleDragEnd}
      onDblClick={() => removeLight(light.id)}
      onDblTap={() => removeLight(light.id)}
      onClick={() => selectItem(light.id)}
    >
      {is2 ? (
        <>
          {/* Bar */}
          <Rect x={28} y={0} width={24} height={10} cornerRadius={3} fill="#444" />
          <Rect x={8} y={4} width={64} height={4} cornerRadius={2} fill="#555" />
          {/* Cones */}
          <Line points={[0, gh, 26, gh, 20, 10, 2, 10]} closed fill="rgba(255,220,80,0.28)" strokeWidth={0} />
          <Line points={[54, gh, 80, gh, 78, 10, 60, 10]} closed fill="rgba(255,220,80,0.28)" strokeWidth={0} />
          {/* Lamps */}
          <Ellipse x={11} y={6} radiusX={12} radiusY={8} fill="#777" />
          <Circle x={11} y={6} radius={5} fill="#ddd" />
          <Circle x={11} y={6} radius={2.5} fill="#fff" opacity={0.8} />
          <Ellipse x={69} y={6} radiusX={12} radiusY={8} fill="#777" />
          <Circle x={69} y={6} radius={5} fill="#ddd" />
          <Circle x={69} y={6} radius={2.5} fill="#fff" opacity={0.8} />
        </>
      ) : (
        <>
          <Rect x={15} y={0} width={20} height={10} cornerRadius={3} fill="#444" />
          <Line points={[5, gh, 45, gh, 36, 10, 14, 10]} closed fill="rgba(255,220,80,0.32)" strokeWidth={0} />
          <Ellipse x={25} y={6} radiusX={13} radiusY={8} fill="#777" />
          <Circle x={25} y={6} radius={5} fill="#ddd" />
          <Circle x={25} y={6} radius={2.5} fill="#fff" opacity={0.8} />
        </>
      )}
      {/* Hover remove hint */}
      <Text
        text="✕"
        x={gw - 12}
        y={-14}
        fontSize={11}
        fill="rgba(255,80,80,0.85)"
        visible={false}
      />
    </Group>
  )
}

// ─── Photo frame inner photo ──────────────────────────────────────────────────

function FramePhoto({
  photo,
  innerX,
  innerY,
  innerW,
  innerH,
  canPan,
  frameId,
}: {
  photo: PhotoFrame["photo"]
  innerX: number
  innerY: number
  innerW: number
  innerH: number
  canPan: boolean
  frameId: string
}) {
  const updatePhotoOffset = useDesignStore((s) => s.updatePhotoOffset)
  const [img] = useImage(photo?.url ?? "", "anonymous")

  if (!photo || !img) {
    return (
      <Rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={innerH}
        fill="#f5f0e8"
        opacity={0.9}
      />
    )
  }

  // Cover-fit
  const photoAspect = img.width / img.height
  const innerAspect = innerW / innerH
  const baseScale =
    photoAspect > innerAspect ? innerH / img.height : innerW / img.width
  const totalScale = baseScale * (photo.scale ?? 1)
  const photoW = img.width * totalScale
  const photoH = img.height * totalScale

  // Centred + user offset
  const coverX = innerX + (innerW - photoW) / 2
  const coverY = innerY + (innerH - photoH) / 2
  const x = coverX + (photo.offsetX ?? 0) * innerW
  const y = coverY + (photo.offsetY ?? 0) * innerH

  return (
    <KonvaImage
      image={img}
      x={x}
      y={y}
      width={photoW}
      height={photoH}
      draggable={canPan}
      onDragEnd={(e) => {
        const newOffsetX = (e.target.x() - coverX) / innerW
        const newOffsetY = (e.target.y() - coverY) / innerH
        updatePhotoOffset(frameId, newOffsetX, newOffsetY)
      }}
    />
  )
}

// ─── Photo frame item ─────────────────────────────────────────────────────────

function PhotoFrameItem({
  frame,
  canDrag,
  canPan,
}: {
  frame: PhotoFrame
  canDrag: boolean
  canPan: boolean
}) {
  const movePhotoFrame = useDesignStore((s) => s.movePhotoFrame)
  const removePhotoFrame = useDesignStore((s) => s.removePhotoFrame)
  const selectItem = useDesignStore((s) => s.selectItem)

  const x = frame.x * CANVAS_SIZE
  const y = frame.y * CANVAS_SIZE
  const w = frame.w * CANVAS_SIZE
  const h = frame.h * CANVAS_SIZE

  const innerX = BORDER_PX
  const innerY = BORDER_PX
  const innerW = w - BORDER_PX * 2
  const innerH = h - BORDER_PX * 2

  const isOval = frame.type === "gold_oval"
  const isHeart = frame.type === "heart_lg" || frame.type === "heart_sm"

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      movePhotoFrame(frame.id, e.target.x() / CANVAS_SIZE, e.target.y() / CANVAS_SIZE)
    },
    [frame.id, movePhotoFrame]
  )

  return (
    <Group
      x={x}
      y={y}
      draggable={canDrag}
      onDragEnd={handleDragEnd}
      onDblClick={() => removePhotoFrame(frame.id)}
      onDblTap={() => removePhotoFrame(frame.id)}
      onClick={() => selectItem(frame.id)}
    >
      {/* ── Clip + photo ── */}
      {isHeart ? (
        <Group clipFunc={(ctx) => heartClipFn(ctx, w, h)}>
          <FramePhoto
            photo={frame.photo}
            innerX={0}
            innerY={0}
            innerW={w}
            innerH={h}
            canPan={canPan}
            frameId={frame.id}
          />
        </Group>
      ) : isOval ? (
        <Group
          clipFunc={(ctx) => {
            ctx.ellipse(w / 2, h / 2, innerW / 2, innerH / 2, 0, 0, Math.PI * 2)
          }}
        >
          <FramePhoto
            photo={frame.photo}
            innerX={innerX}
            innerY={innerY}
            innerW={innerW}
            innerH={innerH}
            canPan={canPan}
            frameId={frame.id}
          />
        </Group>
      ) : (
        <Group clipX={innerX} clipY={innerY} clipWidth={innerW} clipHeight={innerH}>
          <FramePhoto
            photo={frame.photo}
            innerX={innerX}
            innerY={innerY}
            innerW={innerW}
            innerH={innerH}
            canPan={canPan}
            frameId={frame.id}
          />
        </Group>
      )}

      {/* ── Gold frame border overlay (on top of the clipped photo) ── */}
      {isHeart ? (
        <>
          <Path data={heartSvgData(w, h)} fill="transparent" stroke={GOLD_MID} strokeWidth={BORDER_PX * 2} lineJoin="round" />
          <Path data={heartSvgData(w, h)} fill="transparent" stroke={GOLD} strokeWidth={BORDER_PX * 0.8} lineJoin="round" />
        </>
      ) : isOval ? (
        <>
          <Ellipse x={w / 2} y={h / 2} radiusX={w / 2} radiusY={h / 2} stroke={GOLD_MID} strokeWidth={BORDER_PX * 2} fill="transparent" />
          <Ellipse x={w / 2} y={h / 2} radiusX={w / 2} radiusY={h / 2} stroke={GOLD} strokeWidth={BORDER_PX * 0.8} fill="transparent" />
        </>
      ) : (
        <>
          <Rect x={0} y={0} width={w} height={h} stroke={GOLD_MID} strokeWidth={BORDER_PX * 2} fill="transparent" cornerRadius={frame.type === "center" ? 5 : 2} />
          <Rect x={0} y={0} width={w} height={h} stroke={GOLD} strokeWidth={BORDER_PX * 0.8} fill="transparent" cornerRadius={frame.type === "center" ? 5 : 2} />
          {/* Corner ornament dots */}
          {[
            [4, 4],
            [w - 4, 4],
            [4, h - 4],
            [w - 4, h - 4],
          ].map(([cx, cy], i) => (
            <Circle key={i} x={cx} y={cy} radius={3} fill={GOLD} />
          ))}
        </>
      )}
    </Group>
  )
}

// ─── Figurines ────────────────────────────────────────────────────────────────

function FigurineItem({
  fig,
  canDrag,
}: {
  fig: Figurine
  canDrag: boolean
}) {
  const moveFigurine = useDesignStore((s) => s.moveFigurine)
  const removeFigurine = useDesignStore((s) => s.removeFigurine)

  const px = fig.x * CANVAS_SIZE
  const py = fig.y * CANVAS_SIZE
  const isMale =
    fig.type === "male_1" || fig.type === "male_2"
  const scaleX = fig.flip ? -fig.scale : fig.scale

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      moveFigurine(fig.id, e.target.x() / CANVAS_SIZE, e.target.y() / CANVAS_SIZE)
    },
    [fig.id, moveFigurine]
  )

  return (
    <Group
      x={px}
      y={py}
      scaleX={scaleX}
      scaleY={fig.scale}
      draggable={canDrag}
      onDragEnd={handleDragEnd}
      onDblClick={() => removeFigurine(fig.id)}
      onDblTap={() => removeFigurine(fig.id)}
    >
      {isMale ? (
        <>
          <Circle x={16} y={9} radius={8} fill="#3b5998" />
          <Rect x={9} y={18} width={14} height={26} cornerRadius={3} fill="#3b5998" />
          <Rect x={9} y={40} width={14} height={3} fill="#2d4a7a" />
          <Rect x={9} y={44} width={6} height={22} cornerRadius={3} fill="#2d3e50" />
          <Rect x={17} y={44} width={6} height={22} cornerRadius={3} fill="#2d3e50" />
          <Rect x={2} y={20} width={7} height={20} cornerRadius={3} fill="#3b5998" />
          <Rect x={23} y={20} width={7} height={20} cornerRadius={3} fill="#3b5998" />
        </>
      ) : (
        <>
          <Circle x={16} y={9} radius={7} fill="#c0392b" />
          <Line points={[9, 18, 23, 18, 28, 54, 4, 54]} closed fill="#c0392b" strokeWidth={0} />
          <Rect x={8} y={54} width={6} height={18} cornerRadius={3} fill="#922b21" />
          <Rect x={18} y={54} width={6} height={18} cornerRadius={3} fill="#922b21" />
          <Rect x={2} y={19} width={6} height={18} cornerRadius={3} fill="#c0392b" />
          <Rect x={24} y={19} width={6} height={18} cornerRadius={3} fill="#c0392b" />
        </>
      )}
    </Group>
  )
}

// ─── Main canvas export ───────────────────────────────────────────────────────

export function KonvaCanvas({
  stageRef,
}: {
  stageRef?: RefObject<Konva.Stage | null>
}) {
  const { background, lights, photoFrames, figurines, currentStep } =
    useDesignStore()

  // Drag rules per step
  const canDragLights = currentStep === 4
  const canDragFrames = currentStep === 5
  const canPanPhotos = currentStep === 6
  const canDragFigurines = currentStep === 7

  const hasItems =
    lights.length > 0 || photoFrames.length > 0 || figurines.length > 0

  return (
    <Stage ref={stageRef} width={CANVAS_SIZE} height={CANVAS_SIZE}>
      {/* 1 — Background */}
      <BackgroundLayer bg={background} />

      {/* 2 — Spotlights */}
      <Layer>
        {lights.map((l) => (
          <SpotlightItem key={l.id} light={l} canDrag={canDragLights} />
        ))}
      </Layer>

      {/* 3 — Photo frames (each group has its own clipFunc) */}
      <Layer>
        {photoFrames.map((f) => (
          <PhotoFrameItem
            key={f.id}
            frame={f}
            canDrag={canDragFrames}
            canPan={canPanPhotos}
          />
        ))}
      </Layer>

      {/* 4 — Figurines */}
      <Layer>
        {figurines.map((fig) => (
          <FigurineItem key={fig.id} fig={fig} canDrag={canDragFigurines} />
        ))}
      </Layer>

      {/* Empty-state label */}
      {!hasItems && (
        <Layer>
          <Text
            x={0}
            y={CANVAS_SIZE / 2 - 14}
            width={CANVAS_SIZE}
            text="Your gallery will appear here"
            fontSize={13}
            fontFamily="sans-serif"
            fill="rgba(255,255,255,0.22)"
            align="center"
          />
          <Text
            x={0}
            y={CANVAS_SIZE / 2 + 6}
            width={CANVAS_SIZE}
            text="Add lights, frames, and figurines using the steps on the left"
            fontSize={11}
            fontFamily="sans-serif"
            fill="rgba(255,255,255,0.14)"
            align="center"
          />
        </Layer>
      )}
    </Stage>
  )
}
