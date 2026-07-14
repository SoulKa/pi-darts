import { computed, ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import type { WeatherData } from '@/composables/useWeather'

export type ThemePreference = 'auto' | 'light' | 'dark'

const CYCLE: ThemePreference[] = ['auto', 'light', 'dark']
const OFFSET_MS = 60 * 60 * 1000
const SYMBOLS: Record<ThemePreference, string> = {
  auto: '◐',
  light: '☀',
  dark: '☾',
}

export function useTheme(weather: Ref<WeatherData | null>, currentTime: Ref<Date>) {
  const preference = ref<ThemePreference>('auto')
  const themeSymbol = computed(() => SYMBOLS[preference.value])

  watchEffect(() => {
    if (preference.value === 'light') {
      document.documentElement.classList.remove('dark')
      return
    }
    if (preference.value === 'dark') {
      document.documentElement.classList.add('dark')
      return
    }
    const w = weather.value
    const t = currentTime.value.getTime()
    const isDay =
      w !== null && t >= w.sunrise.getTime() + OFFSET_MS && t < w.sunset.getTime() - OFFSET_MS
    document.documentElement.classList.toggle('dark', !isDay)
  })

  function cycleTheme() {
    preference.value = CYCLE[(CYCLE.indexOf(preference.value) + 1) % CYCLE.length]
  }

  return { preference, themeSymbol, cycleTheme }
}
