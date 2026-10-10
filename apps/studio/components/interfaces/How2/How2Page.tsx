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
import {
  How2ApiAndApps,
  How2PostgresHierarchy,
  How2SecurityFlow,
  How2TwoAppLayouts,
} from './How2Visuals'
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
              One REBAAS database, one schema per entity group (res, k1, k2), Revits templates, and
              the security steps for each new warung.
            </PageHeaderDescription>
          </PageHeaderSummary>
        </PageHeaderMeta>
      </PageHeader>
      <PageContainer size="small">
        <div className="mb-8 space-y-2 border-b pb-8">
          <h2 className="text-base font-medium text-foreground">At a glance</h2>
          <How2PostgresHierarchy />
          <How2ApiAndApps />
          <How2SecurityFlow />
          <How2TwoAppLayouts />
        </div>
        <Markdown className="prose prose-docs max-w-none" content={content} />
      </PageContainer>
    </>
  )
}
