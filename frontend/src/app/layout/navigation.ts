import { ArrowLeftRight, ReceiptText, Users, type LucideIcon } from 'lucide-react'

export interface NavigationItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/history', label: 'History', icon: ReceiptText },
]
