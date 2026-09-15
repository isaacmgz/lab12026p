import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { IconButton } from './IconButton'

export interface CopyButtonProps {
  value: string
  label: string
  successMessage?: string
}

export function CopyButton({ value, label, successMessage = 'Copied' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  return (
    <IconButton
      label={label}
      className="size-7"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          toast.success(successMessage)
        } catch {
          toast.error('Could not copy to the clipboard')
        }
      }}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5 text-success" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
    </IconButton>
  )
}
