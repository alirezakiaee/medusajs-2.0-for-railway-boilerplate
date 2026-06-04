"use client"

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react"
import {
  type ConfiguratorState,
  type FrameSize,
  type FrameColor,
  type BackgroundType,
  type PlainColor,
  type DesignOption,
  type SpotlightModel,
  type PhotoFrameType,
  type FigurineGender,
  type Position,
  type CanvasSpotlight,
  type CanvasPhotoFrame,
  type CanvasFigurine,
  CANVAS_SIZE,
  SPOTLIGHT_DIMS,
  PHOTO_FRAME_DIMS,
  FIGURINE_DIMS,
} from "../types"

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ConfiguratorState = {
  currentStep: 1,
  frameSize: "30x30",
  frameColor: "black",
  backgroundType: "plain",
  backgroundColor: "black",
  backgroundDesign: "design1",
  backgroundCustom: null,
  spotlights: [],
  photoFrames: [],
  figurines: [],
}

// ─── Action Types ─────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_FRAME_SIZE"; size: FrameSize }
  | { type: "SET_FRAME_COLOR"; color: FrameColor }
  | { type: "SET_BG_TYPE"; bgType: BackgroundType }
  | { type: "SET_BG_COLOR"; color: PlainColor }
  | { type: "SET_BG_DESIGN"; design: DesignOption }
  | { type: "SET_BG_CUSTOM"; dataUrl: string | null }
  | { type: "ADD_SPOTLIGHT"; spotlight: CanvasSpotlight }
  | { type: "REMOVE_SPOTLIGHT"; id: string }
  | { type: "MOVE_SPOTLIGHT"; id: string; pos: Position }
  | { type: "ADD_PHOTO_FRAME"; frame: CanvasPhotoFrame }
  | { type: "REMOVE_PHOTO_FRAME"; id: string }
  | { type: "MOVE_PHOTO_FRAME"; id: string; pos: Position }
  | { type: "SET_PHOTO_FOR_FRAME"; frameId: string; photo: string }
  | { type: "ADD_FIGURINE"; figurine: CanvasFigurine }
  | { type: "REMOVE_FIGURINE"; id: string }
  | { type: "MOVE_FIGURINE"; id: string; pos: Position }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }
    case "SET_FRAME_SIZE":
      return { ...state, frameSize: action.size }
    case "SET_FRAME_COLOR":
      return { ...state, frameColor: action.color }
    case "SET_BG_TYPE":
      return { ...state, backgroundType: action.bgType }
    case "SET_BG_COLOR":
      return { ...state, backgroundColor: action.color }
    case "SET_BG_DESIGN":
      return { ...state, backgroundDesign: action.design }
    case "SET_BG_CUSTOM":
      return { ...state, backgroundCustom: action.dataUrl }
    case "ADD_SPOTLIGHT":
      return { ...state, spotlights: [...state.spotlights, action.spotlight] }
    case "REMOVE_SPOTLIGHT":
      return {
        ...state,
        spotlights: state.spotlights.filter((s) => s.id !== action.id),
      }
    case "MOVE_SPOTLIGHT":
      return {
        ...state,
        spotlights: state.spotlights.map((s) =>
          s.id === action.id ? { ...s, position: action.pos } : s
        ),
      }
    case "ADD_PHOTO_FRAME":
      return { ...state, photoFrames: [...state.photoFrames, action.frame] }
    case "REMOVE_PHOTO_FRAME":
      return {
        ...state,
        photoFrames: state.photoFrames.filter((f) => f.id !== action.id),
      }
    case "MOVE_PHOTO_FRAME":
      return {
        ...state,
        photoFrames: state.photoFrames.map((f) =>
          f.id === action.id ? { ...f, position: action.pos } : f
        ),
      }
    case "SET_PHOTO_FOR_FRAME":
      return {
        ...state,
        photoFrames: state.photoFrames.map((f) =>
          f.id === action.frameId ? { ...f, photo: action.photo } : f
        ),
      }
    case "ADD_FIGURINE":
      return { ...state, figurines: [...state.figurines, action.figurine] }
    case "REMOVE_FIGURINE":
      return {
        ...state,
        figurines: state.figurines.filter((f) => f.id !== action.id),
      }
    case "MOVE_FIGURINE":
      return {
        ...state,
        figurines: state.figurines.map((f) =>
          f.id === action.id ? { ...f, position: action.pos } : f
        ),
      }
    default:
      return state
  }
}

// ─── Default position helpers ─────────────────────────────────────────────────

function getSpotlightDefaultPos(count: number, model: SpotlightModel): Position {
  const dims = SPOTLIGHT_DIMS[model]
  const step = model === "model1" ? 60 : 95
  const startX = Math.max(20, CANVAS_SIZE / 2 - (step * count) / 2)
  return {
    x: Math.min(startX + count * step, CANVAS_SIZE - dims.w),
    y: 8,
  }
}

function getPhotoFrameDefaultPos(count: number, type: PhotoFrameType): Position {
  const dims = PHOTO_FRAME_DIMS[type]
  const col = count % 3
  const row = Math.floor(count / 3)
  return {
    x: Math.min(20 + col * 150, CANVAS_SIZE - dims.w),
    y: Math.min(100 + row * 170, CANVAS_SIZE - dims.h),
  }
}

