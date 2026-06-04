"use client"

import { useDesignStore } from "../../store/useDesignStore"
import type { SpotlightModel } from "../../lib/designDoc"

function Spotlight1Preview() {
  return (
    <svg viewBox="0 0 50 72" width={50} height={72}>
      <rect x="15" y="0" width="20" height="10" rx="3" fill="#555" />
      <polygon points="5,72 45,72 36,10 14,10" fill="rgba(255,220,80,0.35)" />
      <ellipse cx="25" cy="6" rx="12" ry="8" fill="#888" />
      <circle cx="25" cy="6" r="5" fill="#ddd" />
    </svg>
  )
}

function Spotlight2Preview() {
  return (
    <svg viewBox="0 0 80 72" width={80} height={72}>
      <rect x="30" y="0" width="20" height="10" rx="3" fill="#555" />
      <rect x="8" y="4" width="64" height="4" rx="2" fill="#555" />
      <polygon points="0,72 26,72 20,10 2,10" fill="rgba(255,220,80,0.3)" />
      <polygon points="54,72 80,72 78,10 60,10" fill="rgba(255,220,80,0.3)" />
      <ellipse cx="11" cy="6" rx="12" ry="8" fill="#888" />
      <circle cx="11" cy="6" r="5" fill="#ddd" />
      <ellipse cx="69" cy="6" rx="12" ry="8" fill="#888" />
      <circle cx="69" cy="6" r="5" fill="#ddd" />
    </svg>
  )
}

const MODELS: {
  value: SpotlightModel
  label: string
  description: string
  Preview: React.FC
}[] = [
  { value: "spot1", label: "Single Beam",  description: "Classic focused spotlight — elegant and minimal", Preview: Spotlight1Preview },
  { value: "spot2", label: "Double Beam",  description: "Wide dual-beam fixture — illuminates more of the wall", Preview: Spotlight2Preview },
]

export function SpotlightStep() {
  const lights    = useDesignStore((s) => s.lights)
  const addLight  = useDesignStore((s) => s.addLight)
  const removeLight = useDesignStore((s) => s.removeLight)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Spotlight Fixtures</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add gallery lighting. Drag spotlights on the canvas (this step) to reposition. Double-click a spotlight to remove it.
        </p>
      </div>

      {lights.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700">
          {lights.length} spotlight{lights.length !== 1 ? "s" : ""} added · Drag on canvas · Dbl-click to remove
        </div>
      )}

      <div className="space-y-3">
        {MODELS.map(({ value, label, description, Preview }) => {
          const count = lights.filter((l) => l.model === value).length
          return (
            <div key={value} className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4">
              <div className="w-24 flex justify-center flex-shrink-0"><Preview /></div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                {count > 0 && <div className="text-xs font-semibold text-amber-600 mt-1">{count} added</div>}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => addLight(value)} className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors">+ Add</button>
                {count > 0 && (
                  <button
                    onClick={() => {
                      const last = [...lights].reverse().find((l) => l.model === value)
                      if (last) removeLight(last.id)
                    }}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors"
                  >Remove</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
