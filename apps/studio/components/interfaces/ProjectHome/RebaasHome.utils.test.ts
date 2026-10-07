import { describe, expect, it } from 'vitest'

import { formatBytes, schemasMissingFromApi } from './RebaasHome.utils'

describe('formatBytes', () => {
  it('formats megabytes and gigabytes', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1_500_000)).toBe('1.4 MB')
    expect(formatBytes(5_000_000_000)).toBe('4.7 GB')
  })
})

describe('schemasMissingFromApi', () => {
  it('returns schemas that PostgREST is not serving', () => {
    expect(schemasMissingFromApi(['public', 'ims_bts'], ['public', 'graphql_public'])).toEqual([
      'ims_bts',
    ])
  })
})
