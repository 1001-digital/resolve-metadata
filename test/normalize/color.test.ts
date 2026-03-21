import { normalizeColor } from '../../src/normalize/color'

describe('normalizeColor', () => {
  it('returns null for null', () => {
    expect(normalizeColor(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(normalizeColor(undefined)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(normalizeColor('')).toBeNull()
  })

  it('returns null for non-string input', () => {
    expect(normalizeColor(42)).toBeNull()
  })

  it('normalizes 6-char hex without #', () => {
    expect(normalizeColor('FF0000')).toBe('ff0000')
  })

  it('strips # prefix and normalizes', () => {
    expect(normalizeColor('#FF0000')).toBe('ff0000')
  })

  it('lowercases hex values', () => {
    expect(normalizeColor('AbCdEf')).toBe('abcdef')
  })

  it('expands 3-char hex to 6-char', () => {
    expect(normalizeColor('F00')).toBe('ff0000')
  })

  it('expands 3-char hex with # prefix', () => {
    expect(normalizeColor('#abc')).toBe('aabbcc')
  })

  it('returns null for invalid hex', () => {
    expect(normalizeColor('ZZZZZZ')).toBeNull()
  })

  it('returns null for wrong length', () => {
    expect(normalizeColor('FF00')).toBeNull()
  })

  it('returns null for non-hex string', () => {
    expect(normalizeColor('red')).toBeNull()
  })
})
