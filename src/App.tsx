import { useState, useEffect } from 'react';
import type { LayerId, BodyView, BodyRegion } from './types';
import { DataProvider, useDataService } from './services/DataProvider';
import { LayerSelector } from './components/LayerSelector/LayerSelector';
import { ViewToggle } from './components/ViewToggle/ViewToggle';
import { BodyDiagram } from './components/BodyDiagram/BodyDiagram';
import { ExercisePanel } from './components/ExercisePanel/ExercisePanel';
import { useBodyInteraction } from './hooks/useBodyInteraction';
import './App.css';

function AppContent() {
  const dataService = useDataService();
  const [activeLayer, setActiveLayer] = useState<LayerId>('muscular');
  const [activeView, setActiveView] = useState<BodyView>('front');
  const [regions, setRegions] = useState<BodyRegion[]>([]);
  const {
    selectedRegion,
    hoveredRegion,
    handleRegionClick,
    handleRegionHover,
    clearSelection,
  } = useBodyInteraction();

  useEffect(() => {
    dataService.getBodyRegions(activeView, activeLayer).then(setRegions);
  }, [dataService, activeView, activeLayer]);

  const handleLayerChange = (layer: LayerId) => {
    setActiveLayer(layer);
    clearSelection();
  };

  const handleViewChange = (view: BodyView) => {
    setActiveView(view);
    clearSelection();
  };

  const selectedLabel =
    regions.find((r) => r.id === selectedRegion)?.label ?? selectedRegion;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Body Atlas</h1>
        <p className="subtitle">Interactive Physiology & Exercise Guide</p>
      </header>
      <div className="app-layout">
        <aside className="sidebar-left">
          <LayerSelector
            activeLayer={activeLayer}
            onLayerChange={handleLayerChange}
          />
        </aside>
        <main className="main-content">
          <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
          <BodyDiagram
            activeLayer={activeLayer}
            activeView={activeView}
            hoveredRegion={hoveredRegion}
            selectedRegion={selectedRegion}
            onHover={handleRegionHover}
            onClick={handleRegionClick}
          />
        </main>
        <aside className="sidebar-right">
          <ExercisePanel
            selectedRegion={selectedRegion}
            activeLayer={activeLayer}
            regionLabel={selectedLabel}
          />
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
