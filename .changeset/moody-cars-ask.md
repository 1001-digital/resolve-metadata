---
'@1001-digital/resolve-metadata': major
---

Add token and contract metadata resolvers with URI normalization.

- `resolveTokenMetadata()` normalizes ERC-721/ERC-1155 token metadata (name, description, image, attributes, etc.)
- `resolveContractMetadata()` normalizes ERC-7572 contract metadata (name, description, image, banner, collaborators, etc.)
- `normalizeUri()` converts IPFS/IPNS gateway URLs and Arweave gateway URLs to protocol URIs
- Handles common edge cases: field aliases (`image_url` → `image`), attribute format variations, numeric string coercion, hex color normalization
- Unknown fields preserved in `extra`
