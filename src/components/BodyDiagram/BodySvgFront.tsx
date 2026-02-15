import type { BodyRegion } from '../../types';
import { BodyRegionPath } from './BodyRegionPath';

// SVG paths for front body regions - designed for a 300x500 viewBox
const FRONT_PATHS: Record<string, string> = {
  'neck-front':
    'M 138 60 Q 140 52 150 48 Q 160 45 150 48 Q 160 52 162 60 L 162 80 Q 155 82 150 82 Q 145 82 138 80 Z',
  chest:
    'M 115 100 Q 118 90 130 85 Q 140 82 150 82 Q 160 82 170 85 Q 182 90 185 100 L 188 130 Q 185 145 175 148 Q 165 150 150 150 Q 135 150 125 148 Q 115 145 112 130 Z',
  'shoulders-front':
    'M 95 85 Q 100 78 115 80 Q 125 82 130 85 L 115 100 L 108 100 Q 95 95 95 85 Z M 205 85 Q 200 78 185 80 Q 175 82 170 85 L 185 100 L 192 100 Q 205 95 205 85 Z',
  biceps:
    'M 95 100 L 108 100 L 105 140 Q 102 155 98 160 L 90 160 Q 88 145 90 130 Z M 205 100 L 192 100 L 195 140 Q 198 155 202 160 L 210 160 Q 212 145 210 130 Z',
  'forearms-front':
    'M 88 162 L 100 162 Q 100 180 98 200 Q 96 215 92 225 L 85 225 Q 84 210 85 195 Z M 200 162 L 212 162 Q 212 180 215 195 L 218 225 L 208 225 Q 204 215 202 200 Q 200 180 200 162 Z',
  abs:
    'M 130 152 Q 140 150 150 150 Q 160 150 170 152 L 172 180 L 175 210 Q 170 225 165 230 Q 155 235 150 235 Q 145 235 135 230 Q 130 225 125 210 L 128 180 Z',
  quadriceps:
    'M 122 238 Q 130 232 140 235 L 142 270 L 145 310 Q 142 320 138 325 L 125 325 Q 120 310 118 290 Q 118 260 122 238 Z M 178 238 Q 170 232 160 235 L 158 270 L 155 310 Q 158 320 162 325 L 175 325 Q 180 310 182 290 Q 182 260 178 238 Z',
  shins:
    'M 124 328 L 140 328 L 142 360 L 142 400 Q 140 420 138 430 L 125 430 Q 122 415 122 400 L 122 360 Z M 160 328 L 176 328 L 178 360 L 178 400 Q 176 420 175 430 L 162 430 Q 160 415 158 400 L 158 360 Z',
};

interface Props {
  regions: BodyRegion[];
  colors: { primary: string; hover: string; active: string };
  hoveredRegion: string | null;
  selectedRegion: string | null;
  onHover: (regionId: string | null) => void;
  onClick: (regionId: string) => void;
}

export function BodySvgFront({
  regions,
  colors,
  hoveredRegion,
  selectedRegion,
  onHover,
  onClick,
}: Props) {
  const activeRegionIds = new Set(regions.map((r) => r.id));

  return (
    <svg viewBox="60 30 180 420" className="body-svg">
      {/* Body outline */}
      <ellipse cx="150" cy="30" rx="22" ry="24" fill="#2a2a4a" stroke="#444" strokeWidth="1" />
      {Object.entries(FRONT_PATHS).map(([id, path]) => {
        const region = regions.find((r) => r.id === id);
        const isActive = activeRegionIds.has(id);
        return (
          <BodyRegionPath
            key={id}
            regionId={id}
            label={region?.label ?? id}
            path={path}
            color={colors.primary}
            hoverColor={colors.hover}
            activeColor={colors.active}
            isHovered={hoveredRegion === id}
            isSelected={selectedRegion === id}
            dimmed={!isActive}
            onHover={onHover}
            onClick={onClick}
          />
        );
      })}
      {/* Body silhouette behind regions */}
      <path
        d="M 150 54 Q 138 54 135 60 L 135 80 Q 125 82 115 85 Q 95 78 92 85 Q 88 92 88 100 L 85 130 Q 83 155 85 165 L 82 200 Q 80 220 82 230 L 120 235 Q 125 230 128 225 L 128 245 Q 118 260 118 290 Q 118 310 122 330 L 120 360 Q 120 400 122 430 L 140 435 L 140 430 Q 142 420 145 400 L 145 360 L 145 330 Q 148 326 150 325 Q 152 326 155 330 L 155 360 L 155 400 Q 158 420 160 430 L 160 435 L 178 430 Q 180 400 180 360 L 178 330 Q 182 310 182 290 Q 182 260 172 245 L 172 225 Q 175 230 180 235 L 218 230 Q 220 220 218 200 L 215 165 Q 217 155 215 130 L 212 100 Q 212 92 208 85 Q 205 78 185 85 Q 175 82 165 80 L 165 60 Q 162 54 150 54 Z"
        fill="none"
        stroke="#444"
        strokeWidth="1"
        pointerEvents="none"
      />
    </svg>
  );
}
