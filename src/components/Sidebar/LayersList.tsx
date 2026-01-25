import type { LayerConfig } from '../../constants/layers';
import { LayerButton } from './LayerButton';

interface LayersListProps {
  layers: LayerConfig[];
  onToggleLayer: (id: string, enabled: boolean) => void;
  onSetLayerOpacity?: (id: string, opacity: number) => void;
}

export const LayersList = ({ layers, onToggleLayer, onSetLayerOpacity }: LayersListProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Weather Layers</h3>

      {layers.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No layers available</p>
      ) : (
        <div className="flex flex-col gap-2">
          {layers.map((layer) => (
            <LayerButton
              key={layer.id}
              layer={layer}
              onToggle={onToggleLayer}
              onOpacityChange={onSetLayerOpacity}
            />
          ))}
        </div>
      )}

      {/* Active Layers Count */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Active layers: <span className="font-semibold">{layers.filter(l => l.enabled).length}</span> / {layers.length}
        </p>
      </div>
    </div>
  );
};

