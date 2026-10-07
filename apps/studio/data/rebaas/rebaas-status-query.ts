import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { rebaasKeys } from './keys'
import { BASE_PATH } from '@/lib/constants'
import type { ResponseError, UseCustomQueryOptions } from '@/types'

const statusSchema = z.object({
  auth: z.boolean(),
  rest: z.boolean(),
  emailSignIn: z.boolean().nullable(),
})

export type RebaasServiceStatus = z.infer<typeof statusSchema>

async function getRebaasServiceStatus(projectRef: string, signal?: AbortSignal) {
  const response = await fetch(`${BASE_PATH}/api/platform/projects/${projectRef}/rebaas-status`, {
    signal,
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Failed to check REBAAS services')
  }
  return statusSchema.parse(await response.json())
}

export const useRebaasServiceStatusQuery = (
  projectRef: string | undefined,
  { enabled = true, ...options }: UseCustomQueryOptions<RebaasServiceStatus, ResponseError> = {}
) =>
  useQuery({
    queryKey: rebaasKeys.status(projectRef),
    queryFn: ({ signal }) => {
      if (!projectRef) throw new Error('projectRef is required')
      return getRebaasServiceStatus(projectRef, signal)
    },
    enabled: enabled && typeof projectRef !== 'undefined',
    refetchInterval: 30_000,
    ...options,
  })
