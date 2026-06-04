"use client"

import { useDesignStore } from "../../store/useDesignStore"
import type { FigurineType } from "../../lib/designDoc"

function MaleIcon() {
  return (
    <svg viewBox="0 0 32 72" width={40} height={90}>
      {/* Head */}
      <circle cx="16" cy="9" r="8" fill="#3b5998" />
      {/* Face highlight */}
      <circle cx="13" cy="7" r="2" fill="rgba(255,255,255,0.2)" />
      {/* Body */}
      <rect x="9" y="18" width="14" height="26" rx="3" fill="#3b5998" />
      {/* Belt */}
      <rect x="9" y="40" width="14" height="3" fill="#2d4a7a" />
      {/* Left leg */}
      <rect x="9" y="44" width="6" height="22" rx="3" fill="#2d3e50" />
      {/* Right leg */}
      <rect x="17" y="44" width="6" height="22" rx="3" fill="#2d3e50" />
      {/* Left arm */}
      <rect x="2" y="20" width="7" height="20" rx="3" fill="#3b5998" />
      {/* Right arm */}
      <rect x="23" y="20" width="7" height="20" rx="3" fill="#3b5998" />
    </svg>
  )
}

function FemaleIcon() {
  return (
    <svg viewBox="0 0 32 72" width={40} height={90}>
      {/* Head */}
      <circle cx="16" cy="9" r="7" fill="#c0392b" />
      {/* Hair */}
      <path d="M8 9 Q16 2 24 9" fill="none" stroke="#8b2020" strokeWidth="3" />
      {/* Face highlight */}
      <circle cx="13" cy="7" r="2" fill="rgba(255,255,255,0.2)" />
      {/* Dress */}
      <path d="M9 18 L23 18 L28 54 L4 54 Z" fill="#c0392b" />
      {/* Dress detail */}
      <path d="M16 18 L16 54" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Left leg */}
      <rect x="8" y="54" width="6" height="18" rx="3" fill="#922b21" />
      {/* Right leg */}
      <rect x="18" y="54" width="6" height="18" rx="3" fill="#922b21" />
      {/* Left arm */}
      <rect x="2" y="19" width="6" height="18" rx="3" fill="#c0392b" />
      {/* Right arm */}
      <rect x="24" y="19" width="6" height="18" rx="3" fill="#c0392b" />
    </svg>
  )
}

const FIGURINE_CONFIG: {
  type: FigurineType
  label: string
  desc: string
  maxCount: number
  Icon: React.FC
}[] = [
  { type: "male_1",   label: "Male Figurine",   desc: "Up to 4 — navy suit style",    maxCount: 4, Icon: MaleIcon },
  { type: "female_1", label: "Female Figurine", desc: "Up to 3 — elegant dress style", maxCount: 3, Icon: FemaleIcon },
]

export function FigurinesStep() {
  const figurines    = useDesignStore((s) => s.figurines)
  const addFigurine  = useDesignStore((s) => s.addFigurine)
  const removeFigurine = useDesignStore((s) => s.removeFigurine)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Miniature Figurines</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add tiny gallery visitors to your scene. Drag them anywhere on the canvas to position.
        </p>
      </div>

      {figurines.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-blue-700">
          {figurines.length} figurine{figurines.length !== 1 ? "s" : ""} added · Drag to reposition on the canvas
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {FIGURINE_CONFIG.map(({ type, label, desc, maxCount, Icon }) => {
          const count = figurines.filter((f) => f.type === type).length
          const atMax = count >= maxCount
          return (
            <div
              key={type}
              className="border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-4"
            >
              <Icon />
              <div className="text-center">
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                {count > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {Array.from({ length: count }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-400"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => !atMax && addFigurine(type)}
                  disabled={atMax}
                  className={`px-4 py-1.5 text-sm rounded-xl transition-colors font-medium ${
                    atMax
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
                >
                  {atMax ? "Max" : "+ Add"}
                </button>
                {count > 0 && (
                  <button
                    onClick={() => {
                      const last = [...figurines].reverse().find((f) => f.type === type)
                      if (last) removeFigurine(last.id)
                    }}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
