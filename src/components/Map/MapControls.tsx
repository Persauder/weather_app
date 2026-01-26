import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

interface MapControlsProps {
  center: [number, number];
  zoom: number;
  onCenterToUser?: () => void;
}

export const MapControls = ({ center, zoom, onCenterToUser }: MapControlsProps) => {
  const map = useMap();

  // Update map position when center or zoom changes
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  // Handle zoom in
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  // Handle reset view
  const handleResetView = () => {
    if (map) {
      map.setView(center, zoom);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="w-10 h-10 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors"
        title="Reset View"
        aria-label="Reset View"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Center to User Location Button */}
      {onCenterToUser && (
        <button
          onClick={onCenterToUser}
          className="w-10 h-10 bg-white hover:bg-gray-100 rounded-lg shadow-md flex items-center justify-center transition-colors"
          title="My Location"
          aria-label="Center to My Location"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

