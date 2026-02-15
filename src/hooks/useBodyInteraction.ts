import { useState, useCallback } from 'react';

export function useBodyInteraction() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = useCallback((regionId: string) => {
    setSelectedRegion((prev) => (prev === regionId ? null : regionId));
  }, []);

  const handleRegionHover = useCallback((regionId: string | null) => {
    setHoveredRegion(regionId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRegion(null);
    setHoveredRegion(null);
  }, []);

  return {
    selectedRegion,
    hoveredRegion,
    handleRegionClick,
    handleRegionHover,
    clearSelection,
  };
}
