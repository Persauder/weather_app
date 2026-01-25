export interface LayerConfig {
  id: string;
  name: string;
  tileUrl: string;
  enabled: boolean;
  opacity: number;
}

export const DEFAULT_LAYERS: LayerConfig[] = [
  {
    id: 'temp',
    name: 'Temperature',
    tileUrl: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={API_KEY}',
    enabled: true,
    opacity: 0.7,
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    tileUrl: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={API_KEY}',
    enabled: false,
    opacity: 0.6,
  },
  {
    id: 'clouds',
    name: 'Clouds',
    tileUrl: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid={API_KEY}',
    enabled: false,
    opacity: 0.5,
  },
  {
    id: 'wind',
    name: 'Wind Speed',
    tileUrl: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid={API_KEY}',
    enabled: false,
    opacity: 0.6,
  },
  {
    id: 'pressure',
    name: 'Pressure',
    tileUrl: 'https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid={API_KEY}',
    enabled: false,
    opacity: 0.6,
  },
];

