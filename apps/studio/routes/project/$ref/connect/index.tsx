import { createFileRoute } from '@tanstack/react-router'

import { ConnectPage } from '@/components/interfaces/Connect/ConnectPage'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'

export const Route = createFileRoute('/project/$ref/connect/')({
  component: ProjectConnectRoute,
})

function ProjectConnectRoute() {
  return (
    <ProjectLayoutWithAuth>
      <ConnectPage />
    </ProjectLayoutWithAuth>
  )
}
