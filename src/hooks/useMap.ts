import { useState, useCallback, useRef } from 'react';
import { Map as LeafletMap } from 'leaflet';
import type { LayerConfig } from '../constants/layers';
import { DEFAULT_LAYERS } from '../constants/layers';

interface MapState {
  center: [number, number];
  zoom: number;
  layers: LayerConfig[];
}

interface Marker {
  id: string;
  position: [number, number];
  title: string;
}

export const useMap = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: [50.4501, 30.5234], // Default: Kyiv
    zoom: 10,
    layers: DEFAULT_LAYERS,
  });

  const [markers, setMarkers] = useState<Marker[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  // Set map reference
  const setMapRef = useCallback((map: LeafletMap | null) => {
    mapRef.current = map;
  }, []);

  // Update map center and zoom
  const setCenter = useCallback((center: [number, number], zoom?: number) => {
    setMapState((prev) => ({
      ...prev,
      center,
      zoom: zoom ?? prev.zoom,
    }));

    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom ?? mapRef.current.getZoom(), {
        duration: 1.5,
      });
    }
  }, []);

  // Toggle layer visibility
  const toggleLayer = useCallback((layerId: string, enabled: boolean) => {
    setMapState((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === layerId ? { ...layer, enabled } : layer
      ),
    }));
  }, []);

  // Set layer opacity
  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setMapState((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      ),
    }));
  }, []);

  // Center map to user's location
  const centerToUser = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude], 12);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }, [setCenter]);

  // Add marker
  const addMarker = useCallback((marker: Marker) => {
    setMarkers((prev) => [...prev, marker]);
  }, []);

  // Remove marker
  const removeMarker = useCallback((markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
  }, []);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  // Handle map click
  const handleMapClick = useCallback((lat: number, lon: number) => {
    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      position: [lat, lon],
      title: `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    };
    addMarker(newMarker);
  }, [addMarker]);

  return {
    // State
    center: mapState.center,
    zoom: mapState.zoom,
    layers: mapState.layers,
    markers,
    mapRef,

    // Methods
    setMapRef,
    setCenter,
    toggleLayer,
    setLayerOpacity,
    centerToUser,
    addMarker,
    removeMarker,
    clearMarkers,
    handleMapClick,
  };
};

