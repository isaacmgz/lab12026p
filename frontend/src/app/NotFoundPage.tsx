import { Compass } from 'lucide-react'
import { Link } from 'react-router'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import { buttonStyles, Card, EmptyState } from '@/shared/ui'

export function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or was moved."
        action={
          <Link to="/customers" className={buttonStyles('primary')}>
            Go to customers
          </Link>
        }
      />
    </Card>
  )
}
