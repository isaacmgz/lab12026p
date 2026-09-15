import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { IconButton } from './IconButton'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  footer?: ReactNode
  className?: string
  children: ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  className,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) {
      return
    }

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        onClose()
      }
    }

    dialog.addEventListener('click', handleBackdropClick)
    return () => dialog.removeEventListener('click', handleBackdropClick)
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-surface p-0 text-foreground shadow-raised',
        'backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="space-y-1">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton label="Close dialog" onClick={onClose} className="-mt-1 -mr-1">
          <X aria-hidden="true" className="size-4" />
        </IconButton>
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer ? (
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-muted/40 px-5 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      ) : null}
    </dialog>
  )
}
