import { useParams } from 'common'
import { PageContainer } from 'ui-patterns/PageContainer'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from 'ui-patterns/PageHeader'

import { BACKUPS_MARKDOWN } from './backups.md'
import { Markdown } from '@/components/interfaces/Markdown'

export const BackupsPage = () => {
  const { ref = 'default' } = useParams()
  const content = BACKUPS_MARKDOWN.replaceAll('{{ref}}', ref)

  return (
    <>
      <PageHeader size="small">
        <PageHeaderMeta>
          <PageHeaderSummary>
            <PageHeaderTitle>Backups</PageHeaderTitle>
            <PageHeaderDescription>
              How to snapshot Postgres and server config on the machine that runs Docker Compose.
            </PageHeaderDescription>
          </PageHeaderSummary>
        </PageHeaderMeta>
      </PageHeader>
      <PageContainer size="small">
        <Markdown className="prose prose-docs max-w-none" content={content} />
      </PageContainer>
    </>
  )
}
