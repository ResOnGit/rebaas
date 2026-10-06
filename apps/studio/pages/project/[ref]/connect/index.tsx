import { ConnectPage } from '@/components/interfaces/Connect/ConnectPage'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'
import type { NextPageWithLayout } from '@/types'

const ProjectConnectPage: NextPageWithLayout = () => {
  return <ConnectPage />
}

ProjectConnectPage.getLayout = (page) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default ProjectConnectPage
