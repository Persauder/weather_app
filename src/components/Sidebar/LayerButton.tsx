import type { LayerConfig } from '../../constants/layers';

interface LayerButtonProps {
  layer: LayerConfig;
  onToggle: (id: string, enabled: boolean) => void;
  onOpacityChange?: (id: string, opacity: number) => void;
}

export const LayerButton = ({ layer, onToggle, onOpacityChange }: LayerButtonProps) => {
  const handleToggle = () => {
    onToggle(layer.id, !layer.enabled);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    if (onOpacityChange) {
      onOpacityChange(layer.id, newOpacity);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white/90 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Layer Name and Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor={`layer-${layer.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            id={`layer-${layer.id}`}
            type="checkbox"
            checked={layer.enabled}
            onChange={handleToggle}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">{layer.name}</span>
        </label>

        {/* Enabled Indicator */}
        {layer.enabled && (
          <span className="text-xs text-green-600 font-semibold">ON</span>
        )}
      </div>

      {/* Opacity Slider (only shown when layer is enabled) */}
      {layer.enabled && onOpacityChange && (
        <div className="flex items-center gap-2">
          <label htmlFor={`opacity-${layer.id}`} className="text-xs text-gray-600 min-w-[50px]">
            Opacity:
          </label>
          <input
            id={`opacity-${layer.id}`}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={layer.opacity}
            onChange={handleOpacityChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            aria-label={`${layer.name} opacity`}
          />
          <span className="text-xs text-gray-600 min-w-[35px] text-right">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

