import type { ContractMetadata } from '../types'
import { isArray, isObject, isString } from '../utils/is'
import { extractString, extractStringWithAlias } from '../utils/extract'
import { normalizeUri } from '@1001-digital/normalize-dweb-url'

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

function normalizeUriField(obj: Record<string, unknown>, key: string): string | null {
  const val = extractString(obj, key)
  return val ? normalizeUri(val) : null
}

export function resolveContractMetadata(input: unknown): ContractMetadata {
  if (!isObject(input)) {
    return {
      name: null,
      description: null,
      image: null,
      banner_image: null,
      featured_image: null,
      external_link: null,
      collaborators: [],
      extra: {},
    }
  }

  const collaborators = isArray(input.collaborators)
    ? (input.collaborators.filter(isString) as string[])
    : []

  const extra: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(input)) {
    if (!KNOWN_KEYS.has(key)) {
      extra[key] = val
    }
  }

  return {
    name: extractString(input, 'name'),
    description: extractString(input, 'description'),
    image: normalizeUriField(input, 'image'),
    banner_image: normalizeUriField(input, 'banner_image'),
    featured_image: normalizeUriField(input, 'featured_image'),
    external_link: extractStringWithAlias(input, 'external_link', 'external_url'),
    collaborators,
    extra,
  }
}
