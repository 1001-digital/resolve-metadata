# @1001-digital/resolve-metadata

Normalize NFT metadata JSON (ERC-721, ERC-1155, contractURI) into a strict, typed schema. Pairs with [`@1001-digital/dweb-fetch`](https://github.com/1001-digital/dweb-fetch) — this package standardizes the JSON, dweb-fetch resolves the links.

## Usage

```ts
import { resolveTokenMetadata, resolveContractMetadata } from '@1001-digital/resolve-metadata'

// Raw metadata from a tokenURI / uri response
const raw = {
  name: 'Cool NFT #42',
  description: 'A very cool NFT',
  image: 'https://gateway.pinata.cloud/ipfs/QmImage...',
  animation_url: 'https://arweave.net/txVideo...',
  background_color: '#FF0000',
  attributes: [
    { trait_type: 'Color', value: 'Blue' },
    { trait_type: 'Level', value: '7' },
  ],
}

const metadata = resolveTokenMetadata(raw)
// {
//   name: 'Cool NFT #42',
//   description: 'A very cool NFT',
//   image: 'ipfs://QmImage...',            ← gateway URL → protocol URI
//   animation_url: 'ar://txVideo...',       ← gateway URL → protocol URI
//   external_url: null,
//   background_color: 'ff0000',             ← normalized hex, no #
//   attributes: [
//     { trait_type: 'Color', value: 'Blue' },
//     { trait_type: 'Level', value: 7 },    ← numeric string → number
//   ],
//   decimals: null,
//   properties: null,
//   localization: null,
//   extra: {},
// }

// Contract-level metadata from contractURI
const contract = resolveContractMetadata({
  name: 'Cool Collection',
  description: 'A collection of cool NFTs',
  image: 'https://ipfs.io/ipfs/QmLogo...',
  banner_image: 'https://arweave.net/txBanner...',
  external_link: 'https://coolcollection.xyz',
  collaborators: ['0xABC...', '0xDEF...'],
  seller_fee_basis_points: 250,
})
// {
//   name: 'Cool Collection',
//   description: 'A collection of cool NFTs',
//   image: 'ipfs://QmLogo...',
//   banner_image: 'ar://txBanner...',
//   featured_image: null,
//   external_link: 'https://coolcollection.xyz',
//   collaborators: ['0xABC...', '0xDEF...'],
//   extra: { seller_fee_basis_points: 250 },
// }
```

## URI Normalization

Gateway URLs are converted to protocol URIs. Links are not resolved — use `dweb-fetch` for that.

```ts
import { normalizeUri } from '@1001-digital/resolve-metadata'

normalizeUri('https://gateway.pinata.cloud/ipfs/QmXxx')  // → 'ipfs://QmXxx'
normalizeUri('https://bafyABC.ipfs.nftstorage.link')     // → 'ipfs://bafyABC'
normalizeUri('https://ipfs.io/ipns/example.eth')          // → 'ipns://example.eth'
normalizeUri('https://arweave.net/txId123')               // → 'ar://txId123'
normalizeUri('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz...')  // → 'ipfs://QmYwAPJzv5...'
normalizeUri('ipfs://QmXxx')                              // → 'ipfs://QmXxx' (passthrough)
normalizeUri('https://example.com/image.png')             // → 'https://example.com/image.png' (passthrough)
```

IPFS gateways are detected by path (`/ipfs/`, `/ipns/`) and subdomain (`.ipfs.`, `.ipns.`) patterns, so any gateway works without a hardcoded list. Arweave gateways are matched by known hostnames (`arweave.net`, `ar-io.dev`, `ar-io.net`, `arweave.dev`).

## What Gets Normalized

### Token Metadata (ERC-721 + ERC-1155)

| What | How |
|---|---|
| URI fields (`image`, `animation_url`, `external_url`) | Gateway URLs → protocol URIs |
| `background_color` | Strips `#`, expands 3-char to 6-char, lowercases |
| Attributes `[{ trait_type, value }]` | Unified from multiple formats (see below) |
| Numeric string attribute values (`"42"`) | Coerced to numbers |
| Field aliases (`image_url`, `animation`, `external_link`) | Mapped to canonical names |
| ERC-1155 fields (`decimals`, `properties`, `localization`) | Extracted when present |
| Unknown fields | Preserved in `extra` |

### Contract Metadata (ERC-7572 / contractURI)

| What | How |
|---|---|
| URI fields (`image`, `banner_image`, `featured_image`) | Gateway URLs → protocol URIs |
| `collaborators` | Validated as string array |
| Field alias (`external_url`) | Mapped to `external_link` |
| Unknown fields | Preserved in `extra` |

### Attribute Format Handling

All of these are normalized to `{ trait_type: string, value: string | number }`:

```ts
// Standard (ERC-721)
[{ trait_type: 'Color', value: 'Blue' }]

// With display hints
[{ trait_type: 'Level', value: 5, display_type: 'number', max_value: 10 }]

// Rarible-style (name instead of trait_type)
[{ name: 'Color', value: 'Blue' }]

// Plain object
{ Color: 'Blue', Rarity: 'Legendary' }
```

## API

### `resolveTokenMetadata(input: unknown): TokenMetadata`

Normalizes raw token metadata JSON. Accepts any value — returns typed output with `null` for missing fields, empty arrays for missing collections, and unknown fields in `extra`.

### `resolveContractMetadata(input: unknown): ContractMetadata`

Normalizes raw contract/collection metadata JSON. Same guarantees as above.

### `normalizeUri(uri: string): string`

Converts gateway URLs to protocol URIs. Returns the input unchanged if it is not a recognized gateway URL.

## License

MIT
