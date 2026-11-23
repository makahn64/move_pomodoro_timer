import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  title: string
  children: React.ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** A modal built on the native <dialog>, so focus trapping and Escape come for free. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel
}: Props): React.JSX.Element {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      // Escape fires cancel; keep React state as the source of truth.
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      // The panel fills the dialog, so only a backdrop click targets the <dialog> itself.
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="dialog-panel">
        <h2 id="dialog-title" className="dialog-title">
          {title}
        </h2>
        <div className="dialog-body">{children}</div>
        <div className="dialog-actions">
          <button className="btn btn-line" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
