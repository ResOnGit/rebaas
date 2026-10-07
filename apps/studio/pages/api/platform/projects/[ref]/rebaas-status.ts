import type { NextApiRequest, NextApiResponse } from 'next'

import { apiWrapper } from '@/lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ data: null, error: { message: `Method ${req.method} Not Allowed` } })
  }

  const base = (process.env.SUPABASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')
  const [auth, rest] = await Promise.all([probe(`${base}/auth/v1/health`), probe(`${base}/rest/v1/`)])

  let emailSignIn: boolean | null = null
  try {
    const response = await fetch(`${base}/auth/v1/settings`, { signal: AbortSignal.timeout(2000) })
    if (response.ok) {
      const body = (await response.json()) as { external?: { email?: boolean } }
      emailSignIn = body.external?.email ?? null
    }
  } catch {
    emailSignIn = null
  }

  return res.status(200).json({ auth, rest, emailSignIn })
}

async function probe(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) })
    return response.status < 500
  } catch {
    return false
  }
}
