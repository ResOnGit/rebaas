import { PageContainer } from 'ui-patterns/PageContainer'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from 'ui-patterns/PageHeader'

import { ConnectView } from '@/components/interfaces/ConnectSheet/ConnectView'
import { useConnectFlow } from '@/components/interfaces/ConnectSheet/useConnectFlow'

export const ConnectPage = () => {
  const connect = useConnectFlow({
    enabled: true,
    hydrateOnMount: true,
    mountSource: 'header_button',
  })

  return (
    <>
      <PageHeader size="small">
        <PageHeaderMeta>
          <PageHeaderSummary>
            <PageHeaderTitle>Connect</PageHeaderTitle>
            <PageHeaderDescription>
              Wire your app to this REBAAS project — API keys, env vars, and connection strings.
            </PageHeaderDescription>
          </PageHeaderSummary>
        </PageHeaderMeta>
      </PageHeader>
      <PageContainer size="large">
        <ConnectView
          state={connect.state}
          activeFields={connect.activeFields}
          resolvedSteps={connect.resolvedSteps}
          availableModes={connect.availableModes}
          projectKeys={connect.projectKeys}
          getFieldOptions={connect.getFieldOptions}
          onModeChange={connect.handleModeChange}
          onFieldChange={connect.handleFieldChange}
        />
      </PageContainer>
    </>
  )
}
