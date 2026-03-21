import type { TokenMetadata, TokenMetadataLocalization } from '../types'
import { isArray, isNumber, isObject, isString } from '../utils/is'
import { normalizeUri } from '../normalize/uri'
import { normalizeAttributes } from '../normalize/attributes'
import { normalizeColor } from '../normalize/color'

const URI_FIELDS = ['image', 'animation_url', 'external_url'] as const

const ALIASES: Record<string, string> = {
  image_url: 'image',
  animation: 'animation_url',
  external_link: 'external_url',
}

const KNOWN_KEYS = new Set([
  'name',
  'description',
  'image',
  'image_url',
  'animation_url',
  'animation',
  'external_url',
  'external_link',
  'background_color',
  'attributes',
  'decimals',
  'properties',
  'localization',
])

function extractString(obj: Record<string, unknown>, key: string): string | null {
  const val = obj[key]
  return isString(val) && val ? val : null
}

function resolveLocalization(
  input: unknown,
): TokenMetadataLocalization | null {
  if (!isObject(input)) return null

  const uri = isString(input.uri) ? input.uri : null
  const def = isString(input.default) ? input.default : null
  const locales = isArray(input.locales)
    ? (input.locales.filter(isString) as string[])
    : null

  if (!uri || !def || !locales) return null

  return {
    uri: normalizeUri(uri),
    default: def,
    locales,
  }
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

export function resolveTokenMetadata(input: unknown): TokenMetadata {
  const empty: TokenMetadata = {
    name: null,
    description: null,
    image: null,
    animation_url: null,
    external_url: null,
    background_color: null,
    attributes: [],
    decimals: null,
    properties: null,
    localization: null,
    extra: {},
  }

  if (!isObject(input)) return empty

  const obj = applyAliases(input)

  const result: TokenMetadata = {
    name: extractString(obj, 'name'),
    description: extractString(obj, 'description'),
    image: null,
    animation_url: null,
    external_url: null,
    background_color: normalizeColor(obj.background_color),
    attributes: normalizeAttributes(obj.attributes),
    decimals: isNumber(obj.decimals) ? obj.decimals : null,
    properties: isObject(obj.properties) ? obj.properties : null,
    localization: resolveLocalization(obj.localization),
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
