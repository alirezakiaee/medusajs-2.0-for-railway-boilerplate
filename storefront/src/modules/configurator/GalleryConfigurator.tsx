"use client"

import { Fragment, useRef } from "react"
import dynamic from "next/dynamic"
import type Konva from "konva"
import { useDesignStore } from "./store/useDesignStore"
import { CONFIGURATOR_STEPS } from "./lib/constants"
import { FrameSizeStep } from "./components/steps/FrameSizeStep"
import { FrameColorStep } from "./components/steps/FrameColorStep"
import { BackgroundStep } from "./components/steps/BackgroundStep"
import { SpotlightStep } from "./components/steps/SpotlightStep"
import { PhotoFramesStep } from "./components/steps/PhotoFramesStep"
import { PhotoUploadStep } from "./components/steps/PhotoUploadStep"
import { FigurinesStep } from "./components/steps/FigurinesStep"
import { SummaryStep } from "./components/steps/SummaryStep"

// Konva requires browser globals — load client-side only
const KonvaCanvas = dynamic(
  () => import("./components/canvas/KonvaCanvas").then((m) => ({ default: m.KonvaCanvas })),
  { ssr: false, loading: () => <div className="w-[520px] h-[520px] bg-gray-100 rounded-2xl animate-pulse" /> }
)

const STEP_COMPONENTS = [
  FrameSizeStep,
  FrameColorStep,
  BackgroundStep,
  SpotlightStep,
  PhotoFramesStep,
  PhotoUploadStep,
  FigurinesStep,
  SummaryStep,
]

function GalleryConfigurator() {
  const currentStep = useDesignStore((s) => s.currentStep)
  const setStep     = useDesignStore((s) => s.setStep)
  const stageRef    = useRef<Konva.Stage>(null)

  const ActiveStep = STEP_COMPONENTS[currentStep - 1]
  const isFirst = currentStep === 1
  const isLast  = currentStep === CONFIGURATOR_STEPS.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header with step progress ─────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Personalized Miniature Art Gallery Memory Frame
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Step {currentStep} of {CONFIGURATOR_STEPS.length} —{" "}
                {CONFIGURATOR_STEPS[currentStep - 1].title}
              </p>
            </div>
          </div>

          {/* Step progress bar */}
          <div className="flex items-center overflow-x-auto no-scrollbar pb-1">
            {CONFIGURATOR_STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.number
              const isActive = currentStep === step.number
              const isClickable = isCompleted || isActive

              return (
                <Fragment key={step.number}>
                  <button
                    onClick={() => isClickable && setStep(step.number)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center gap-1 flex-shrink-0 ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gray-900 text-white scale-110 shadow-md"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-[10px] hidden sm:block font-medium transition-colors ${
                        isActive
                          ? "text-gray-900"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  {idx < CONFIGURATOR_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 min-w-[8px] transition-colors ${
                        currentStep > step.number
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left: step content ────────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-80">
              {ActiveStep && <ActiveStep />}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4 gap-3">
              <button
                onClick={() => setStep(currentStep - 1)}
                disabled={isFirst}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Back
              </button>
              {!isLast && (
                <button
                  onClick={() => setStep(currentStep + 1)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Konva canvas (sticky on large screens) ─────────── */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <div className="lg:sticky lg:top-[130px]">
              <KonvaCanvas stageRef={stageRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Exported page wrapper (includes the provider) ───────────────────────────

export { GalleryConfigurator }
