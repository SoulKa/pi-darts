import { describe, expect, it } from 'vitest'
import { dartLabel, suggestCheckouts } from '../checkout'

describe('dartLabel', () => {
  it('prefixes trebles and doubles, leaves singles bare', () => {
    expect(dartLabel(20, 3)).toBe('T20')
    expect(dartLabel(16, 2)).toBe('D16')
    expect(dartLabel(5, 1)).toBe('5')
  })

  it('names the bull specially: single 25 vs double 50', () => {
    expect(dartLabel(25, 1)).toBe('25')
    expect(dartLabel(25, 2)).toBe('Bull')
  })
})

describe('suggestCheckouts guards', () => {
  it('returns nothing with no darts left', () => {
    expect(suggestCheckouts(40, 0, 'double')).toEqual([])
  })

  it('returns nothing when the score exceeds what the darts can reach (60 per dart)', () => {
    expect(suggestCheckouts(181, 3, 'single')).toEqual([]) // 3 × T20 = 180 max
    expect(suggestCheckouts(180, 3, 'single')).not.toEqual([])
  })

  it('needs at least 2 to finish on a double (1 is not checkoutable)', () => {
    expect(suggestCheckouts(1, 3, 'double')).toEqual([])
    expect(suggestCheckouts(1, 3, 'single')).not.toEqual([]) // single-out can take 1
  })
})

describe('suggestCheckouts single-out', () => {
  it('finishes on the biggest available dart', () => {
    const routes = suggestCheckouts(60, 1, 'single')
    expect(routes).toHaveLength(1)
    expect(routes[0]!.label).toBe('T20')
  })

  it('takes any finishing dart, not only doubles', () => {
    const routes = suggestCheckouts(17, 1, 'single')
    expect(routes[0]!.label).toBe('17')
  })
})

describe('suggestCheckouts double-out', () => {
  it('finishes a two-dart-equivalent score on a single double', () => {
    const routes = suggestCheckouts(40, 3, 'double')
    expect(routes[0]!.darts).toHaveLength(1)
    expect(routes[0]!.label).toBe('D20')
  })

  it('solves the classic 170 checkout as the top route', () => {
    const routes = suggestCheckouts(170, 3, 'double')
    expect(routes[0]!.label).toBe('T20 T20 Bull')
  })

  it('always ends every suggested route on a double', () => {
    const routes = suggestCheckouts(100, 3, 'double')
    expect(routes.length).toBeGreaterThan(0)
    for (const route of routes) {
      expect(route.darts.at(-1)!.multiplier).toBe(2)
    }
  })
})

describe('suggestCheckouts ranking & limits', () => {
  it('orders routes fewest-darts-first', () => {
    const lengths = suggestCheckouts(60, 3, 'single').map((r) => r.darts.length)
    expect(lengths).toEqual([...lengths].sort((a, b) => a - b))
  })

  it('caps the number of routes at maxRoutes', () => {
    expect(suggestCheckouts(100, 3, 'single').length).toBeLessThanOrEqual(3)
    expect(suggestCheckouts(100, 3, 'single', 1)).toHaveLength(1)
  })

  it('does not return duplicate routes', () => {
    const labels = suggestCheckouts(100, 3, 'double').map((r) => r.label)
    expect(new Set(labels).size).toBe(labels.length)
  })
})
