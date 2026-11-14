import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { dangerButton, secondaryButton, sizeSmall } from './ui'

// "Anything destructive confirms first." A real dialog, not window.confirm.
// Focus starts on the safe button, Escape cancels, Tab stays inside.

type ConfirmDialogProps = {
  title: string
  body: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()
    return () => previous?.focus()
  }, [])

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const next = document.activeElement === cancelRef.current ? confirmRef : cancelRef
      next.current?.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-card border border-line bg-surface"
      >
        <h2
          id="confirm-title"
          className="border-b border-line px-6 py-4 font-display text-xl uppercase tracking-wide text-ink"
        >
          {title}
        </h2>
        <p id="confirm-body" className="px-6 py-6 text-sm text-muted">
          {body}
        </p>
        <div className="flex justify-end gap-2 border-t border-line bg-[#0E1A14] px-6 py-4">
          <button ref={cancelRef} type="button" className={`${secondaryButton} ${sizeSmall}`} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button ref={confirmRef} type="button" className={`${dangerButton} ${sizeSmall}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
