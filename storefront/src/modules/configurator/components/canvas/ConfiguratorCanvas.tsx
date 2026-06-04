"use client"

import { useConfigurator } from "../../context/ConfiguratorContext"
import {
  CANVAS_SIZE,
  type DesignOption,
  type PlainColor,
} from "../../types"
import { CanvasSpotlightItem } from "./CanvasSpotlight"
import { CanvasPhotoFrameItem } from "./CanvasPhotoFrame"
import { CanvasFigurineItem } from "./CanvasFigurine"

// ─── Background styles ───────────────────────────────────────────────────────

const PLAIN_BG: Record<PlainColor, string> = {
  black: "#111111",
  white: "#f8f8f5",
  green: "#2d4a2d",
}

const DESIGN_BG: Record<DesignOption, React.CSSProperties> = {
  design1: {
    backgroundColor: "#8B1A1A",
    backgroundImage:
      "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,0.09) 8px,rgba(0,0,0,0.09) 16px),repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(255,255,255,0.04) 8px,rgba(255,255,255,0.04) 16px)",
  },
  design2: {
    backgroundColor: "#1a1a4e",
    backgroundImage:
      "radial-gradient(circle, rgba(212,175,55,0.45) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  design3: {
    backgroundColor: "#3d4f3d",
    backgroundImage:
      "repeating-linear-gradient(0deg,transparent,transparent 12px,rgba(255,255,255,0.04) 12px,rgba(255,255,255,0.04) 13px),repeating-linear-gradient(90deg,transparent,transparent 12px,rgba(255,255,255,0.04) 12px,rgba(255,255,255,0.04) 13px)",
  },
}

const FRAME_BORDER_STYLE: Record<string, React.CSSProperties> = {
  black: {
    background: "#1a1a1a",
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  white: {
    background: "#f0ede8",
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9)",
  },
}

const FRAME_BORDER_PX = 22

// ─── Canvas ──────────────────────────────────────────────────────────────────

export function ConfiguratorCanvas() {
  const { state } = useConfigurator()

  const bgStyle: React.CSSProperties =
    state.backgroundType === "custom" && state.backgroundCustom
      ? {
          backgroundImage: `url(${state.backgroundCustom})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : state.backgroundType === "design"
      ? DESIGN_BG[state.backgroundDesign]
      : { backgroundColor: PLAIN_BG[state.backgroundColor] }

  const hasItems =
    state.spotlights.length > 0 ||
    state.photoFrames.length > 0 ||
    state.figurines.length > 0

  const totalW = CANVAS_SIZE + FRAME_BORDER_PX * 2
  const totalH = CANVAS_SIZE + FRAME_BORDER_PX * 2

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Live badge */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Live Preview
        </span>
      </div>

      {/* Outer frame */}
      <div
        style={{
          ...FRAME_BORDER_STYLE[state.frameColor],
          width: totalW,
          height: totalH,
          padding: FRAME_BORDER_PX,
          borderRadius: 6,
          flexShrink: 0,
        }}
      >
        {/* Inner canvas */}
        <div
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            position: "relative",
            overflow: "hidden",
            ...bgStyle,
          }}
        >
          {/* Atmospheric top-light vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,230,120,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Bottom shadow / ground */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 30,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* ── Spotlights ── */}
          {state.spotlights.map((s) => (
            <CanvasSpotlightItem key={s.id} spotlight={s} />
          ))}

          {/* ── Photo frames ── */}
          {state.photoFrames.map((f) => (
            <CanvasPhotoFrameItem key={f.id} frame={f} />
          ))}

          {/* ── Figurines ── */}
          {state.figurines.map((fig) => (
            <CanvasFigurineItem key={fig.id} figurine={fig} />
          ))}

          {/* Empty state hint */}
          {!hasItems && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                zIndex: 0,
              }}
            >
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Your gallery will
                <br />
                appear here
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Frame label */}
      <div className="text-xs text-gray-400 text-center">
        {state.frameSize} cm ·{" "}
        {state.frameColor === "black" ? "Matte Black" : "Pearl White"}
      </div>

      {/* Drag hint */}
      {hasItems && (
        <div className="text-xs text-gray-400 flex items-center gap-1.5">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          Drag items to reposition · Hover to remove
        </div>
      )}
    </div>
  )
}
