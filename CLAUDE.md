# resolve-metadata

NFT metadata normalizer — takes raw JSON from tokenURI/uri/contractURI responses and outputs a strict typed schema.

## Code style

TypeScript, single quotes, no semicolons. Pure functions, zero runtime dependencies.

## Structure

- `src/index.ts` — barrel exports
- `src/types.ts` — all public types (TokenMetadata, ContractMetadata, TokenAttribute, etc.)
- `src/normalize/` — normalizers: `uri.ts` (gateway→protocol URIs), `attributes.ts` (trait formats), `color.ts` (hex colors)
- `src/resolve/` — resolvers: `token-metadata.ts`, `contract-metadata.ts`
- `src/utils/is.ts` — type guards

## Key patterns

- Input is `unknown`, output is strictly typed — resolvers never throw, they return null/empty defaults for invalid input
- URI normalization detects IPFS/IPNS gateways by path (`/ipfs/`) and subdomain (`.ipfs.`) patterns, not a gateway allowlist
- Arweave gateways detected by known hostname list
- Aliases map common non-standard field names to canonical ones (e.g. `image_url`→`image`)
- Unknown fields collected into `extra: Record<string, unknown>`

## Commands

- `pnpm build` — Vite build (ESM + rolled-up .d.ts)
- `pnpm test` — Vitest
- `pnpm typecheck` — tsc --noEmit
