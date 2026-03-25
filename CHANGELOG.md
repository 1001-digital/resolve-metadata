# @1001-digital/resolve-metadata

## 1.0.2

### Patch Changes

- [`80cdb39`](https://github.com/1001-digital/resolve-metadata/commit/80cdb3917924063906d84d10b1ff288032ae435c) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `isResolvableUri` type guard and fix redundant path segments in protocol URIs (`ipfs://ipfs/…` → `ipfs://…`, `ipns://ipns/…` → `ipns://…`).

## 1.0.1

### Patch Changes

- [`257c692`](https://github.com/1001-digital/resolve-metadata/commit/257c692ccd7846b8337890689b5ce0b6589619d9) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix redundant path segments in protocol URIs (`ipfs://ipfs/…` → `ipfs://…`, `ipns://ipns/…` → `ipns://…`).

## 1.0.0

### Major Changes

- [`60b0290`](https://github.com/1001-digital/resolve-metadata/commit/60b0290653691309dfaffaafecd9cf957701da6b) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add token and contract metadata resolvers with URI normalization.
  - `resolveTokenMetadata()` normalizes ERC-721/ERC-1155 token metadata (name, description, image, attributes, etc.)
  - `resolveContractMetadata()` normalizes ERC-7572 contract metadata (name, description, image, banner, collaborators, etc.)
  - `normalizeUri()` converts IPFS/IPNS gateway URLs and Arweave gateway URLs to protocol URIs
  - Handles common edge cases: field aliases (`image_url` → `image`), attribute format variations, numeric string coercion, hex color normalization
  - Unknown fields preserved in `extra`
