export type FrameSize = "20x20" | "30x30" | "40x40"
export type FrameColor = "black" | "white"
export type BackgroundType = "plain" | "design" | "custom"
export type PlainColor = "black" | "white" | "green"
export type DesignOption = "design1" | "design2" | "design3"
export type SpotlightModel = "model1" | "model2"
export type PhotoFrameType =
  | "ornate-rect"
  | "ornate-oval"
  | "heart-large"
  | "heart-small"
  | "ornate-square"
  | "center-display"
export type FigurineGender = "male" | "female"

export interface Position {
  x: number
  y: number
}

export interface CanvasSpotlight {
  id: string
  model: SpotlightModel
  position: Position
}

export interface CanvasPhotoFrame {
  id: string
  type: PhotoFrameType
  position: Position
  photo?: string
}

export interface CanvasFigurine {
  id: string
  gender: FigurineGender
  position: Position
}

export interface ConfiguratorState {
  currentStep: number
  frameSize: FrameSize
  frameColor: FrameColor
  backgroundType: BackgroundType
  backgroundColor: PlainColor
  backgroundDesign: DesignOption
  backgroundCustom: string | null
  spotlights: CanvasSpotlight[]
  photoFrames: CanvasPhotoFrame[]
  figurines: CanvasFigurine[]
}

export const FRAME_SIZE_LABELS: Record<FrameSize, string> = {
  "20x20": "20 × 20 cm",
  "30x30": "30 × 30 cm",
  "40x40": "40 × 40 cm",
}

export const PHOTO_FRAME_LABELS: Record<PhotoFrameType, string> = {
  "ornate-rect": "Ornate Gold Rectangular",
  "ornate-oval": "Large Ornate Gold Oval",
  "heart-large": "Large Gold Heart",
  "heart-small": "Small Gold Heart",
  "ornate-square": "Ornate Gold Square",
  "center-display": "Center Display Frame",
}

export const PHOTO_FRAME_DIMS: Record<PhotoFrameType, { w: number; h: number }> = {
  "ornate-rect": { w: 100, h: 130 },
  "ornate-oval": { w: 100, h: 120 },
  "heart-large": { w: 110, h: 105 },
  "heart-small": { w: 70, h: 67 },
  "ornate-square": { w: 100, h: 100 },
  "center-display": { w: 140, h: 165 },
}

export const SPOTLIGHT_DIMS: Record<SpotlightModel, { w: number; h: number }> = {
  model1: { w: 50, h: 70 },
  model2: { w: 80, h: 70 },
}

export const FIGURINE_DIMS: Record<FigurineGender, { w: number; h: number }> = {
  male: { w: 32, h: 72 },
  female: { w: 32, h: 72 },
}

export const CANVAS_SIZE = 480

export const STEPS = [
  { number: 1, title: "Frame Size", description: "Choose your frame dimensions" },
  { number: 2, title: "Frame Color", description: "Select the frame finish" },
  { number: 3, title: "Background", description: "Design your gallery wall" },
  { number: 4, title: "Spotlights", description: "Add gallery lighting" },
  { number: 5, title: "Photo Frames", description: "Add decorative inner frames" },
  { number: 6, title: "Your Photos", description: "Upload & place your memories" },
  { number: 7, title: "Figurines", description: "Add tiny gallery visitors" },
  { number: 8, title: "Review", description: "Final preview & order" },
]
