import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherPopup } from '../WeatherPopup.tsx';
import { type WeatherResponse } from '../../types/weather.ts';

// Fix for default marker icons in Leaflet with Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LayerConfig {
  id: string;
  name: string;
  tileUrl: string;
  enabled: boolean;
  opacity?: number;
}

interface MarkerData {
  id: string;
  position: LatLngExpression;
  weatherData: WeatherResponse;
}

interface WeatherMapProps {
  center: LatLngExpression;
  zoom: number;
  layers: LayerConfig[];
  markers?: MarkerData[];
  onMapClick?: (lat: number, lon: number) => void;
  onMarkerClick?: (markerId: string) => void;
}

// Map event handler component
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Map center updater component
function MapCenterUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function WeatherMap({
  center,
  zoom,
  layers,
  markers = [],
  onMapClick,
  onMarkerClick,
}: WeatherMapProps) {
  // Memoize enabled layers to avoid unnecessary re-renders
  const enabledLayers = useMemo(
    () => layers.filter((layer) => layer.enabled),
    [layers]
  );

  // Memoize tile URLs with API key
  const layersWithUrls = useMemo(
    () =>
      enabledLayers.map((layer) => ({
        ...layer,
        tileUrl: layer.tileUrl.replace('{API_KEY}', import.meta.env.VITE_OPENWEATHER_API_KEY || ''),
      })),
    [enabledLayers]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      {/* Base OpenStreetMap Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dynamic Weather Layers */}
      {layersWithUrls.map((layer) => (
        <TileLayer
          key={layer.id}
          url={layer.tileUrl}
          opacity={layer.opacity ?? 1}
          attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        />
      ))}

      {/* Markers with Weather Popups */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) {
                onMarkerClick(marker.id);
              }
            },
          }}
        >
          <Popup>
            <WeatherPopup data={marker.weatherData} />
          </Popup>
        </Marker>
      ))}

      {/* Map Events Handler */}
      <MapEvents onMapClick={onMapClick} />

      {/* Map Center Updater */}
      <MapCenterUpdater center={center} />
    </MapContainer>
  );
}

