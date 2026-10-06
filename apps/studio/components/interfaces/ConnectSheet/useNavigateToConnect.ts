import { useParams } from 'common'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import type { ConnectSheetPrefs } from './useConnectSheetParams'

function buildConnectSearchParams(updates?: Partial<ConnectSheetPrefs>) {
  if (!updates) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function useNavigateToConnect() {
  const router = useRouter()
  const { ref } = useParams()

  return useCallback(
    (updates?: Partial<ConnectSheetPrefs>) => {
      if (!ref) return
      router.push(`/project/${ref}/connect${buildConnectSearchParams(updates)}`)
    },
    [ref, router]
  )
}
