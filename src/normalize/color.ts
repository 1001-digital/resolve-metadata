import { isString } from '../utils/is'

const HEX_3_RE = /^[0-9a-fA-F]{3}$/
const HEX_6_RE = /^[0-9a-fA-F]{6}$/

export function normalizeColor(input: unknown): string | null {
  if (!isString(input) || !input) return null

  const stripped = input.startsWith('#') ? input.slice(1) : input

  if (HEX_6_RE.test(stripped)) {
    return stripped.toLowerCase()
  }

  if (HEX_3_RE.test(stripped)) {
    const expanded = stripped[0] + stripped[0] + stripped[1] + stripped[1] + stripped[2] + stripped[2]
    return expanded.toLowerCase()
  }

  return null
}
