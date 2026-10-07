import { createFileRoute } from '@tanstack/react-router'

import { BackupsPage } from '@/components/interfaces/Backups/BackupsPage'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'

export const Route = createFileRoute('/project/$ref/backups/')({
  component: ProjectBackupsRoute,
})

function ProjectBackupsRoute() {
  return (
    <ProjectLayoutWithAuth>
      <BackupsPage />
    </ProjectLayoutWithAuth>
  )
}
