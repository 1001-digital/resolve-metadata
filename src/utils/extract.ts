import { isString } from './is'

export function extractString(obj: Record<string, unknown>, key: string): string | null {
  const val = obj[key]
  return isString(val) && val ? val : null
}

export function extractStringWithAlias(
  obj: Record<string, unknown>,
  key: string,
  ...aliases: string[]
): string | null {
  for (const candidate of [key, ...aliases]) {
    const value = extractString(obj, candidate)
    if (value) return value
  }

  return null
}
