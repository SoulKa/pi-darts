import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberPad from '../NumberPad.vue'
import type { CheckoutRoute } from '../../game/checkout'

function mountPad(
  props: Partial<{ disabled: boolean; canUndo: boolean; checkoutRoutes: CheckoutRoute[] }> = {},
) {
  return mount(NumberPad, {
    props: { disabled: false, canUndo: false, checkoutRoutes: [], ...props },
  })
}

/** The number button whose label is exactly `n` (buttons render 1..20, then 0 and 25). */
function numberButton(wrapper: ReturnType<typeof mountPad>, n: number) {
  return wrapper.findAll('.num').find((b) => b.text() === String(n))!
}

describe('NumberPad throwing', () => {
  it('emits a single-multiplier throw when a plain number is tapped', async () => {
    const pad = mountPad()
    await numberButton(pad, 20).trigger('click')
    expect(pad.emitted('throw')).toEqual([[20, 1]])
  })

  it('arms Double/Triple for the next dart, then resets to single', async () => {
    const pad = mountPad()

    await pad.find('.double').trigger('click')
    await numberButton(pad, 19).trigger('click')
    await numberButton(pad, 5).trigger('click')

    expect(pad.emitted('throw')).toEqual([
      [19, 2], // double armed
      [5, 1], // reset to single after the throw
    ])
  })

  it('toggling the same modifier twice disarms it', async () => {
    const pad = mountPad()
    await pad.find('.triple').trigger('click')
    await pad.find('.triple').trigger('click')
    await numberButton(pad, 10).trigger('click')
    expect(pad.emitted('throw')).toEqual([[10, 1]])
  })
})

describe('NumberPad illegal / disabled states', () => {
  it('treats triple-25 as illegal: arming Triple then tapping 25 emits nothing', async () => {
    const pad = mountPad()
    await pad.find('.triple').trigger('click')
    await numberButton(pad, 25).trigger('click')
    expect(pad.emitted('throw')).toBeUndefined()
  })

  it('still allows double-25 (bull = 50)', async () => {
    const pad = mountPad()
    await pad.find('.double').trigger('click')
    await numberButton(pad, 25).trigger('click')
    expect(pad.emitted('throw')).toEqual([[25, 2]])
  })

  it('emits nothing when disabled', async () => {
    const pad = mountPad({ disabled: true })
    await numberButton(pad, 20).trigger('click')
    expect(pad.emitted('throw')).toBeUndefined()
  })
})

describe('NumberPad undo', () => {
  it('disables undo unless canUndo, then emits undo when tapped', async () => {
    const disabled = mountPad({ canUndo: false })
    expect(disabled.find('.undo').attributes('disabled')).toBeDefined()

    const enabled = mountPad({ canUndo: true })
    await enabled.find('.undo').trigger('click')
    expect(enabled.emitted('undo')).toHaveLength(1)
  })
})

describe('NumberPad checkout hint', () => {
  it('shows the checkout routes in the hint line', () => {
    const routes: CheckoutRoute[] = [
      { darts: [], label: 'T20 D20' },
      { darts: [], label: 'T19 Bull' },
    ]
    const pad = mountPad({ checkoutRoutes: routes })
    expect(pad.find('.hint').text()).toBe('Checkout: T20 D20 · T19 Bull')
  })
})
