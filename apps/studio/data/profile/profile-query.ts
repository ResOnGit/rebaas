import { useQuery } from '@tanstack/react-query'

import { profileKeys } from './keys'
import type { Profile } from './types'
import { get, handleError } from '@/data/fetchers'
import { IS_PLATFORM } from '@/lib/constants'
import type { ResponseError, UseCustomQueryOptions } from '@/types'

// Hidden from the sidebar and command menu. Routes stay in the repo.
const REBAAS_HIDDEN_FEATURES = [
  'project_storage:all',
  'project_edge_function:all',
  'realtime:all',
]

export async function getProfile(signal?: AbortSignal) {
  const { data, error } = await get('/platform/profile', {
    signal,
    headers: { Version: '2' },
  })

  if (error) handleError(error)

  if (!IS_PLATFORM) {
    const fromEnv = process.env.NEXT_PUBLIC_DISABLED_FEATURES?.split(',').filter(Boolean) ?? []
    return {
      ...data,
      disabled_features: [...new Set([...REBAAS_HIDDEN_FEATURES, ...fromEnv])],
    } as Profile
  } else {
    return data as Profile
  }
}

export type ProfileData = Awaited<ReturnType<typeof getProfile>>
export type ProfileError = ResponseError

export const useProfileQuery = <TData = ProfileData>({
  enabled = true,
  ...options
}: UseCustomQueryOptions<ProfileData, ProfileError, TData> = {}) => {
  return useQuery<ProfileData, ProfileError, TData>({
    queryKey: profileKeys.profile(),
    queryFn: ({ signal }) => getProfile(signal),
    staleTime: 1000 * 60 * 30,
    ...options,
    enabled,
  })
}
