import { useParams } from 'common'
import { PageContainer } from 'ui-patterns/PageContainer'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from 'ui-patterns/PageHeader'

import { HOW_2_MARKDOWN } from './how-2.md'
import { Markdown } from '@/components/interfaces/Markdown'

export const How2Page = () => {
  const { ref = 'default' } = useParams()
  const content = HOW_2_MARKDOWN.replaceAll('{{ref}}', ref)

  return (
    <>
      <PageHeader size="small">
        <PageHeaderMeta>
          <PageHeaderSummary>
            <PageHeaderTitle>how 2</PageHeaderTitle>
            <PageHeaderDescription>
              How REBAAS is meant to run: one database, one schema per instance, and what to touch
              day to day.
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
