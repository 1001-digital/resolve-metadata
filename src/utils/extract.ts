import { isString } from './is'

export function extractString(obj: Record<string, unknown>, key: string): string | null {
  const val = obj[key]
  return isString(val) && val ? val : null
}

export function extractStringWithAlias(
  obj: Record<string, unknown>,
  key: string,
  alias?: string,
): string | null {
  return extractString(obj, key) ?? (alias ? extractString(obj, alias) : null)
}
