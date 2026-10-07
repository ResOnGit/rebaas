import { BackupsPage } from '@/components/interfaces/Backups/BackupsPage'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'
import type { NextPageWithLayout } from '@/types'

const ProjectBackupsPage: NextPageWithLayout = () => {
  return <BackupsPage />
}

ProjectBackupsPage.getLayout = (page) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default ProjectBackupsPage
