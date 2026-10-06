import { PermissionAction } from '@supabase/shared-types/out/constants'
import { useParams } from 'common'
import type { ConnectSheetSource } from 'common/telemetry-constants'
import { useEffect, useMemo, useRef } from 'react'

import type { ConnectMode, ProjectKeys } from './Connect.types'
import { resolveConnectSheetHydration } from './ConnectSheet.utils'
import { useAvailableConnectModes } from './useAvailableConnectModes'
import { useConnectSheetParams } from './useConnectSheetParams'
import { useConnectState } from './useConnectState'
import { useAPIKeys } from '@/data/api-keys/api-keys-query'
import { useProjectApiUrl } from '@/data/config/project-endpoint-query'
import { useAsyncCheckPermissions } from '@/hooks/misc/useCheckPermissions'
import { useTrack } from '@/lib/telemetry/track'
import { useAppStateSnapshot } from '@/state/app-state'

type UseConnectFlowOptions = {
  /** Fetch API URL + keys (always true on the Connect page). */
  enabled: boolean
  /** Run hydration from URL / localStorage once when the surface mounts. */
  hydrateOnMount?: boolean
  /** Telemetry source when hydration runs on mount. */
  mountSource?: ConnectSheetSource
}

export function useConnectFlow({
  enabled,
  hydrateOnMount = false,
  mountSource = 'header_button',
}: UseConnectFlowOptions) {
  const track = useTrack()
  const hasHydrated = useRef(false)
  const { ref: projectRef } = useParams()
  const { connectSheetSource, setConnectSheetSource } = useAppStateSnapshot()

  const availableModeIds = useAvailableConnectModes()
  const { state, activeFields, resolvedSteps, schema, getFieldOptions, setMode, updateField } =
    useConnectState()

  const { params, storedPrefs, setConnectParams, setQueryParams } = useConnectSheetParams()
  const {
    connectTab,
    framework: queryFramework,
    using: queryUsing,
    method: queryMethod,
    type: queryType,
    mcpClient: queryMcpClient,
    warehouseQueryEngine: queryWarehouseQueryEngine,
  } = params

  useEffect(() => {
    if (!enabled || !hydrateOnMount || hasHydrated.current) return
    hasHydrated.current = true

    track('connect_sheet_opened', { source: connectSheetSource ?? mountSource })
    setConnectSheetSource(mountSource)

    const { mode, fieldUpdates, urlUpdates } = resolveConnectSheetHydration(
      {
        connectTab,
        framework: queryFramework,
        using: queryUsing,
        method: queryMethod,
        type: queryType,
        mcpClient: queryMcpClient,
        warehouseQueryEngine: queryWarehouseQueryEngine,
      },
      storedPrefs,
      availableModeIds
    )

    if (mode) setMode(mode)
    fieldUpdates.forEach(({ fieldId, value }) => updateField(fieldId, value))
    if (Object.keys(urlUpdates).length > 0) setQueryParams(urlUpdates)
  }, [
    enabled,
    hydrateOnMount,
    connectSheetSource,
    mountSource,
    connectTab,
    queryFramework,
    queryUsing,
    queryMethod,
    queryType,
    queryMcpClient,
    queryWarehouseQueryEngine,
    storedPrefs,
    availableModeIds,
    track,
    setConnectSheetSource,
    setMode,
    updateField,
    setQueryParams,
  ])

  const { data: endpoint = '' } = useProjectApiUrl({ projectRef }, { enabled })

  const { can: canReadAPIKeys } = useAsyncCheckPermissions(
    PermissionAction.READ,
    'service_api_keys'
  )
  const { data: apiKeysData } = useAPIKeys({ projectRef }, { enabled: enabled && canReadAPIKeys })

  const projectKeys: ProjectKeys = useMemo(() => {
    const { anonKey, publishableKey } = apiKeysData ?? {}
    return {
      apiUrl: endpoint,
      anonKey: anonKey?.api_key ?? null,
      publishableKey: publishableKey?.api_key ?? null,
    }
  }, [endpoint, apiKeysData])

  const availableModes = useMemo(
    () => schema.modes.filter((m) => availableModeIds.includes(m.id)),
    [schema.modes, availableModeIds]
  )

  const handleModeChange = (mode: ConnectMode) => {
    setMode(mode)
    setConnectParams({
      connectTab: mode,
      framework: null,
      using: null,
      method: null,
      type: null,
      mcpClient: null,
      warehouseQueryEngine: null,
    })
  }

  const handleFieldChange = (fieldId: string, value: string | boolean | string[]) => {
    updateField(fieldId, value)
    const str = String(value)
    if (fieldId === 'framework') {
      setConnectParams({ framework: str, using: null })
    } else if (fieldId === 'frameworkVariant') {
      setConnectParams({ using: str })
    } else if (fieldId === 'orm') {
      setConnectParams({ framework: str })
    } else if (fieldId === 'connectionMethod') {
      setConnectParams({ method: str, type: null })
    } else if (fieldId === 'connectionType') {
      setConnectParams({ type: str })
    } else if (fieldId === 'mcpClient') {
      setConnectParams({ mcpClient: str })
    }
  }

  return {
    state,
    activeFields,
    resolvedSteps,
    availableModes,
    projectKeys,
    getFieldOptions,
    handleModeChange,
    handleFieldChange,
  }
}
