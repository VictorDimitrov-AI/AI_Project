import { useEffect, useState } from 'react';
import type { Layer, LayerId } from '../../types';
import { useDataService } from '../../services/DataProvider';
import './LayerSelector.css';

interface Props {
  activeLayer: LayerId;
  onLayerChange: (layer: LayerId) => void;
}

export function LayerSelector({ activeLayer, onLayerChange }: Props) {
  const dataService = useDataService();
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    dataService.getLayers().then(setLayers);
  }, [dataService]);

  return (
    <div className="layer-selector">
      <h2>Systems</h2>
      <div className="layer-buttons">
        {layers.map((layer) => (
          <button
            key={layer.id}
            className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
            onClick={() => onLayerChange(layer.id)}
            style={{
              '--layer-primary': layer.colors.primary,
              '--layer-hover': layer.colors.hover,
              '--layer-active': layer.colors.active,
            } as React.CSSProperties}
          >
            <span
              className="color-swatch"
              style={{ backgroundColor: layer.colors.primary }}
            />
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  );
}
