import { useState, useEffect } from 'react';
import type { BodyView, BodyRegion } from './types';
import { DataProvider, useDataService } from './services/DataProvider';
import { ViewToggle } from './components/ViewToggle/ViewToggle';
import { BodyDiagram } from './components/BodyDiagram/BodyDiagram';
import { ExercisePanel } from './components/ExercisePanel/ExercisePanel';
import { WorkoutBuilder } from './components/WorkoutBuilder/WorkoutBuilder';
import { NutritionGuide } from './components/NutritionGuide/NutritionGuide';
import { useBodyInteraction } from './hooks/useBodyInteraction';
import './App.css';

type AppTab = 'atlas' | 'builder' | 'nutrition';

function AppContent() {
  const dataService = useDataService();
  const [activeTab, setActiveTab] = useState<AppTab>('atlas');
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
    dataService.getBodyRegions(activeView).then(setRegions);
  }, [dataService, activeView]);

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
        <p className="subtitle">INTERACTIVE ANATOMY & EXERCISE GUIDE</p>
        <nav className="tab-bar">
          <button
            className={`tab-btn${activeTab === 'atlas' ? ' active' : ''}`}
            onClick={() => setActiveTab('atlas')}
          >
            Body Atlas
          </button>
          <button
            className={`tab-btn${activeTab === 'builder' ? ' active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            Workout Builder
          </button>
          <button
            className={`tab-btn${activeTab === 'nutrition' ? ' active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrition Guide
          </button>
        </nav>
      </header>

      {activeTab === 'atlas' ? (
        <div className="app-layout">
          <aside className="sidebar-left">
            <ExercisePanel
              selectedRegion={selectedRegion}
              regionLabel={selectedLabel}
              exerciseType="stretch"
              panelTitle="Stretching & Mobility"
            />
          </aside>
          <main className="main-content">
            <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
            <BodyDiagram
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
              regionLabel={selectedLabel}
              exerciseType="exercise"
              panelTitle="Strengthening"
            />
          </aside>
        </div>
      ) : activeTab === 'builder' ? (
        <WorkoutBuilder />
      ) : (
        <NutritionGuide />
      )}
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
