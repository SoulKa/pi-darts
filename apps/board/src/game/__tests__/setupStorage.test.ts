import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadSetup, saveSetup, type StoredSetup } from '../setupStorage'

// Minimal in-memory localStorage; the node test env has no DOM storage.
class MemoryStorage {
  private store = new Map<string, string>()
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
  removeItem(key: string): void {
    this.store.delete(key)
  }
  clear(): void {
    this.store.clear()
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const setup: StoredSetup = {
  roster: [
    { name: 'Ann', selected: true },
    { name: 'Bob', selected: false },
  ],
  startScore: 501,
  outMode: 'double',
}

describe('loadSetup / saveSetup round-trip', () => {
  it('returns null when nothing has been stored', () => {
    expect(loadSetup()).toBeNull()
  })

  it('persists and reloads a saved setup verbatim', () => {
    saveSetup(setup)
    expect(loadSetup()).toEqual(setup)
  })
})

describe('loadSetup defensive parsing', () => {
  it('returns null on corrupt JSON', () => {
    localStorage.setItem('pi-darts.setup.v1', '{not json')
    expect(loadSetup()).toBeNull()
  })

  it('returns null when the roster is not an array', () => {
    localStorage.setItem('pi-darts.setup.v1', JSON.stringify({ roster: 'nope' }))
    expect(loadSetup()).toBeNull()
  })

  it('drops entries without a string name and defaults selected to true', () => {
    localStorage.setItem(
      'pi-darts.setup.v1',
      JSON.stringify({ roster: [{ name: 'Ann' }, { selected: true }, { name: 42 }] }),
    )
    const result = loadSetup()
    expect(result!.roster).toEqual([{ name: 'Ann', selected: true }])
  })

  it('falls back to defaults for an unknown start score and out mode', () => {
    localStorage.setItem(
      'pi-darts.setup.v1',
      JSON.stringify({ roster: [{ name: 'Ann' }], startScore: 999, outMode: 'weird' }),
    )
    const result = loadSetup()
    expect(result!.startScore).toBe(301) // DEFAULT_OPTIONS.startScore
    expect(result!.outMode).toBe('single')
  })

  it('returns null instead of throwing when storage access throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('unavailable')
      },
    })
    expect(() => loadSetup()).not.toThrow()
    expect(loadSetup()).toBeNull()
  })
})

describe('saveSetup', () => {
  it('swallows storage errors instead of throwing', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('quota exceeded')
      },
    })
    expect(() => saveSetup(setup)).not.toThrow()
  })
})
