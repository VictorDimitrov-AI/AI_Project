import { useState } from 'react';
import type { Exercise } from '../../types';
import './ExercisePanel.css';

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`exercise-card ${expanded ? 'expanded' : ''}`}>
      <button
        className="exercise-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="exercise-title-row">
          <h4>{exercise.name}</h4>
          <div className="exercise-badges">
            <span className={`badge badge-${exercise.type}`}>{exercise.type}</span>
            <span className={`badge badge-${exercise.difficulty}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>
        <span className="expand-icon">{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>
      {expanded && (
        <div className="exercise-body">
          <p className="exercise-desc">{exercise.description}</p>
          <ol className="exercise-instructions">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
