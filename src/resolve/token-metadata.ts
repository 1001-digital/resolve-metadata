import type { TokenMetadata, TokenMetadataLocalization } from '../types'
import { isArray, isNumber, isObject, isString } from '../utils/is'
import { extractString, extractStringWithAlias } from '../utils/extract'
import { normalizeUri } from '@1001-digital/normalize-dweb-url'
import { normalizeAttributes } from '../normalize/attributes'
import { normalizeColor } from '../normalize/color'

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

function normalizeUriField(obj: Record<string, unknown>, key: string, alias?: string): string | null {
  const val = extractStringWithAlias(obj, key, alias)
  return val ? normalizeUri(val) : null
}

export function resolveTokenMetadata(input: unknown): TokenMetadata {
  if (!isObject(input)) {
    return {
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
  }

  const extra: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(input)) {
    if (!KNOWN_KEYS.has(key)) {
      extra[key] = val
    }
  }

  return {
    name: extractString(input, 'name'),
    description: extractString(input, 'description'),
    image: normalizeUriField(input, 'image', 'image_url'),
    animation_url: normalizeUriField(input, 'animation_url', 'animation'),
    external_url: normalizeUriField(input, 'external_url', 'external_link'),
    background_color: normalizeColor(input.background_color),
    attributes: normalizeAttributes(input.attributes),
    decimals: isNumber(input.decimals) ? input.decimals : null,
    properties: isObject(input.properties) ? input.properties : null,
    localization: resolveLocalization(input.localization),
    extra,
  }
}
