# @1001-digital/resolve-metadata

## 1.0.0

### Major Changes

- [`60b0290`](https://github.com/1001-digital/resolve-metadata/commit/60b0290653691309dfaffaafecd9cf957701da6b) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add token and contract metadata resolvers with URI normalization.
  - `resolveTokenMetadata()` normalizes ERC-721/ERC-1155 token metadata (name, description, image, attributes, etc.)
  - `resolveContractMetadata()` normalizes ERC-7572 contract metadata (name, description, image, banner, collaborators, etc.)
  - `normalizeUri()` converts IPFS/IPNS gateway URLs and Arweave gateway URLs to protocol URIs
  - Handles common edge cases: field aliases (`image_url` → `image`), attribute format variations, numeric string coercion, hex color normalization
  - Unknown fields preserved in `extra`
