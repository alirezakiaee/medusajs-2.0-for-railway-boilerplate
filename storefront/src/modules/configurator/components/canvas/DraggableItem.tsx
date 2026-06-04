"use client"

import { useRef, useCallback } from "react"
import { type Position } from "../../types"

interface Props {
  position: Position
  onMove: (pos: Position) => void
  bounds: { w: number; h: number; ew: number; eh: number }
  children: React.ReactNode
  className?: string
}

export function DraggableItem({
  position,
  onMove,
  bounds,
  children,
  className,
}: Props) {
  const isDragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      isDragging.current = true
      dragStart.current = {
        mx: e.clientX,
        my: e.clientY,
        px: position.x,
        py: position.y,
      }
    },
    [position.x, position.y]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.mx
      const dy = e.clientY - dragStart.current.my
      const newX = Math.max(
        0,
        Math.min(bounds.w - bounds.ew, dragStart.current.px + dx)
      )
      const newY = Math.max(
        0,
        Math.min(bounds.h - bounds.eh, dragStart.current.py + dy)
      )
      onMove({ x: newX, y: newY })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onMove, bounds.w, bounds.h, bounds.ew, bounds.eh]
  )

  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      className={`absolute select-none cursor-grab active:cursor-grabbing ${
        className ?? ""
      }`}
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
        zIndex: 5,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  )
}
