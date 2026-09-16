import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { iconButtonStyles, type IconButtonTone } from './styles'

export interface IconButtonProps extends ComponentPropsWithRef<'button'> {
  label: string
  tone?: IconButtonTone
}

export function IconButton({
  label,
  tone = 'neutral',
  className,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(iconButtonStyles(tone), className)}
      {...props}
    >
      {children}
    </button>
  )
}
