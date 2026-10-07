import { safeSql } from '@supabase/pg-meta/src/pg-format'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { rebaasKeys } from './keys'
import { executeSql } from '@/data/sql/execute-sql-mutation'
import type { ResponseError, UseCustomQueryOptions } from '@/types'

const REBAAS_HOME_SQL = safeSql`
select
  coalesce(
    (
      select json_agg(
        json_build_object('name', s.name, 'tables', coalesce(t.tables, 0))
        order by s.name
      )
      from (
        select n.nspname as name
        from pg_namespace n
        where n.nspname not in (
          'pg_catalog',
          'information_schema',
          'pg_toast',
          'auth',
          'storage',
          'realtime',
          'supabase_functions',
          'extensions',
          'graphql',
          'graphql_public',
          'vault',
          'pgsodium',
          'pgsodium_masks',
          'net',
          'cron',
          'supabase_migrations',
          'pgbouncer',
          '_analytics',
          '_realtime'
        )
          and n.nspname not like 'pg\\_%'
      ) s
      left join (
        select n.nspname as name, count(*)::int as tables
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where c.relkind in ('r', 'p')
        group by n.nspname
      ) t on t.name = s.name
    ),
    '[]'::json
  ) as instances,
  pg_database_size(current_database())::bigint as database_bytes,
  coalesce((select count(*)::int from auth.users), 0) as auth_users
`

const instanceSchema = z.object({
  name: z.string(),
  tables: z.coerce.number(),
})

const rowSchema = z.object({
  instances: z.union([z.array(instanceSchema), z.string()]).transform((value) => {
    const parsed = typeof value === 'string' ? z.array(instanceSchema).parse(JSON.parse(value)) : value
    return parsed
  }),
  database_bytes: z.coerce.number(),
  auth_users: z.coerce.number(),
})

export type RebaasHomeInstance = z.infer<typeof instanceSchema>

export type RebaasHomeSnapshot = {
  instances: RebaasHomeInstance[]
  databaseBytes: number
  authUsers: number
}

export type RebaasHomeVariables = {
  projectRef?: string
  connectionString?: string | null
}

async function getRebaasHome(
  { projectRef, connectionString }: RebaasHomeVariables,
  signal?: AbortSignal
): Promise<RebaasHomeSnapshot> {
  const { result } = await executeSql<unknown[]>(
    {
      projectRef,
      connectionString,
      sql: REBAAS_HOME_SQL,
      queryKey: ['rebaas-home'],
    },
    signal
  )
  const row = rowSchema.parse(Array.isArray(result) ? result[0] : result)
  return {
    instances: row.instances,
    databaseBytes: row.database_bytes,
    authUsers: row.auth_users,
  }
}

export const useRebaasHomeQuery = (
  variables: RebaasHomeVariables,
  { enabled = true, ...options }: UseCustomQueryOptions<RebaasHomeSnapshot, ResponseError> = {}
) =>
  useQuery({
    queryKey: rebaasKeys.home(variables.projectRef),
    queryFn: ({ signal }) => getRebaasHome(variables, signal),
    enabled: enabled && typeof variables.projectRef !== 'undefined',
    ...options,
  })
