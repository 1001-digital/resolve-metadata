import { resolveContractMetadata } from '../../src/resolve/contract-metadata'

describe('resolveContractMetadata', () => {
  describe('non-object input', () => {
    it('returns empty metadata for null', () => {
      const result = resolveContractMetadata(null)
      expect(result.name).toBeNull()
      expect(result.collaborators).toEqual([])
      expect(result.extra).toEqual({})
    })

    it('returns empty metadata for string', () => {
      const result = resolveContractMetadata('not an object')
      expect(result.name).toBeNull()
    })

    it('returns empty metadata for array', () => {
      const result = resolveContractMetadata([1, 2])
      expect(result.name).toBeNull()
    })
  })

  describe('basic field extraction', () => {
    it('extracts name and description', () => {
      const result = resolveContractMetadata({
        name: 'Cool Collection',
        description: 'A collection of cool NFTs',
      })
      expect(result.name).toBe('Cool Collection')
      expect(result.description).toBe('A collection of cool NFTs')
    })

    it('returns null for missing fields', () => {
      const result = resolveContractMetadata({})
      expect(result.name).toBeNull()
      expect(result.description).toBeNull()
      expect(result.image).toBeNull()
      expect(result.banner_image).toBeNull()
      expect(result.featured_image).toBeNull()
      expect(result.external_link).toBeNull()
    })
  })

  describe('URI normalization', () => {
    it('normalizes image URI', () => {
      const result = resolveContractMetadata({
        image: 'https://ipfs.io/ipfs/QmLogo',
      })
      expect(result.image).toBe('ipfs://QmLogo')
    })

    it('normalizes banner_image URI', () => {
      const result = resolveContractMetadata({
        banner_image: 'https://arweave.net/txBanner',
      })
      expect(result.banner_image).toBe('ar://txBanner')
    })

    it('normalizes featured_image URI', () => {
      const result = resolveContractMetadata({
        featured_image: 'https://gateway.pinata.cloud/ipfs/QmFeatured',
      })
      expect(result.featured_image).toBe('ipfs://QmFeatured')
    })

    it('does not normalize external_link (not a content URI)', () => {
      const result = resolveContractMetadata({
        external_link: 'https://myproject.com',
      })
      expect(result.external_link).toBe('https://myproject.com')
    })
  })

  describe('alias handling', () => {
    it('maps external_url to external_link', () => {
      const result = resolveContractMetadata({
        external_url: 'https://myproject.com',
      })
      expect(result.external_link).toBe('https://myproject.com')
    })

    it('prefers canonical external_link over alias', () => {
      const result = resolveContractMetadata({
        external_link: 'https://canonical.com',
        external_url: 'https://alias.com',
      })
      expect(result.external_link).toBe('https://canonical.com')
    })
  })

  describe('collaborators', () => {
    it('extracts collaborators array', () => {
      const result = resolveContractMetadata({
        collaborators: ['0xABC', '0xDEF'],
      })
      expect(result.collaborators).toEqual(['0xABC', '0xDEF'])
    })

    it('filters non-string collaborators', () => {
      const result = resolveContractMetadata({
        collaborators: ['0xABC', 42, null, '0xDEF'],
      })
      expect(result.collaborators).toEqual(['0xABC', '0xDEF'])
    })

    it('returns empty array when collaborators missing', () => {
      const result = resolveContractMetadata({})
      expect(result.collaborators).toEqual([])
    })

    it('returns empty array for non-array collaborators', () => {
      const result = resolveContractMetadata({ collaborators: 'not an array' })
      expect(result.collaborators).toEqual([])
    })
  })

  describe('extra fields', () => {
    it('collects unknown fields into extra', () => {
      const result = resolveContractMetadata({
        name: 'Collection',
        seller_fee_basis_points: 250,
        fee_recipient: '0xABC',
      })
      expect(result.extra).toEqual({
        seller_fee_basis_points: 250,
        fee_recipient: '0xABC',
      })
    })
  })

  describe('complete metadata', () => {
    it('resolves a full contract metadata object', () => {
      const input = {
        name: 'Cool Collection',
        description: 'Description here',
        image: 'https://ipfs.io/ipfs/QmLogo',
        banner_image: 'https://arweave.net/txBanner',
        featured_image: 'ipfs://QmFeatured',
        external_link: 'https://coolcollection.xyz',
        collaborators: ['0xABC', '0xDEF'],
      }

      const result = resolveContractMetadata(input)

      expect(result).toEqual({
        name: 'Cool Collection',
        description: 'Description here',
        image: 'ipfs://QmLogo',
        banner_image: 'ar://txBanner',
        featured_image: 'ipfs://QmFeatured',
        external_link: 'https://coolcollection.xyz',
        collaborators: ['0xABC', '0xDEF'],
        extra: {},
      })
    })
  })
})
