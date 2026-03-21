import { resolveTokenMetadata } from '../../src/resolve/token-metadata'

describe('resolveTokenMetadata', () => {
  describe('non-object input', () => {
    it('returns empty metadata for null', () => {
      const result = resolveTokenMetadata(null)
      expect(result.name).toBeNull()
      expect(result.attributes).toEqual([])
      expect(result.extra).toEqual({})
    })

    it('returns empty metadata for string', () => {
      const result = resolveTokenMetadata('not an object')
      expect(result.name).toBeNull()
    })

    it('returns empty metadata for number', () => {
      const result = resolveTokenMetadata(42)
      expect(result.name).toBeNull()
    })

    it('returns empty metadata for array', () => {
      const result = resolveTokenMetadata([1, 2, 3])
      expect(result.name).toBeNull()
    })
  })

  describe('basic field extraction', () => {
    it('extracts name and description', () => {
      const result = resolveTokenMetadata({
        name: 'Cool NFT',
        description: 'A very cool NFT',
      })
      expect(result.name).toBe('Cool NFT')
      expect(result.description).toBe('A very cool NFT')
    })

    it('returns null for missing fields', () => {
      const result = resolveTokenMetadata({})
      expect(result.name).toBeNull()
      expect(result.description).toBeNull()
      expect(result.image).toBeNull()
      expect(result.animation_url).toBeNull()
      expect(result.external_url).toBeNull()
      expect(result.background_color).toBeNull()
      expect(result.decimals).toBeNull()
      expect(result.properties).toBeNull()
      expect(result.localization).toBeNull()
    })

    it('returns null for non-string name', () => {
      const result = resolveTokenMetadata({ name: 42 })
      expect(result.name).toBeNull()
    })

    it('returns null for empty string name', () => {
      const result = resolveTokenMetadata({ name: '' })
      expect(result.name).toBeNull()
    })
  })

  describe('URI normalization', () => {
    it('normalizes IPFS gateway image URL', () => {
      const result = resolveTokenMetadata({
        image: 'https://gateway.pinata.cloud/ipfs/QmXxx',
      })
      expect(result.image).toBe('ipfs://QmXxx')
    })

    it('normalizes animation_url', () => {
      const result = resolveTokenMetadata({
        animation_url: 'https://ipfs.io/ipfs/QmVideo',
      })
      expect(result.animation_url).toBe('ipfs://QmVideo')
    })

    it('normalizes external_url', () => {
      const result = resolveTokenMetadata({
        external_url: 'https://arweave.net/txId',
      })
      expect(result.external_url).toBe('ar://txId')
    })

    it('passes through protocol URIs', () => {
      const result = resolveTokenMetadata({
        image: 'ipfs://QmXxx',
        animation_url: 'ar://txId',
      })
      expect(result.image).toBe('ipfs://QmXxx')
      expect(result.animation_url).toBe('ar://txId')
    })
  })

  describe('alias handling', () => {
    it('maps image_url to image', () => {
      const result = resolveTokenMetadata({
        image_url: 'ipfs://QmXxx',
      })
      expect(result.image).toBe('ipfs://QmXxx')
    })

    it('maps animation to animation_url', () => {
      const result = resolveTokenMetadata({
        animation: 'ipfs://QmVideo',
      })
      expect(result.animation_url).toBe('ipfs://QmVideo')
    })

    it('maps external_link to external_url', () => {
      const result = resolveTokenMetadata({
        external_link: 'https://example.com',
      })
      expect(result.external_url).toBe('https://example.com')
    })

    it('prefers canonical field over alias', () => {
      const result = resolveTokenMetadata({
        image: 'ipfs://canonical',
        image_url: 'ipfs://alias',
      })
      expect(result.image).toBe('ipfs://canonical')
    })
  })

  describe('attributes normalization', () => {
    it('normalizes standard attributes', () => {
      const result = resolveTokenMetadata({
        attributes: [{ trait_type: 'Color', value: 'Blue' }],
      })
      expect(result.attributes).toEqual([{ trait_type: 'Color', value: 'Blue' }])
    })

    it('returns empty array when attributes missing', () => {
      const result = resolveTokenMetadata({})
      expect(result.attributes).toEqual([])
    })
  })

  describe('background_color normalization', () => {
    it('normalizes hex color', () => {
      const result = resolveTokenMetadata({ background_color: '#FF0000' })
      expect(result.background_color).toBe('ff0000')
    })

    it('normalizes without #', () => {
      const result = resolveTokenMetadata({ background_color: 'FF0000' })
      expect(result.background_color).toBe('ff0000')
    })
  })

  describe('ERC-1155 fields', () => {
    it('extracts decimals', () => {
      const result = resolveTokenMetadata({ decimals: 18 })
      expect(result.decimals).toBe(18)
    })

    it('returns null for non-number decimals', () => {
      const result = resolveTokenMetadata({ decimals: '18' })
      expect(result.decimals).toBeNull()
    })

    it('extracts properties object', () => {
      const props = { creator: 'Alice', rarity: 'legendary' }
      const result = resolveTokenMetadata({ properties: props })
      expect(result.properties).toEqual(props)
    })

    it('returns null for non-object properties', () => {
      const result = resolveTokenMetadata({ properties: 'not an object' })
      expect(result.properties).toBeNull()
    })

    it('extracts localization', () => {
      const loc = {
        uri: 'https://ipfs.io/ipfs/QmLocale/{locale}.json',
        default: 'en',
        locales: ['en', 'es', 'fr'],
      }
      const result = resolveTokenMetadata({ localization: loc })
      expect(result.localization).toEqual({
        uri: 'ipfs://QmLocale/{locale}.json',
        default: 'en',
        locales: ['en', 'es', 'fr'],
      })
    })

    it('returns null for invalid localization', () => {
      const result = resolveTokenMetadata({ localization: { uri: 'test' } })
      expect(result.localization).toBeNull()
    })
  })

  describe('extra fields', () => {
    it('collects unknown fields into extra', () => {
      const result = resolveTokenMetadata({
        name: 'NFT',
        compiler: 'art-engine',
        collection_name: 'Cool Collection',
      })
      expect(result.extra).toEqual({
        compiler: 'art-engine',
        collection_name: 'Cool Collection',
      })
    })

    it('returns empty extra when no unknown fields', () => {
      const result = resolveTokenMetadata({ name: 'NFT' })
      expect(result.extra).toEqual({})
    })
  })

  describe('complete metadata', () => {
    it('resolves a full ERC-721 metadata object', () => {
      const input = {
        name: 'Bored Ape #1234',
        description: 'A unique ape',
        image: 'https://ipfs.io/ipfs/QmImage',
        animation_url: 'https://arweave.net/txVideo',
        external_url: 'https://boredapes.com/1234',
        background_color: '#1a2b3c',
        attributes: [
          { trait_type: 'Fur', value: 'Gold' },
          { trait_type: 'Level', value: '7' },
        ],
      }

      const result = resolveTokenMetadata(input)

      expect(result).toEqual({
        name: 'Bored Ape #1234',
        description: 'A unique ape',
        image: 'ipfs://QmImage',
        animation_url: 'ar://txVideo',
        external_url: 'https://boredapes.com/1234',
        background_color: '1a2b3c',
        attributes: [
          { trait_type: 'Fur', value: 'Gold' },
          { trait_type: 'Level', value: 7 },
        ],
        decimals: null,
        properties: null,
        localization: null,
        extra: {},
      })
    })
  })
})
