import { useSetCommandMenuOpen } from 'ui-patterns/CommandMenu'

import { useNavigateToConnect } from './useNavigateToConnect'
import { useSelectedProjectQuery } from '@/hooks/misc/useSelectedProject'
import { PROJECT_STATUS } from '@/lib/constants'
import { useAppStateSnapshot } from '@/state/app-state'
import { SHORTCUT_IDS } from '@/state/shortcuts/registry'
import { useShortcut } from '@/state/shortcuts/useShortcut'

export function useConnectSheetShortcut() {
  const setCommandMenuOpen = useSetCommandMenuOpen()
  const navigateToConnect = useNavigateToConnect()
  const { data: selectedProject } = useSelectedProjectQuery()
  const { setConnectSheetSource } = useAppStateSnapshot()
  const enabled = selectedProject?.status === PROJECT_STATUS.ACTIVE_HEALTHY

  useShortcut(
    SHORTCUT_IDS.CONNECT_OPEN_SHEET,
    () => {
      setConnectSheetSource('keyboard_shortcut')
      setCommandMenuOpen(false)
      navigateToConnect()
    },
    { enabled }
  )
}
