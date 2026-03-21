import type { ContractMetadata } from '../types'
import { isArray, isObject, isString } from '../utils/is'
import { normalizeUri } from '../normalize/uri'

const URI_FIELDS = ['image', 'banner_image', 'featured_image'] as const

const ALIASES: Record<string, string> = {
  external_url: 'external_link',
}

const KNOWN_KEYS = new Set([
  'name',
  'description',
  'image',
  'banner_image',
  'featured_image',
  'external_link',
  'external_url',
  'collaborators',
])

function extractString(obj: Record<string, unknown>, key: string): string | null {
  const val = obj[key]
  return isString(val) && val ? val : null
}

function applyAliases(obj: Record<string, unknown>): Record<string, unknown> {
  const result = { ...obj }

  for (const [alias, canonical] of Object.entries(ALIASES)) {
    if (result[alias] != null && result[canonical] == null) {
      result[canonical] = result[alias]
    }
  }

  return result
}

export function resolveContractMetadata(input: unknown): ContractMetadata {
  const empty: ContractMetadata = {
    name: null,
    description: null,
    image: null,
    banner_image: null,
    featured_image: null,
    external_link: null,
    collaborators: [],
    extra: {},
  }

  if (!isObject(input)) return empty

  const obj = applyAliases(input)

  const collaborators = isArray(obj.collaborators)
    ? (obj.collaborators.filter(isString) as string[])
    : []

  const result: ContractMetadata = {
    name: extractString(obj, 'name'),
    description: extractString(obj, 'description'),
    image: null,
    banner_image: null,
    featured_image: null,
    external_link: extractString(obj, 'external_link'),
    collaborators,
    extra: {},
  }

  // Normalize URI fields
  for (const field of URI_FIELDS) {
    const val = extractString(obj, field)
    result[field] = val ? normalizeUri(val) : null
  }

  // Collect extra fields
  for (const [key, val] of Object.entries(obj)) {
    if (!KNOWN_KEYS.has(key)) {
      result.extra[key] = val
    }
  }

  return result
}
