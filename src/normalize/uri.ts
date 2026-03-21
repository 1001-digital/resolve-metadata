const IPFS_PATH_RE = /^https?:\/\/[^/]+\/ipfs\/(.+)$/
const IPFS_SUBDOMAIN_RE = /^https?:\/\/([^.]+)\.ipfs\.[^/]+(\/.*)?$/
const IPNS_PATH_RE = /^https?:\/\/[^/]+\/ipns\/(.+)$/
const IPNS_SUBDOMAIN_RE = /^https?:\/\/([^.]+)\.ipns\.[^/]+(\/.*)?$/

const ARWEAVE_GATEWAYS = [
  'arweave.net',
  'ar-io.dev',
  'ar-io.net',
  'arweave.dev',
]

const CID_V0_RE = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
const CID_V1_RE = /^baf[a-z2-7]{56,}$/

export function normalizeUri(uri: string): string {
  if (!uri) return ''

  const trimmed = uri.trim()
  if (!trimmed) return ''

  if (
    trimmed.startsWith('ipfs://') ||
    trimmed.startsWith('ipns://') ||
    trimmed.startsWith('ar://')
  ) {
    return trimmed
  }

  if (trimmed.startsWith('data:')) return trimmed

  // Non-HTTP input can only be a raw CID — skip gateway regex matching
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    if (CID_V0_RE.test(trimmed) || CID_V1_RE.test(trimmed)) {
      return `ipfs://${trimmed}`
    }
    return trimmed
  }

  // IPFS/IPNS gateway patterns (path-based and subdomain)
  const ipfsPathMatch = trimmed.match(IPFS_PATH_RE)
  if (ipfsPathMatch) return `ipfs://${ipfsPathMatch[1]}`

  const ipfsSubMatch = trimmed.match(IPFS_SUBDOMAIN_RE)
  if (ipfsSubMatch) return `ipfs://${ipfsSubMatch[1]}${ipfsSubMatch[2] || ''}`

  const ipnsPathMatch = trimmed.match(IPNS_PATH_RE)
  if (ipnsPathMatch) return `ipns://${ipnsPathMatch[1]}`

  const ipnsSubMatch = trimmed.match(IPNS_SUBDOMAIN_RE)
  if (ipnsSubMatch) return `ipns://${ipnsSubMatch[1]}${ipnsSubMatch[2] || ''}`

  // Arweave gateways
  try {
    const url = new URL(trimmed)
    const isArweave = ARWEAVE_GATEWAYS.some(
      (g) => url.hostname === g || url.hostname.endsWith(`.${g}`),
    )
    if (isArweave) {
      const path = url.pathname.slice(1)
      if (path) return `ar://${path}${url.search}${url.hash}`
    }
  } catch {
    // Not a valid URL
  }

  return trimmed
}
