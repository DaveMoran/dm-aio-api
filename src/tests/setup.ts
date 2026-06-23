import { mock } from 'bun:test'

function createChain() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    upsert: () => chain,
    update: () => chain,
    delete: () => chain,
    eq: () => chain,
    neq: () => chain,
    in: () => chain,
    is: () => chain,
    or: () => chain,
    lte: () => chain,
    gt: () => chain,
    order: () => chain,
    limit: () => chain,
    filter: () => chain,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (
      resolve: (v: { data: unknown[]; error: null }) => void,
      reject?: (e: Error) => void,
    ) => Promise.resolve({ data: [], error: null }).then(resolve, reject),
  }
  return chain
}

mock.module('../lib/supabase.js', () => ({
  getSupabase: () => ({
    from: () => createChain(),
    auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
  }),
}))
