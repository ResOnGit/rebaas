import { ConnectLegacyQueryRedirect } from './ConnectLegacyQueryRedirect'
import { useConnectSheetShortcut } from './useConnectSheetShortcut'

export const ConnectGlobalHandlers = () => {
  useConnectSheetShortcut()
  return <ConnectLegacyQueryRedirect />
}
