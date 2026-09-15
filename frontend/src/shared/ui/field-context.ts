import { createContext, use } from 'react'

export interface FieldContextValue {
  controlId: string
  describedBy?: string
  invalid: boolean
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldControl() {
  const context = use(FieldContext)

  if (!context) {
    return { id: undefined, 'aria-describedby': undefined, 'aria-invalid': undefined }
  }

  return {
    id: context.controlId,
    'aria-describedby': context.describedBy,
    'aria-invalid': context.invalid || undefined,
  }
}
