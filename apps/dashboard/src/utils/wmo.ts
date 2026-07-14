export interface WeatherCondition {
  icon: string
  label: string
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { icon: '☀️', label: 'Klar' }
  if (code <= 3) return { icon: '⛅', label: 'Bewölkt' }
  if (code === 45 || code === 48) return { icon: '🌫️', label: 'Nebel' }
  if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Nieselregen' }
  if (code >= 61 && code <= 67) return { icon: '🌧️', label: 'Regen' }
  if (code >= 71 && code <= 77) return { icon: '🌨️', label: 'Schnee' }
  if (code >= 80 && code <= 82) return { icon: '🌦️', label: 'Schauer' }
  if (code === 95) return { icon: '⛈️', label: 'Gewitter' }
  if (code === 96 || code === 99) return { icon: '⛈️', label: 'Hagel' }
  return { icon: '🌡️', label: 'Unbekannt' }
}
