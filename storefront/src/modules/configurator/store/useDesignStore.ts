import { create } from "zustand"
import { nanoid } from "nanoid"
import type {
  DesignDoc,
  Background,
  PhotoData,
  PhotoFrameType,
  SpotlightModel,
  FigurineType,
  FrameSize,
  FrameColor,
} from "../lib/designDoc"
import {
  CANVAS_SIZE,
  FRAME_DEFAULT_DIMS,
  SPOTLIGHT_DEFAULT_DIMS,
  FIGURINE_DEFAULT_DIMS,
} from "../lib/constants"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function defaultLightPos(count: number, model: SpotlightModel) {
  const dims = SPOTLIGHT_DEFAULT_DIMS[model]
  const step = model === "spot1" ? 0.13 : 0.20
  return {
    x: clamp(0.1 + count * step, 0, 1 - dims.w),
    y: 0.02,
  }
}

function defaultFramePos(count: number, type: PhotoFrameType) {
  const col = count % 3
  const row = Math.floor(count / 3)
  return {
    x: clamp(0.04 + col * 0.32, 0, 0.7),
    y: clamp(0.21 + row * 0.36, 0, 0.6),
  }
}

function defaultFigurinePos(count: number) {
  return {
    x: clamp(0.12 + count * 0.10, 0, 0.88),
    y: 0.83,
  }
}

// ─── State type ───────────────────────────────────────────────────────────────

interface DesignState {
  // — Design document fields (all coords normalised 0–1) —
  frame: { size: FrameSize; color: FrameColor }
  background: Background
  lights: DesignDoc["lights"]
  photoFrames: DesignDoc["photoFrames"]
  figurines: DesignDoc["figurines"]
  previewUrl: string | undefined

  // — UI state (not stored in design doc) —
  currentStep: number
  selectedId: string | null

  // — Actions —
  setStep: (step: number) => void
  selectItem: (id: string | null) => void

  setFrameSize: (size: FrameSize) => void
  setFrameColor: (color: FrameColor) => void
  setBackground: (bg: Background) => void

  addLight: (model: SpotlightModel) => void
  removeLight: (id: string) => void
  moveLight: (id: string, x: number, y: number) => void

  addPhotoFrame: (type: PhotoFrameType) => void
  removePhotoFrame: (id: string) => void
  movePhotoFrame: (id: string, x: number, y: number) => void
  resizePhotoFrame: (id: string, w: number, h: number) => void
  setPhotoForFrame: (frameId: string, photo: PhotoData) => void
  updatePhotoOffset: (frameId: string, offsetX: number, offsetY: number) => void

  addFigurine: (type: FigurineType) => void
  removeFigurine: (id: string) => void
  moveFigurine: (id: string, x: number, y: number) => void

  setPreviewUrl: (url: string) => void
  getDesignDoc: () => DesignDoc
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDesignStore = create<DesignState>((set, get) => ({
  frame: { size: "30x30", color: "black" },
  background: { type: "color", value: "#111111" },
  lights: [],
  photoFrames: [],
  figurines: [],
  previewUrl: undefined,
  currentStep: 1,
  selectedId: null,

  setStep: (step) => set({ currentStep: step }),
  selectItem: (id) => set({ selectedId: id }),

  setFrameSize: (size) =>
    set((s) => ({ frame: { ...s.frame, size } })),
  setFrameColor: (color) =>
    set((s) => ({ frame: { ...s.frame, color } })),
  setBackground: (background) => set({ background }),

  // ── Lights ────────────────────────────────────────────────────────────────
  addLight: (model) =>
    set((s) => {
      const pos = defaultLightPos(s.lights.length, model)
      return {
        lights: [
          ...s.lights,
          { id: nanoid(8), model, x: pos.x, y: pos.y, rot: 0 },
        ],
      }
    }),
  removeLight: (id) =>
    set((s) => ({ lights: s.lights.filter((l) => l.id !== id) })),
  moveLight: (id, x, y) =>
    set((s) => ({
      lights: s.lights.map((l) =>
        l.id === id
          ? {
              ...l,
              x: clamp(x, 0, 1 - SPOTLIGHT_DEFAULT_DIMS[l.model].w),
              y: clamp(y, 0, 1 - SPOTLIGHT_DEFAULT_DIMS[l.model].h),
            }
          : l
      ),
    })),

  // ── Photo frames ──────────────────────────────────────────────────────────
  addPhotoFrame: (type) =>
    set((s) => {
      const dims = FRAME_DEFAULT_DIMS[type]
      const pos = defaultFramePos(s.photoFrames.length, type)
      return {
        photoFrames: [
          ...s.photoFrames,
          { id: nanoid(8), type, x: pos.x, y: pos.y, w: dims.w, h: dims.h, rot: 0 },
        ],
      }
    }),
  removePhotoFrame: (id) =>
    set((s) => ({
      photoFrames: s.photoFrames.filter((f) => f.id !== id),
    })),
  movePhotoFrame: (id, x, y) =>
    set((s) => ({
      photoFrames: s.photoFrames.map((f) => {
        if (f.id !== id) return f
        return {
          ...f,
          x: clamp(x, 0, 1 - f.w),
          y: clamp(y, 0, 1 - f.h),
        }
      }),
    })),
  resizePhotoFrame: (id, w, h) =>
    set((s) => ({
      photoFrames: s.photoFrames.map((f) =>
        f.id === id
          ? { ...f, w: clamp(w, 0.05, 1), h: clamp(h, 0.05, 1) }
          : f
      ),
    })),
  setPhotoForFrame: (frameId, photo) =>
    set((s) => ({
      photoFrames: s.photoFrames.map((f) =>
        f.id === frameId ? { ...f, photo } : f
      ),
    })),
  updatePhotoOffset: (frameId, offsetX, offsetY) =>
    set((s) => ({
      photoFrames: s.photoFrames.map((f) =>
        f.id === frameId && f.photo
          ? { ...f, photo: { ...f.photo, offsetX, offsetY } }
          : f
      ),
    })),

  // ── Figurines ─────────────────────────────────────────────────────────────
  addFigurine: (type) =>
    set((s) => {
      const pos = defaultFigurinePos(s.figurines.length)
      return {
        figurines: [
          ...s.figurines,
          { id: nanoid(8), type, x: pos.x, y: pos.y, scale: 1, flip: false },
        ],
      }
    }),
  removeFigurine: (id) =>
    set((s) => ({
      figurines: s.figurines.filter((f) => f.id !== id),
    })),
  moveFigurine: (id, x, y) =>
    set((s) => ({
      figurines: s.figurines.map((f) => {
        if (f.id !== id) return f
        const dims = FIGURINE_DEFAULT_DIMS[f.type]
        return {
          ...f,
          x: clamp(x, 0, 1 - dims.w),
          y: clamp(y, 0, 1 - dims.h),
        }
      }),
    })),

  // ── Utilities ─────────────────────────────────────────────────────────────
  setPreviewUrl: (url) => set({ previewUrl: url }),

  getDesignDoc: (): DesignDoc => {
    const { frame, background, lights, photoFrames, figurines, previewUrl } =
      get()
    return {
      version: 1,
      frame,
      background,
      lights,
      photoFrames,
      figurines,
      previewUrl,
    }
  },
}))
