"use client"

import { useRef, useState } from "react"
import { useDesignStore } from "../../store/useDesignStore"
import { PHOTO_FRAME_LABELS, FRAME_SIZE_CM } from "../../lib/constants"
import { uploadFile } from "../../lib/upload"
import { checkPhotoDpi } from "../../lib/designDoc"

export function PhotoUploadStep() {
  const photoFrames    = useDesignStore((s) => s.photoFrames)
  const frame          = useDesignStore((s) => s.frame)
  const setPhotoForFrame = useDesignStore((s) => s.setPhotoForFrame)
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const [dpiWarnings, setDpiWarnings] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  if (photoFrames.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Your Photos</h3>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-400">No photo frames added yet.</p>
          <p className="text-xs text-gray-400">
            Go back to Step 5 to add interior frames first.
          </p>
        </div>
      </div>
    )
  }

  const handleUpload = async (
    frameId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    // DPI pre-check using a temporary object URL
    const tmpUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = async () => {
      const frameSizeCm = FRAME_SIZE_CM[frame.size] ?? 30
      const pf = photoFrames.find((f) => f.id === frameId)
      if (pf) {
        const warning = checkPhotoDpi(img.naturalWidth, pf, frameSizeCm)
        setDpiWarnings((prev) => ({ ...prev, [frameId]: warning ?? "" }))
      }
      URL.revokeObjectURL(tmpUrl)
      // Now upload for real
      setUploading((prev) => ({ ...prev, [frameId]: true }))
      try {
        const { fileId, url } = await uploadFile(file)
        setPhotoForFrame(frameId, { fileId, url, offsetX: 0, offsetY: 0, scale: 1 })
      } finally {
        setUploading((prev) => ({ ...prev, [frameId]: false }))
      }
    }
    img.src = tmpUrl
  }

  const withPhotos = photoFrames.filter((f) => f.photo).length

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Upload Your Photos</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload a photo for each frame. Photos are clipped to the frame shape.
          In step 5 you can drag the frames; in this step drag the photo to pan it within the frame.
        </p>
      </div>

      {withPhotos > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700">
          {withPhotos} of {photoFrames.length} frame{photoFrames.length !== 1 ? "s" : ""} have photos
        </div>
      )}

      <div className="space-y-3">
        {photoFrames.map((pf, idx) => (
          <div key={pf.id} className="border border-gray-200 rounded-2xl p-4 flex items-start gap-4">
            {/* Thumb */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
              {pf.photo ? (
                <img src={pf.photo.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">Frame {idx + 1}</div>
              <div className="text-xs text-gray-500 mt-0.5">{PHOTO_FRAME_LABELS[pf.type]}</div>
              {pf.photo ? (
                <div className="text-xs text-green-600 mt-1 font-medium">✓ Photo uploaded</div>
              ) : (
                <div className="text-xs text-gray-400 mt-1">No photo yet</div>
              )}
              {/* DPI warning */}
              {dpiWarnings[pf.id] && (
                <div className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                  ⚠️ {dpiWarnings[pf.id]}
                </div>
              )}
            </div>

            {/* Upload button */}
            <div className="flex-shrink-0">
              <input
                ref={(el) => {
                  if (el) inputRefs.current.set(pf.id, el)
                  else inputRefs.current.delete(pf.id)
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(pf.id, e)}
              />
              <button
                onClick={() => inputRefs.current.get(pf.id)?.click()}
                disabled={uploading[pf.id]}
                className={`px-4 py-1.5 text-sm rounded-xl transition-colors font-medium ${
                  uploading[pf.id]
                    ? "bg-gray-100 text-gray-400"
                    : pf.photo
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {uploading[pf.id] ? "Uploading…" : pf.photo ? "Change" : "Upload"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
