import { normalizeUri } from '../../src/normalize/uri'

describe('normalizeUri', () => {
  describe('empty / falsy input', () => {
    it('returns empty string for empty string', () => {
      expect(normalizeUri('')).toBe('')
    })

    it('returns empty string for whitespace-only string', () => {
      expect(normalizeUri('   ')).toBe('')
    })
  })

  describe('protocol URI passthrough', () => {
    it('passes through ipfs:// URIs', () => {
      expect(normalizeUri('ipfs://QmXxx')).toBe('ipfs://QmXxx')
    })

    it('passes through ipns:// URIs', () => {
      expect(normalizeUri('ipns://example.eth')).toBe('ipns://example.eth')
    })

    it('passes through ar:// URIs', () => {
      expect(normalizeUri('ar://txId123')).toBe('ar://txId123')
    })

    it('passes through data: URIs', () => {
      const dataUri = 'data:application/json;base64,eyJuYW1lIjoiVGVzdCJ9'
      expect(normalizeUri(dataUri)).toBe(dataUri)
    })

    it('passes through ipfs:// with path', () => {
      expect(normalizeUri('ipfs://QmXxx/image.png')).toBe('ipfs://QmXxx/image.png')
    })

    it('passes through ipfs:// with {id} template', () => {
      expect(normalizeUri('ipfs://QmXxx/{id}.json')).toBe('ipfs://QmXxx/{id}.json')
    })
  })

  describe('IPFS path-based gateways', () => {
    it('normalizes gateway.pinata.cloud', () => {
      expect(normalizeUri('https://gateway.pinata.cloud/ipfs/QmXxx')).toBe('ipfs://QmXxx')
    })

    it('normalizes ipfs.io', () => {
      expect(normalizeUri('https://ipfs.io/ipfs/QmXxx')).toBe('ipfs://QmXxx')
    })

    it('normalizes cloudflare-ipfs.com', () => {
      expect(normalizeUri('https://cloudflare-ipfs.com/ipfs/QmXxx')).toBe('ipfs://QmXxx')
    })

    it('preserves path after CID', () => {
      expect(normalizeUri('https://ipfs.io/ipfs/QmXxx/image.png')).toBe('ipfs://QmXxx/image.png')
    })

    it('handles http:// gateways', () => {
      expect(normalizeUri('http://localhost:8080/ipfs/QmXxx')).toBe('ipfs://QmXxx')
    })
  })

  describe('IPFS subdomain gateways', () => {
    it('normalizes nftstorage.link subdomain', () => {
      expect(normalizeUri('https://bafyABC.ipfs.nftstorage.link')).toBe('ipfs://bafyABC')
    })

    it('normalizes w3s.link subdomain', () => {
      expect(normalizeUri('https://bafyABC.ipfs.w3s.link')).toBe('ipfs://bafyABC')
    })

    it('normalizes dweb.link subdomain', () => {
      expect(normalizeUri('https://bafyABC.ipfs.dweb.link')).toBe('ipfs://bafyABC')
    })

    it('preserves path on subdomain gateway', () => {
      expect(normalizeUri('https://bafyABC.ipfs.nftstorage.link/metadata.json')).toBe(
        'ipfs://bafyABC/metadata.json',
      )
    })
  })

  describe('IPNS gateway normalization', () => {
    it('normalizes IPNS path-based gateway', () => {
      expect(normalizeUri('https://ipfs.io/ipns/example.eth')).toBe('ipns://example.eth')
    })

    it('normalizes IPNS subdomain gateway', () => {
      expect(normalizeUri('https://example-eth.ipns.dweb.link')).toBe('ipns://example-eth')
    })

    it('preserves path after IPNS name', () => {
      expect(normalizeUri('https://ipfs.io/ipns/example.eth/metadata.json')).toBe(
        'ipns://example.eth/metadata.json',
      )
    })
  })

  describe('Arweave gateways', () => {
    it('normalizes arweave.net', () => {
      expect(normalizeUri('https://arweave.net/txId123')).toBe('ar://txId123')
    })

    it('normalizes ar-io.dev', () => {
      expect(normalizeUri('https://ar-io.dev/txId123')).toBe('ar://txId123')
    })

    it('normalizes ar-io.net', () => {
      expect(normalizeUri('https://ar-io.net/txId123')).toBe('ar://txId123')
    })

    it('normalizes arweave.dev', () => {
      expect(normalizeUri('https://arweave.dev/txId123')).toBe('ar://txId123')
    })

    it('preserves path after tx id', () => {
      expect(normalizeUri('https://arweave.net/txId123/data.json')).toBe(
        'ar://txId123/data.json',
      )
    })

    it('does not match arweave.net root (no tx id)', () => {
      expect(normalizeUri('https://arweave.net/')).toBe('https://arweave.net/')
    })
  })

  describe('raw CID detection', () => {
    it('prefixes CIDv0 (Qm...) with ipfs://', () => {
      const cid = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
      expect(normalizeUri(cid)).toBe(`ipfs://${cid}`)
    })

    it('prefixes CIDv1 (bafy...) with ipfs://', () => {
      const cid = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3okuber3rmntpre'
      expect(normalizeUri(cid)).toBe(`ipfs://${cid}`)
    })

    it('does not prefix random strings', () => {
      expect(normalizeUri('hello-world')).toBe('hello-world')
    })
  })

  describe('non-gateway HTTP URLs', () => {
    it('passes through regular https URLs', () => {
      expect(normalizeUri('https://example.com/image.png')).toBe('https://example.com/image.png')
    })

    it('passes through regular http URLs', () => {
      expect(normalizeUri('http://example.com/data.json')).toBe('http://example.com/data.json')
    })
  })

  describe('whitespace trimming', () => {
    it('trims leading and trailing whitespace', () => {
      expect(normalizeUri('  ipfs://QmXxx  ')).toBe('ipfs://QmXxx')
    })

    it('trims before gateway detection', () => {
      expect(normalizeUri('  https://ipfs.io/ipfs/QmXxx  ')).toBe('ipfs://QmXxx')
    })
  })
})
