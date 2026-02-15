import { useEffect, useState } from 'react';
import type { Exercise, ExerciseType, Difficulty, LayerId } from '../../types';
import { useDataService } from '../../services/DataProvider';
import { ExerciseCard } from './ExerciseCard';
import './ExercisePanel.css';

interface Props {
  selectedRegion: string | null;
  activeLayer: LayerId;
  regionLabel: string | null;
}

const TYPES: ExerciseType[] = ['exercise', 'stretch'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function ExercisePanel({ selectedRegion, activeLayer, regionLabel }: Props) {
  const dataService = useDataService();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [typeFilter, setTypeFilter] = useState<ExerciseType | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);

  useEffect(() => {
    if (selectedRegion) {
      dataService.getExercises(selectedRegion, activeLayer).then(setExercises);
    } else {
      setExercises([]);
    }
  }, [dataService, selectedRegion, activeLayer]);

  useEffect(() => {
    setTypeFilter(null);
    setDifficultyFilter(null);
  }, [selectedRegion]);

  const filtered = exercises.filter((e) => {
    if (typeFilter && e.type !== typeFilter) return false;
    if (difficultyFilter && e.difficulty !== difficultyFilter) return false;
    return true;
  });

  if (!selectedRegion) {
    return (
      <div className="exercise-panel empty">
        <p>Click a body region to see exercises</p>
      </div>
    );
  }

  return (
    <div className="exercise-panel">
      <h2>{regionLabel ?? selectedRegion}</h2>

      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Type:</span>
          {TYPES.map((t) => (
            <button
              key={t}
              className={`filter-chip ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(typeFilter === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Level:</span>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`filter-chip ${difficultyFilter === d ? 'active' : ''}`}
              onClick={() =>
                setDifficultyFilter(difficultyFilter === d ? null : d)
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No exercises found for this filter.</p>
      ) : (
        <div className="exercise-list">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
