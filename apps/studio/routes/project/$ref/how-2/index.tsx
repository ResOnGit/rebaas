import { createFileRoute } from '@tanstack/react-router'

import { How2Page } from '@/components/interfaces/How2/How2Page'
import { ProjectLayoutWithAuth } from '@/components/layouts/ProjectLayout'

export const Route = createFileRoute('/project/$ref/how-2/')({
  component: ProjectHow2Route,
})

function ProjectHow2Route() {
  return (
    <ProjectLayoutWithAuth>
      <How2Page />
    </ProjectLayoutWithAuth>
  )
}
