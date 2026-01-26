import { TileLayer } from 'react-leaflet';
import type { LayerConfig } from '../../constants/layers';

interface MapLayersProps {
  layers: LayerConfig[];
  apiKey: string;
}

export const MapLayers = ({ layers, apiKey }: MapLayersProps) => {
  return (
    <>
      {layers
        .filter((layer) => layer.enabled)
        .map((layer) => (
          <TileLayer
            key={layer.id}
            url={layer.tileUrl.replace('{API_KEY}', apiKey)}
            opacity={layer.opacity}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          />
        ))}
    </>
  );
};

