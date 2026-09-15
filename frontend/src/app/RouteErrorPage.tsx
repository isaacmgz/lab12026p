import { useRouteError } from 'react-router'
import { Card, ErrorState } from '@/shared/ui'

export function RouteErrorPage() {
  const error = useRouteError()
  const description =
    error instanceof Error ? error.message : 'The page could not be rendered. Please try again.'

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <Card>
        <ErrorState
          title="Something went wrong"
          description={description}
          onRetry={() => window.location.reload()}
        />
      </Card>
    </div>
  )
}
