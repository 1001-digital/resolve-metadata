# @1001-digital/resolve-metadata

## 1.0.3

### Patch Changes

- [#5](https://github.com/1001-digital/resolve-metadata/pull/5) [`d14c071`](https://github.com/1001-digital/resolve-metadata/commit/d14c0719a6f55003c7bf1561c39e62641e030a8b) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Use token metadata `image_data` as the final fallback for the normalized `image` field.

- [`1761c4d`](https://github.com/1001-digital/resolve-metadata/commit/1761c4df7e0b0c90af05f874bb83a1d5779aec33) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Delegate URI normalization to `@1001-digital/normalize-dweb-url`. `normalizeUri` and `isResolvableUri` are now re-exported from that package, and gain handling for embedded gateway URIs like `ipfs://https://gateway.../ipfs/<cid>`.

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
