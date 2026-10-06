import { How2Page } from '@/components/interfaces/How2/How2Page'
import { DefaultLayout } from '@/components/layouts/DefaultLayout'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'
import type { NextPageWithLayout } from '@/types'

const ProjectHow2Page: NextPageWithLayout = () => {
  return <How2Page />
}

ProjectHow2Page.getLayout = (page) => (
  <DefaultLayout>
    <ProjectLayoutWithAuth>{page}</ProjectLayoutWithAuth>
  </DefaultLayout>
)

export default ProjectHow2Page
