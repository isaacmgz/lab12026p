import type { ComponentPropsWithRef, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './styles'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles(variant, size), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  )
}
