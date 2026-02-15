import type { BodyView } from '../../types';
import './ViewToggle.css';

interface Props {
  activeView: BodyView;
  onViewChange: (view: BodyView) => void;
}

export function ViewToggle({ activeView, onViewChange }: Props) {
  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${activeView === 'front' ? 'active' : ''}`}
        onClick={() => onViewChange('front')}
      >
        Front
      </button>
      <button
        className={`view-btn ${activeView === 'back' ? 'active' : ''}`}
        onClick={() => onViewChange('back')}
      >
        Back
      </button>
    </div>
  );
}
