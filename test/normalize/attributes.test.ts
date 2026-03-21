import { normalizeAttributes } from '../../src/normalize/attributes'

describe('normalizeAttributes', () => {
  describe('null / undefined / invalid input', () => {
    it('returns empty array for null', () => {
      expect(normalizeAttributes(null)).toEqual([])
    })

    it('returns empty array for undefined', () => {
      expect(normalizeAttributes(undefined)).toEqual([])
    })

    it('returns empty array for a number', () => {
      expect(normalizeAttributes(42)).toEqual([])
    })

    it('returns empty array for a string', () => {
      expect(normalizeAttributes('not attributes')).toEqual([])
    })
  })

  describe('standard format: [{ trait_type, value }]', () => {
    it('passes through standard attributes', () => {
      const input = [
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Level', value: 5 },
      ]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Level', value: 5 },
      ])
    })

    it('preserves display_type', () => {
      const input = [{ trait_type: 'Power', value: 42, display_type: 'boost_number' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Power', value: 42, display_type: 'boost_number' },
      ])
    })

    it('preserves max_value', () => {
      const input = [{ trait_type: 'Level', value: 5, max_value: 10 }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Level', value: 5, max_value: 10 },
      ])
    })

    it('preserves display_type and max_value together', () => {
      const input = [{ trait_type: 'Speed', value: 80, display_type: 'number', max_value: 100 }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Speed', value: 80, display_type: 'number', max_value: 100 },
      ])
    })
  })

  describe('Rarible-style: [{ name, value }]', () => {
    it('renames name to trait_type', () => {
      const input = [{ name: 'Color', value: 'Red' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Red' },
      ])
    })

    it('prefers trait_type over name when both present', () => {
      const input = [{ trait_type: 'Color', name: 'Colour', value: 'Red' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Red' },
      ])
    })
  })

  describe('plain object: { key: value }', () => {
    it('expands object entries to attributes', () => {
      const input = { Color: 'Blue', Rarity: 'Legendary' }
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Rarity', value: 'Legendary' },
      ])
    })

    it('coerces numeric string values', () => {
      const input = { Level: '5' }
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Level', value: 5 },
      ])
    })

    it('skips null values', () => {
      const input = { Color: 'Blue', Empty: null }
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
      ])
    })
  })

  describe('numeric string coercion', () => {
    it('coerces integer strings to numbers', () => {
      const input = [{ trait_type: 'Level', value: '5' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Level', value: 5 },
      ])
    })

    it('coerces decimal strings to numbers', () => {
      const input = [{ trait_type: 'Weight', value: '3.14' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Weight', value: 3.14 },
      ])
    })

    it('coerces negative numeric strings', () => {
      const input = [{ trait_type: 'Temperature', value: '-10' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Temperature', value: -10 },
      ])
    })

    it('does not coerce non-numeric strings', () => {
      const input = [{ trait_type: 'Name', value: 'Alice' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Name', value: 'Alice' },
      ])
    })

    it('does not coerce strings with extra characters', () => {
      const input = [{ trait_type: 'Code', value: '42abc' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Code', value: '42abc' },
      ])
    })
  })

  describe('edge cases', () => {
    it('returns empty array for empty array', () => {
      expect(normalizeAttributes([])).toEqual([])
    })

    it('filters out null entries in array', () => {
      const input = [
        { trait_type: 'Color', value: 'Blue' },
        null,
        { trait_type: 'Level', value: 5 },
      ]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Level', value: 5 },
      ])
    })

    it('filters out undefined entries in array', () => {
      const input = [undefined, { trait_type: 'Color', value: 'Blue' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
      ])
    })

    it('handles primitive array elements', () => {
      const input = ['fire', 'water', 42]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'property', value: 'fire' },
        { trait_type: 'property', value: 'water' },
        { trait_type: 'property', value: 42 },
      ])
    })

    it('skips entries with missing value', () => {
      const input = [{ trait_type: 'Color' }]
      expect(normalizeAttributes(input)).toEqual([])
    })

    it('skips entries with missing trait_type and name', () => {
      const input = [{ value: 'Blue' }]
      expect(normalizeAttributes(input)).toEqual([])
    })

    it('ignores empty display_type string', () => {
      const input = [{ trait_type: 'Color', value: 'Blue', display_type: '' }]
      expect(normalizeAttributes(input)).toEqual([
        { trait_type: 'Color', value: 'Blue' },
      ])
    })
  })
})
