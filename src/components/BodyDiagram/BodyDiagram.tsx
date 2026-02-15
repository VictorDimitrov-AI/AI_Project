import { useEffect, useState } from 'react';
import type { BodyView, LayerId, BodyRegion, Layer } from '../../types';
import { useDataService } from '../../services/DataProvider';
import { BodySvgFront } from './BodySvgFront';
import { BodySvgBack } from './BodySvgBack';
import './BodyDiagram.css';

interface Props {
  activeLayer: LayerId;
  activeView: BodyView;
  hoveredRegion: string | null;
  selectedRegion: string | null;
  onHover: (regionId: string | null) => void;
  onClick: (regionId: string) => void;
}

export function BodyDiagram({
  activeLayer,
  activeView,
  hoveredRegion,
  selectedRegion,
  onHover,
  onClick,
}: Props) {
  const dataService = useDataService();
  const [regions, setRegions] = useState<BodyRegion[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    dataService.getBodyRegions(activeView, activeLayer).then(setRegions);
  }, [dataService, activeView, activeLayer]);

  useEffect(() => {
    dataService.getLayers().then(setLayers);
  }, [dataService]);

  const currentLayer = layers.find((l) => l.id === activeLayer);
  const colors = currentLayer?.colors ?? {
    primary: '#e74c3c',
    hover: '#ff6b6b',
    active: '#c0392b',
  };

  const SvgComponent = activeView === 'front' ? BodySvgFront : BodySvgBack;

  return (
    <div className="body-diagram">
      <SvgComponent
        regions={regions}
        colors={colors}
        hoveredRegion={hoveredRegion}
        selectedRegion={selectedRegion}
        onHover={onHover}
        onClick={onClick}
      />
    </div>
  );
}
