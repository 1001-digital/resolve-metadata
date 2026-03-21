import type { TokenAttribute } from '../types'
import { isArray, isNumber, isObject, isString } from '../utils/is'

const NUMERIC_RE = /^-?\d+(\.\d+)?$/

function coerceValue(value: unknown): string | number {
  if (isNumber(value)) return value
  if (isString(value)) return NUMERIC_RE.test(value) ? Number(value) : value
  return String(value)
}

function normalizeEntry(entry: Record<string, unknown>): TokenAttribute | null {
  const traitType = entry.trait_type ?? entry.name
  const value = entry.value

  if (traitType == null || value == null) return null

  const attr: TokenAttribute = {
    trait_type: String(traitType),
    value: coerceValue(value),
  }

  if (isString(entry.display_type) && entry.display_type) {
    attr.display_type = entry.display_type
  }

  if (isNumber(entry.max_value)) {
    attr.max_value = entry.max_value
  }

  return attr
}

export function normalizeAttributes(input: unknown): TokenAttribute[] {
  if (input == null) return []

  // Array of attribute objects or primitives
  if (isArray(input)) {
    const result: TokenAttribute[] = []

    for (const item of input) {
      if (item == null) continue

      if (isObject(item)) {
        const attr = normalizeEntry(item)
        if (attr) result.push(attr)
      } else if (isString(item) || isNumber(item)) {
        result.push({ trait_type: 'property', value: item })
      }
    }

    return result
  }

  // Plain object: { key: value } → [{ trait_type: key, value }]
  if (isObject(input)) {
    const result: TokenAttribute[] = []

    for (const [key, val] of Object.entries(input)) {
      if (val == null) continue
      result.push({
        trait_type: key,
        value: coerceValue(val),
      })
    }

    return result
  }

  return []
}
