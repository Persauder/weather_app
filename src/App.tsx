import { useState, useCallback, useEffect, useRef } from 'react';
import { useWeather } from './hooks/useWeather';
import { SearchBar } from './components/Search/SearchBar.tsx';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherMap } from './components/Map/WeatherMap.tsx';
import { Sidebar } from './components/Sidebar/SideBar.tsx';
import { Timeline } from './components/Timeline/Timeline';
import { DEFAULT_LAYERS } from './constants/layers';
import type { LayerConfig } from './constants/layers';
import { type LatLngExpression } from 'leaflet';


function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByCoords, clearError } = useWeather();

  // Map state
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([50.4501, 30.5234]); // Kyiv default
  const [mapZoom] = useState(6);

  // Weather layers
  const [layers, setLayers] = useState<LayerConfig[]>(DEFAULT_LAYERS);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

  // Markers for searched locations
  const markers = weather
    ? [
        {
          id: 'searched',
          position: [weather.coord.lat, weather.coord.lon] as LatLngExpression,
          weatherData: weather,
        },
      ]
    : [];

  const handleToggleLayer = useCallback((id: string, enabled: boolean) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, enabled } : layer))
    );
  }, []);

  const handleSetLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, opacity } : layer))
    );
  }, []);

  const handleCenterToUser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [fetchWeatherByCoords]);

  const handleMapClick = useCallback(
    (lat: number, lon: number) => {
      fetchWeatherByCoords(lat, lon);
      setMapCenter([lat, lon]);
    },
    [fetchWeatherByCoords]
  );

  const handleSearchCity = useCallback(
    async (city: string) => {
      const result = await fetchWeather(city);
      // Update map center after successful search
      if (result) {
        setMapCenter([result.coord.lat, result.coord.lon]);
      }
    },
    [fetchWeather]
  );

  const handleTimeChange = useCallback((timestamp: number) => {
    setSelectedTimestamp(timestamp);

    // Update layer URLs with timestamp
    setLayers((prev) =>
      prev.map((layer) => {
        // For now, we'll use current data layers
        // In future, you can add timestamp parameter if API supports it
        return layer;
      })
    );

    console.log('Time changed to:', new Date(timestamp));
  }, []);

  const handlePlayPause = useCallback((playing: boolean) => {
    setIsPlaying(playing);

    if (playing) {
      // Start timeline animation
      console.log('Starting timeline animation...');
      // This will cycle through time slots automatically
    } else {
      console.log('Timeline animation paused');
    }
  }, []);

  // Animation effect for timeline playback
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      lastUpdateRef.current = Date.now(); // Initialize on first play

      const animate = () => {
        const now = Date.now();
        // Update every 2 seconds
        if (now - lastUpdateRef.current > 2000) {
          lastUpdateRef.current = now;

          // Move to next time slot (this will trigger handleTimeChange in Timeline component)
          // The Timeline component handles its own time progression
          console.log('Animation tick:', new Date().toLocaleTimeString());
        }
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);

  // Effect to update map when timestamp changes
  useEffect(() => {
    if (selectedTimestamp) {
      console.log('⏰ Timeline active - timestamp:', new Date(selectedTimestamp).toLocaleString());

      // Update layer URLs to force re-render (add cache-busting parameter)
      setLayers((prev) =>
        prev.map((layer) => ({
          ...layer,
          tileUrl: layer.tileUrl.split('&t=')[0] + `&t=${selectedTimestamp}`,
        }))
      );
    }
  }, [selectedTimestamp]);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Sidebar
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onSetLayerOpacity={handleSetLayerOpacity}
          onCenterToUser={handleCenterToUser}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Search */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 shadow-lg z-[999]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white text-center mb-4">
              🌤️ Weather Map Application
            </h1>
            <SearchBar onSearch={handleSearchCity} isLoading={loading} />

            {error && (
              <div className="mt-4">
                <ErrorMessage message={error} onClose={clearError} />
              </div>
            )}
          </div>
        </div>

        {/* Map and Weather Details */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000]">
              <Loader />
            </div>
          )}

          {/* Weather Map */}
          <WeatherMap
            center={mapCenter}
            zoom={mapZoom}
            layers={layers}
            markers={markers}
            onMapClick={handleMapClick}
          />

          {/* Weather Details Card (overlay) */}
          {weather && !loading && (
            <div className="absolute top-4 right-4 z-[1000] max-w-md">
              <WeatherDetails weather={weather} />
            </div>
          )}

          {/* Timestamp Indicator (when timeline is active) */}
          {selectedTimestamp && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">⏰ Timeline Active:</span>
                <span className="text-sm">
                  {new Date(selectedTimestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Timeline Component */}
          <Timeline
            onTimeChange={handleTimeChange}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

