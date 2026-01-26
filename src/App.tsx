import { useState, useCallback, useEffect, useRef } from 'react';
import { useWeather } from './hooks/useWeather';
import { useSubscriptions } from './hooks/useSubscriptions';
import { SearchBar } from './components/Search/SearchBar.tsx';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherMap } from './components/Map/WeatherMap.tsx';
import { Sidebar } from './components/Sidebar/SideBar.tsx';
import { Timeline } from './components/Timeline/Timeline';
import { SubscriptionForm } from './components/Subscription/SubscriptionForm';
import { DEFAULT_LAYERS } from './constants/layers';
import type { LayerConfig } from './constants/layers';
import { type LatLngExpression } from 'leaflet';


function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByCoords, clearError } = useWeather();

  // Subscription management
  const {
    subscriptions,
    alerts,
    addSubscription,
    removeSubscription,
    toggleSubscription,
    markAlertAsRead,
    clearAllAlerts,
    checkForWeatherAlerts,
  } = useSubscriptions();

  // Map state
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([50.4501, 30.5234]); // Kyiv default
  const [mapZoom] = useState(6);

  // Weather layers
  const [layers, setLayers] = useState<LayerConfig[]>(DEFAULT_LAYERS);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

  // Subscription form state
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [subscriptionLocation, setSubscriptionLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

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

    // Calculate time difference from now (in hours)
    const now = Date.now();
    const hoursDiff = Math.abs(timestamp - now) / (1000 * 60 * 60);

    // Adjust layer opacity based on time distance (visual effect to show timeline impact)
    // Closer to current time = more opaque, further = more transparent
    const opacityMultiplier = Math.max(0.3, 1 - (hoursDiff / 24));

    // Update layer URLs with timestamp and adjust opacity for visual feedback
    setLayers((prev) =>
      prev.map((layer) => {
        const baseUrl = layer.tileUrl.split('&t=')[0].split('?')[0];
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        return {
          ...layer,
          tileUrl: `${baseUrl}?appid=${apiKey}&t=${timestamp}`,
          opacity: layer.enabled ? layer.opacity * opacityMultiplier : layer.opacity,
        };
      })
    );

    console.log('⏰ Time changed to:', new Date(timestamp).toLocaleString(), `(${hoursDiff.toFixed(1)}h from now)`);
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

  // Subscription handlers
  const handleSubscribeClick = useCallback((locationName: string, lat: number, lon: number) => {
    setSubscriptionLocation({ name: locationName, lat, lon });
    setShowSubscriptionForm(true);
  }, []);

  const handleSubscriptionSubmit = useCallback((formData: any) => {
    addSubscription(formData);
    setShowSubscriptionForm(false);
    setSubscriptionLocation(null);
  }, [addSubscription]);

  const handleSubscriptionCancel = useCallback(() => {
    setShowSubscriptionForm(false);
    setSubscriptionLocation(null);
  }, []);

  // Periodically check for weather alerts (simulate real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      checkForWeatherAlerts();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkForWeatherAlerts]);

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



  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Sidebar
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onSetLayerOpacity={handleSetLayerOpacity}
          onCenterToUser={handleCenterToUser}
          subscriptions={subscriptions}
          alerts={alerts}
          onToggleSubscription={toggleSubscription}
          onRemoveSubscription={removeSubscription}
          onMarkAlertAsRead={markAlertAsRead}
          onClearAllAlerts={clearAllAlerts}
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
            <div className="absolute top-4 right-4 z-[1000] max-w-md space-y-2">
              <WeatherDetails weather={weather} />

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribeClick(weather.name, weather.coord.lat, weather.coord.lon)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>📧</span>
                <span>Subscribe to Alerts</span>
              </button>
            </div>
          )}

          {/* Timestamp Indicator (when timeline is active) */}
          {selectedTimestamp && (
            <>
              {/* Time of day overlay for visual feedback */}
              <div
                className="absolute inset-0 pointer-events-none z-[500] transition-all duration-1000"
                style={{
                  backgroundColor: (() => {
                    const hour = new Date(selectedTimestamp).getHours();
                    // Night: 8pm-6am (purple/dark)
                    if (hour >= 20 || hour < 6) {
                      return 'rgba(25, 25, 112, 0.15)'; // Midnight blue
                    }
                    // Morning: 6am-10am (orange/warm)
                    if (hour >= 6 && hour < 10) {
                      return 'rgba(255, 140, 0, 0.1)'; // Dawn orange
                    }
                    // Afternoon: 10am-6pm (bright/clear)
                    if (hour >= 10 && hour < 18) {
                      return 'rgba(135, 206, 250, 0.05)'; // Sky blue
                    }
                    // Evening: 6pm-8pm (golden)
                    return 'rgba(255, 215, 0, 0.12)'; // Golden hour
                  })()
                }}
              />

              {/* Timestamp badge */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
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
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {(() => {
                      const hour = new Date(selectedTimestamp).getHours();
                      if (hour >= 20 || hour < 6) return '🌙 Night';
                      if (hour >= 6 && hour < 10) return '🌅 Morning';
                      if (hour >= 10 && hour < 18) return '☀️ Day';
                      return '🌆 Evening';
                    })()}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Timeline Component */}
          <Timeline
            onTimeChange={handleTimeChange}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        </div>
      </div>

      {/* Subscription Form Modal */}
      {showSubscriptionForm && subscriptionLocation && (
        <SubscriptionForm
          locationName={subscriptionLocation.name}
          coordinates={{
            lat: subscriptionLocation.lat,
            lon: subscriptionLocation.lon,
          }}
          onSubmit={handleSubscriptionSubmit}
          onCancel={handleSubscriptionCancel}
        />
      )}
    </div>
  );
}

export default App;

