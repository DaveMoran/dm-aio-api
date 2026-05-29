import { mock } from 'bun:test'

// Minimal chainable Supabase stub used when no service-level mock is
// registered for a given service. Prevents supabase.ts from throwing at
// module load time (it requires env vars) and provides just enough of the
// query-builder API for routes that reach the DB in integration-style tests.
// Service-level mocks in individual test files take precedence.
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
  supabase: { from: () => createChain() },
}))
