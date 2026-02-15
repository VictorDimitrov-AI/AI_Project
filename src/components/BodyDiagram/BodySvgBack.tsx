import type { BodyRegion } from '../../types';
import { BodyRegionPath } from './BodyRegionPath';

// SVG paths for back body regions - designed for a 300x500 viewBox
const BACK_PATHS: Record<string, string> = {
  'neck-back':
    'M 138 60 Q 140 52 150 48 Q 160 52 162 60 L 162 80 Q 155 82 150 82 Q 145 82 138 80 Z',
  'upper-back':
    'M 118 90 Q 125 85 135 83 Q 145 82 150 82 Q 155 82 165 83 Q 175 85 182 90 L 185 120 Q 182 140 175 145 Q 165 148 150 148 Q 135 148 125 145 Q 118 140 115 120 Z',
  'shoulders-back':
    'M 95 85 Q 100 78 115 80 L 118 90 L 108 100 Q 95 95 95 85 Z M 205 85 Q 200 78 185 80 L 182 90 L 192 100 Q 205 95 205 85 Z',
  triceps:
    'M 95 100 L 108 100 L 105 140 Q 102 155 98 160 L 90 160 Q 88 145 90 130 Z M 205 100 L 192 100 L 195 140 Q 198 155 202 160 L 210 160 Q 212 145 210 130 Z',
  'forearms-back':
    'M 88 162 L 100 162 Q 100 180 98 200 Q 96 215 92 225 L 85 225 Q 84 210 85 195 Z M 200 162 L 212 162 Q 212 180 215 195 L 218 225 L 208 225 Q 204 215 202 200 Q 200 180 200 162 Z',
  'lower-back':
    'M 130 150 Q 140 148 150 148 Q 160 148 170 150 L 172 180 L 175 210 Q 170 222 165 225 Q 155 228 150 228 Q 145 228 135 225 Q 130 222 125 210 L 128 180 Z',
  glutes:
    'M 122 230 Q 130 226 140 228 Q 145 230 150 232 Q 155 230 160 228 Q 170 226 178 230 L 180 250 Q 178 262 170 268 Q 162 272 150 272 Q 138 272 130 268 Q 122 262 120 250 Z',
  hamstrings:
    'M 120 274 Q 130 270 140 272 L 142 310 L 145 340 Q 142 348 138 352 L 125 352 Q 120 340 118 320 Q 118 295 120 274 Z M 180 274 Q 170 270 160 272 L 158 310 L 155 340 Q 158 348 162 352 L 175 352 Q 180 340 182 320 Q 182 295 180 274 Z',
  calves:
    'M 124 355 L 140 355 L 142 385 L 142 415 Q 140 428 138 435 L 125 435 Q 122 420 122 405 L 122 385 Z M 160 355 L 176 355 L 178 385 L 178 415 Q 176 428 175 435 L 162 435 Q 160 420 158 405 L 158 385 Z',
};

interface Props {
  regions: BodyRegion[];
  colors: { primary: string; hover: string; active: string };
  hoveredRegion: string | null;
  selectedRegion: string | null;
  onHover: (regionId: string | null) => void;
  onClick: (regionId: string) => void;
}

export function BodySvgBack({
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
      {/* Head */}
      <ellipse cx="150" cy="30" rx="22" ry="24" fill="#2a2a4a" stroke="#444" strokeWidth="1" />
      {Object.entries(BACK_PATHS).map(([id, path]) => {
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
      {/* Body outline */}
      <path
        d="M 150 54 Q 138 54 135 60 L 135 80 Q 125 82 115 85 Q 95 78 92 85 Q 88 92 88 100 L 85 130 Q 83 155 85 165 L 82 200 Q 80 220 82 230 L 120 235 Q 125 228 128 225 L 120 250 Q 118 265 120 275 Q 118 295 118 320 Q 120 340 122 355 L 120 385 Q 120 420 122 435 L 140 440 L 140 435 Q 142 425 145 405 L 145 385 L 145 355 Q 148 350 150 348 Q 152 350 155 355 L 155 385 L 155 405 Q 158 425 160 435 L 160 440 L 178 435 Q 180 420 180 385 L 178 355 Q 180 340 182 320 Q 182 295 180 275 Q 182 265 180 250 L 172 225 Q 175 228 180 235 L 218 230 Q 220 220 218 200 L 215 165 Q 217 155 215 130 L 212 100 Q 212 92 208 85 Q 205 78 185 85 Q 175 82 165 80 L 165 60 Q 162 54 150 54 Z"
        fill="none"
        stroke="#444"
        strokeWidth="1"
        pointerEvents="none"
      />
    </svg>
  );
}