function getFigurineDefaultPos(count: number, gender: FigurineGender): Position {
  const dims = FIGURINE_DIMS[gender]
  return {
    x: Math.min(60 + count * 45, CANVAS_SIZE - dims.w),
    y: CANVAS_SIZE - dims.h - 8,
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ConfiguratorContextType {
  state: ConfiguratorState
  setStep: (step: number) => void
  setFrameSize: (size: FrameSize) => void
  setFrameColor: (color: FrameColor) => void
  setBackgroundType: (type: BackgroundType) => void
  setBackgroundColor: (color: PlainColor) => void
  setBackgroundDesign: (design: DesignOption) => void
  setBackgroundCustom: (dataUrl: string | null) => void
  addSpotlight: (model: SpotlightModel) => void
  removeSpotlight: (id: string) => void
  moveSpotlight: (id: string, pos: Position) => void
  addPhotoFrame: (type: PhotoFrameType) => void
  removePhotoFrame: (id: string) => void
  movePhotoFrame: (id: string, pos: Position) => void
  setPhotoForFrame: (frameId: string, photo: string) => void
  addFigurine: (gender: FigurineGender) => void
  removeFigurine: (id: string) => void
  moveFigurine: (id: string, pos: Position) => void
}

const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setStep = useCallback(
    (step: number) => dispatch({ type: "SET_STEP", step }),
    []
  )
  const setFrameSize = useCallback(
    (size: FrameSize) => dispatch({ type: "SET_FRAME_SIZE", size }),
    []
  )
  const setFrameColor = useCallback(
    (color: FrameColor) => dispatch({ type: "SET_FRAME_COLOR", color }),
    []
  )
  const setBackgroundType = useCallback(
    (bgType: BackgroundType) => dispatch({ type: "SET_BG_TYPE", bgType }),
    []
  )
  const setBackgroundColor = useCallback(
    (color: PlainColor) => dispatch({ type: "SET_BG_COLOR", color }),
    []
  )
  const setBackgroundDesign = useCallback(
    (design: DesignOption) => dispatch({ type: "SET_BG_DESIGN", design }),
    []
  )
  const setBackgroundCustom = useCallback(
    (dataUrl: string | null) => dispatch({ type: "SET_BG_CUSTOM", dataUrl }),
    []
  )

  const addSpotlight = useCallback(
    (model: SpotlightModel) => {
      const count = state.spotlights.length
      dispatch({
        type: "ADD_SPOTLIGHT",
        spotlight: {
          id: `spotlight-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          model,
          position: getSpotlightDefaultPos(count, model),
        },
      })
    },
    [state.spotlights.length]
  )
  const removeSpotlight = useCallback(
    (id: string) => dispatch({ type: "REMOVE_SPOTLIGHT", id }),
    []
  )
  const moveSpotlight = useCallback(
    (id: string, pos: Position) => dispatch({ type: "MOVE_SPOTLIGHT", id, pos }),
    []
  )

  const addPhotoFrame = useCallback(
    (type: PhotoFrameType) => {
      const count = state.photoFrames.length
      dispatch({
        type: "ADD_PHOTO_FRAME",
        frame: {
          id: `frame-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type,
          position: getPhotoFrameDefaultPos(count, type),
        },
      })
    },
    [state.photoFrames.length]
  )
  const removePhotoFrame = useCallback(
    (id: string) => dispatch({ type: "REMOVE_PHOTO_FRAME", id }),
    []
  )
  const movePhotoFrame = useCallback(
    (id: string, pos: Position) =>
      dispatch({ type: "MOVE_PHOTO_FRAME", id, pos }),
    []
  )
  const setPhotoForFrame = useCallback(
    (frameId: string, photo: string) =>
      dispatch({ type: "SET_PHOTO_FOR_FRAME", frameId, photo }),
    []
  )

  const addFigurine = useCallback(
    (gender: FigurineGender) => {
      const count = state.figurines.length
      dispatch({
        type: "ADD_FIGURINE",
        figurine: {
          id: `fig-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          gender,
          position: getFigurineDefaultPos(count, gender),
        },
      })
    },
    [state.figurines.length]
  )
  const removeFigurine = useCallback(
    (id: string) => dispatch({ type: "REMOVE_FIGURINE", id }),
    []
  )
  const moveFigurine = useCallback(
    (id: string, pos: Position) => dispatch({ type: "MOVE_FIGURINE", id, pos }),
    []
  )

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        setStep,
        setFrameSize,
        setFrameColor,
        setBackgroundType,
        setBackgroundColor,
        setBackgroundDesign,
        setBackgroundCustom,
        addSpotlight,
        removeSpotlight,
        moveSpotlight,
        addPhotoFrame,
        removePhotoFrame,
        movePhotoFrame,
        setPhotoForFrame,
        addFigurine,
        removeFigurine,
        moveFigurine,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext)
  if (!ctx)
    throw new Error("useConfigurator must be used within ConfiguratorProvider")
  return ctx
}
