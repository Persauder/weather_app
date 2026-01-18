interface LayerConfig {
  id: string;
  name: string;
  enabled: boolean;
  opacity?: number;
}

interface SidebarProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string, enabled: boolean) => void;
  onSetLayerOpacity?: (id: string, opacity: number) => void;
  onCenterToUser?: () => void;
}

export function Sidebar({ layers, onToggleLayer, onSetLayerOpacity, onCenterToUser }: SidebarProps) {
  return (
    <div className="w-72 bg-white/80 p-4 rounded shadow-lg">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Map Controls</h2>

      {/* Center to User Button */}
      {onCenterToUser && (
        <button
          onClick={onCenterToUser}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          📍 Center to My Location
        </button>
      )}

      {/* Layers List */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Layers</h3>
        <div className="space-y-2">
          {layers.map((layer) => (
            <div key={layer.id} className="bg-white/60 p-2 rounded">
              {/* Layer Toggle */}
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={(e) => onToggleLayer(layer.id, e.target.checked)}
                    className="mr-2 h-4 w-4 accent-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{layer.name}</span>
                </label>
              </div>

              {/* Opacity Slider */}
              {onSetLayerOpacity && layer.enabled && (
                <div className="ml-6">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Opacity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(layer.opacity ?? 1) * 100}
                      onChange={(e) => onSetLayerOpacity(layer.id, Number(e.target.value) / 100)}
                      className="flex-1 h-1 accent-blue-500"
                    />
                    <span className="text-xs text-gray-600 w-8">
                      {Math.round((layer.opacity ?? 1) * 100)}%
                    </span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Legend */}
      <div className="bg-white/60 p-3 rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Temperature Scale</h3>
        <div className="space-y-2">
          {/* Gradient Bar */}
          <div className="h-6 rounded" style={{
            background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
          }}></div>

          {/* Scale Labels */}
          <div className="flex justify-between text-xs text-gray-600">
            <span>-20°C</span>
            <span>-10°C</span>
            <span>0°C</span>
            <span>10°C</span>
            <span>20°C</span>
            <span>30°C</span>
            <span>40°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

