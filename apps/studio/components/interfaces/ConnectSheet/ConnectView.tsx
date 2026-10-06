import type {
  ConnectMode,
  ConnectState,
  FieldOption,
  ProjectKeys,
  ResolvedField,
  ResolvedStep,
} from './Connect.types'
import { ConnectConfigSection, ModeSelector } from './ConnectConfigSection'
import { ConnectStepsSection } from './ConnectStepsSection'
import { WarehouseTab } from './WarehouseTab'

type ConnectViewProps = {
  state: ConnectState
  activeFields: ResolvedField[]
  resolvedSteps: ResolvedStep[]
  availableModes: Array<{ id: ConnectMode; label: string; description: string }>
  projectKeys: ProjectKeys
  getFieldOptions: (fieldId: string) => FieldOption[]
  onModeChange: (mode: ConnectMode) => void
  onFieldChange: (fieldId: string, value: string | boolean | string[]) => void
}

export const ConnectView = ({
  state,
  activeFields,
  resolvedSteps,
  availableModes,
  projectKeys,
  getFieldOptions,
  onModeChange,
  onFieldChange,
}: ConnectViewProps) => {
  return (
    <div className="flex min-w-0 flex-col divide-y border rounded-lg bg-background/25">
      <div className="p-6 md:p-8">
        <ModeSelector modes={availableModes} selected={state.mode} onChange={onModeChange} />
      </div>

      {state.mode === 'warehouse' ? (
        <WarehouseTab />
      ) : (
        <>
          {activeFields.length > 0 && (
            <div className="p-6 md:p-8">
              <ConnectConfigSection
                state={state}
                activeFields={activeFields}
                onFieldChange={onFieldChange}
                getFieldOptions={getFieldOptions}
              />
            </div>
          )}

          <ConnectStepsSection steps={resolvedSteps} state={state} projectKeys={projectKeys} />
        </>
      )}
    </div>
  )
}
