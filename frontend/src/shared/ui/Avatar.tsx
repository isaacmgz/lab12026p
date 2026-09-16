import { cn } from '@/shared/lib/cn'
import { getInitials } from '@/shared/lib/initials'

const palette = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200',
  'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200',
]

const sizeStyles = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
}

export interface AvatarProps {
  name: string
  seed?: string
  size?: keyof typeof sizeStyles
  className?: string
}

function paletteIndex(seed: string) {
  let hash = 0
  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) % 1000003
  }
  return hash % palette.length
}

export function Avatar({ name, seed, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        palette[paletteIndex(seed ?? name)],
        sizeStyles[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
