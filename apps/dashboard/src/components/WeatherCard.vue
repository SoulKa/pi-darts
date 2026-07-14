<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData } from '@/composables/useWeather'
import { getWeatherCondition } from '@/utils/wmo'

const props = defineProps<{
  weather: WeatherData | null
  loading: boolean
  error: Error | null
  time: Date
}>()

const timeStr = computed(() =>
  props.time.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }),
)

const isEvening = computed(() => props.time.getHours() >= 18)

const today = computed(() => props.weather?.today ?? null)
const tomorrow = computed(() => props.weather?.tomorrow ?? null)

const todayPrecipClass = computed(() => {
  const p = today.value?.precipitationProbability ?? 0
  return {
    'text-red-400': p > 50,
    'text-amber-400': p > 20 && p <= 50,
    'text-neutral-600 dark:text-neutral-300': p <= 20,
  }
})

const tomorrowPrecipClass = computed(() => {
  const p = tomorrow.value?.precipitationProbability ?? 0
  return {
    'text-red-400': p > 50,
    'text-amber-400': p > 20 && p <= 50,
    'text-neutral-600 dark:text-neutral-300': p <= 20,
  }
})

function formatHour(h: number): string {
  return String(h).padStart(2, '0') + ':00'
}
</script>

<template>
  <div class="flex flex-col px-10 pt-6 pb-10 gap-y-10">
    <div class="flex items-start justify-center">
      <span
        class="text-5xl font-mono font-light text-neutral-600 dark:text-neutral-300 tabular-nums"
      >
        {{ timeStr }}
      </span>
    </div>

    <div v-if="error" class="py-10 flex items-center justify-center text-red-400 text-xl">
      Wetterdaten nicht verfügbar
    </div>

    <template v-else-if="isEvening && tomorrow !== null">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="slot in tomorrow.slots"
          :key="slot.hour"
          class="flex flex-col items-center gap-3"
        >
          <span class="text-xl text-neutral-500 dark:text-neutral-400 font-mono">{{
            formatHour(slot.hour)
          }}</span>
          <span class="text-6xl leading-none">{{
            getWeatherCondition(slot.weatherCode).icon
          }}</span>
          <span class="text-5xl font-bold leading-none">{{ slot.temperature }}°</span>
          <span class="text-xl text-neutral-600 dark:text-neutral-300 text-center leading-tight">
            {{ getWeatherCondition(slot.weatherCode).label }}
          </span>
          <span
            v-if="slot.precipitationProbability > 0"
            class="text-lg font-medium"
            :class="{
              'text-red-400': slot.precipitationProbability > 50,
              'text-amber-400':
                slot.precipitationProbability > 20 && slot.precipitationProbability <= 50,
              'text-neutral-400': slot.precipitationProbability <= 20,
            }"
            >🌧 {{ slot.precipitationProbability }}%</span
          >
        </div>
      </div>

      <div class="flex justify-between items-center text-2xl">
        <span class="text-neutral-600 dark:text-neutral-300"
          >↑ {{ tomorrow.high }}°&nbsp;&nbsp;↓ {{ tomorrow.low }}°</span
        >
        <span class="text-lg text-neutral-500 font-medium tracking-widest uppercase">Morgen</span>
        <span class="font-semibold" :class="tomorrowPrecipClass">
          🌧 {{ tomorrow.precipitationProbability }}%&nbsp;&nbsp;{{ tomorrow.precipitationMm }}
          mm
        </span>
      </div>
    </template>

    <template v-else-if="today !== null">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="slot in today.slots" :key="slot.hour" class="flex flex-col items-center gap-3">
          <span class="text-xl text-neutral-500 dark:text-neutral-400 font-mono">{{
            formatHour(slot.hour)
          }}</span>
          <span class="text-6xl leading-none">{{
            getWeatherCondition(slot.weatherCode).icon
          }}</span>
          <span class="text-5xl font-bold leading-none">{{ slot.temperature }}°</span>
          <span class="text-xl text-neutral-600 dark:text-neutral-300 text-center leading-tight">
            {{ getWeatherCondition(slot.weatherCode).label }}
          </span>
          <span
            v-if="slot.precipitationProbability > 0"
            class="text-lg font-medium"
            :class="{
              'text-red-400': slot.precipitationProbability > 50,
              'text-amber-400':
                slot.precipitationProbability > 20 && slot.precipitationProbability <= 50,
              'text-neutral-400': slot.precipitationProbability <= 20,
            }"
            >🌧 {{ slot.precipitationProbability }}%</span
          >
        </div>
      </div>

      <div class="flex justify-between items-center text-2xl">
        <span class="text-neutral-600 dark:text-neutral-300"
          >↑ {{ today.high }}°&nbsp;&nbsp;↓ {{ today.low }}°</span
        >
        <span class="text-lg text-neutral-500 font-medium tracking-widest uppercase">Heute</span>
        <span class="font-semibold" :class="todayPrecipClass">
          🌧 {{ today.precipitationProbability }}%&nbsp;&nbsp;{{ today.precipitationMm }}
          mm
        </span>
      </div>
    </template>

    <template v-else></template>
  </div>
</template>
