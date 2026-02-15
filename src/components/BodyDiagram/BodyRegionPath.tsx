import './BodyDiagram.css';

interface Props {
  regionId: string;
  label: string;
  path: string;
  color: string;
  hoverColor: string;
  activeColor: string;
  isHovered: boolean;
  isSelected: boolean;
  dimmed: boolean;
  onHover: (regionId: string | null) => void;
  onClick: (regionId: string) => void;
}

export function BodyRegionPath({
  regionId,
  label,
  path,
  color,
  hoverColor,
  activeColor,
  isHovered,
  isSelected,
  dimmed,
  onHover,
  onClick,
}: Props) {
  const fillColor = isSelected ? activeColor : isHovered ? hoverColor : color;
  const opacity = dimmed ? 0.15 : isSelected ? 1 : isHovered ? 0.9 : 0.7;

  return (
    <g
      className="body-region-group"
      onMouseEnter={() => !dimmed && onHover(regionId)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !dimmed && onClick(regionId)}
      onKeyDown={(e) => {
        if (!dimmed && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(regionId);
        }
      }}
      tabIndex={dimmed ? -1 : 0}
      role="button"
      aria-label={label}
      aria-pressed={isSelected}
      style={{ cursor: dimmed ? 'default' : 'pointer' }}
    >
      <path
        d={path}
        fill={fillColor}
        opacity={opacity}
        stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
        strokeWidth={isSelected ? 2 : 1}
        className="body-region-path"
      />
      {!dimmed && (isHovered || isSelected) && (
        <text
          x={getPathCenter(path).x}
          y={getPathCenter(path).y}
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="600"
          pointerEvents="none"
          className="region-label"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function getPathCenter(path: string): { x: number; y: number } {
  // Parse a rough center from the path's M command and subsequent coordinates
  const nums = path.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) return { x: 0, y: 0 };

  const xVals: number[] = [];
  const yVals: number[] = [];
  for (let i = 0; i < Math.min(nums.length, 20); i += 2) {
    xVals.push(parseFloat(nums[i]));
    if (nums[i + 1]) yVals.push(parseFloat(nums[i + 1]));
  }

  const avgX = xVals.reduce((a, b) => a + b, 0) / xVals.length;
  const avgY = yVals.reduce((a, b) => a + b, 0) / yVals.length;
  return { x: avgX, y: avgY };
}
