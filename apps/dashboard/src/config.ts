import config from '@/../dashboard.config.json'

interface LocationConfig {
  latitude: number
  longitude: number
}

interface StationConfig {
  id: number
}

interface DashboardConfig {
  location: LocationConfig
  station: StationConfig
}

export default config as DashboardConfig
