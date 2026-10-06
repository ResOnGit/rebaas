import { useParams } from 'common'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect } from 'react'

import { useNavigateToConnect } from './useNavigateToConnect'
import { useConnectSheetParams } from './useConnectSheetParams'

/**
 * Legacy entry points still set `?showConnect=true` on arbitrary routes.
 * Redirect them to the dedicated Connect page while preserving connect params.
 */
export const ConnectLegacyQueryRedirect = () => {
  const { ref } = useParams()
  const navigateToConnect = useNavigateToConnect()
  const [showConnect, setShowConnect] = useQueryState(
    'showConnect',
    parseAsBoolean.withDefault(false)
  )
  const { params } = useConnectSheetParams()

  useEffect(() => {
    if (!showConnect || !ref) return

    const { connectTab, framework, using, method, type, mcpClient, warehouseQueryEngine } = params
    setShowConnect(null)
    navigateToConnect({
      connectTab: connectTab ?? undefined,
      framework: framework ?? undefined,
      using: using ?? undefined,
      method: method ?? undefined,
      type: type ?? undefined,
      mcpClient: mcpClient ?? undefined,
      warehouseQueryEngine: warehouseQueryEngine ?? undefined,
    })
  }, [showConnect, ref, params, setShowConnect, navigateToConnect])

  return null
}
