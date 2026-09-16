import { Search } from 'lucide-react'
import { Input, Select } from '@/shared/ui'
import { customerSortOptions, type CustomerSort } from '../model/customer-list'

export interface CustomerToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  sort: CustomerSort
  onSortChange: (value: CustomerSort) => void
  resultCount: number
  totalCount: number
}

export function CustomerToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
}: CustomerToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 sm:max-w-xs">
        <label htmlFor="customer-search" className="sr-only">
          Search customers
        </label>
        <Input
          id="customer-search"
          type="search"
          value={search}
          placeholder="Search by name or account"
          leading={<Search aria-hidden="true" className="size-4" />}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <p aria-live="polite" className="text-sm text-muted">
          {resultCount} of {totalCount}
        </p>
        <div>
          <label htmlFor="customer-sort" className="sr-only">
            Sort customers
          </label>
          <Select
            id="customer-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as CustomerSort)}
            className="w-52"
          >
            {customerSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
