import { useParams } from 'common'
import Link from 'next/link'
import { Card, CardContent, cn } from 'ui'

import { formatBytes, schemasMissingFromApi } from './RebaasHome.utils'
import { parseDbSchemaString, useProjectPostgrestConfigQuery } from '@/data/config/project-postgrest-config-query'
import { useRebaasHomeQuery } from '@/data/rebaas/rebaas-home-query'
import { useRebaasServiceStatusQuery } from '@/data/rebaas/rebaas-status-query'

export const RebaasHomeBoard = () => {
  const { ref } = useParams()
  const home = useRebaasHomeQuery({ projectRef: ref })
  const status = useRebaasServiceStatusQuery(ref)
  const postgrest = useProjectPostgrestConfigQuery({ projectRef: ref })

  const instances = home.data?.instances ?? []
  const exposed = parseDbSchemaString(postgrest.data?.db_schema ?? '')
  const missingFromApi = schemasMissingFromApi(
    instances.map((instance) => instance.name),
    exposed
  )
  const databaseUp = home.isSuccess
  const metaUp = home.isSuccess

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="text-sm font-medium">Instances</h3>
          {home.isLoading && <p className="text-sm text-foreground-light">Checking the database…</p>}
          {home.isError && (
            <p className="text-sm text-foreground-light">
              Database is not reachable from Studio yet. Start the local stack, then refresh.
            </p>
          )}
          {home.isSuccess && instances.length === 0 && (
            <p className="text-sm text-foreground-light">No application schemas yet.</p>
          )}
          {home.isSuccess && instances.length > 0 && (
            <ul className="flex flex-col gap-2">
              {instances.map((instance) => (
                <li key={instance.name} className="flex items-baseline justify-between gap-3 text-sm">
                  <Link
                    href={`/project/${ref}/editor?schema=${encodeURIComponent(instance.name)}`}
                    className="font-medium hover:underline"
                  >
                    {instance.name}
                  </Link>
                  <span className="text-foreground-light">
                    {instance.tables} {instance.tables === 1 ? 'table' : 'tables'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="text-sm font-medium">Not on the API</h3>
          {postgrest.isLoading && <p className="text-sm text-foreground-light">Checking PostgREST…</p>}
          {home.isSuccess && missingFromApi.length === 0 && (
            <p className="text-sm text-foreground-light">
              Every application schema is listed in PGRST_DB_SCHEMAS.
            </p>
          )}
          {missingFromApi.length > 0 && (
            <ul className="flex flex-col gap-1 text-sm">
              {missingFromApi.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
          <p className="text-xs text-foreground-lighter">
            Add a missing name to PGRST_DB_SCHEMAS and restart the rest service. See how 2.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="text-sm font-medium">Services</h3>
          <StatusRow label="Database" up={databaseUp} loading={home.isLoading} />
          <StatusRow label="Studio helper" up={metaUp} loading={home.isLoading} />
          <StatusRow label="API" up={status.data?.rest} loading={status.isLoading} />
          <StatusRow label="Auth" up={status.data?.auth} loading={status.isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div>
            <h3 className="text-sm font-medium">Database size</h3>
            <p className="mt-1 text-2xl">{readout(home.isLoading, home.data && formatBytes(home.data.databaseBytes))}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Auth users</h3>
            <p className="mt-1 text-2xl">{readout(home.isLoading, home.data?.authUsers)}</p>
            <p className="mt-1 text-xs text-foreground-light">
              {status.data?.emailSignIn === true && 'Email sign-in is on.'}
              {status.data?.emailSignIn === false && 'Email sign-in is off.'}
              {status.data?.emailSignIn == null && status.isSuccess && 'Email sign-in status is unavailable.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function readout(isLoading: boolean, value: string | number | undefined) {
  if (value !== undefined) return value
  if (isLoading) return '…'
  return 'Unavailable'
}

function statusLabel(isLoading: boolean, up: boolean | undefined) {
  if (isLoading) return 'Checking'
  if (up) return 'Up'
  return 'Down'
}

const StatusRow = ({
  label,
  up,
  loading,
}: {
  label: string
  up: boolean | undefined
  loading: boolean
}) => {
  const text = statusLabel(loading, up)
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className={cn('text-foreground-light', up && 'text-brand')}>{text}</span>
    </div>
  )
}
