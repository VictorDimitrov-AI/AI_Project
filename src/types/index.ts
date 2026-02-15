export type LayerId = 'muscular' | 'skeletal' | 'nervous' | 'cardiovascular';
export type BodyView = 'front' | 'back';
export type ExerciseType = 'exercise' | 'stretch';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Layer {
  id: LayerId;
  name: string;
  colors: {
    primary: string;
    hover: string;
    active: string;
  };
}

export interface BodyRegion {
  id: string;
  label: string;
  view: BodyView;
  layers: LayerId[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  targetArea: string;
  type: ExerciseType;
  difficulty: Difficulty;
  instructions: string[];
  layers: LayerId[];
}

export interface IDataService {
  getLayers(): Promise<Layer[]>;
  getBodyRegions(view: BodyView, layer: LayerId): Promise<BodyRegion[]>;
  getExercises(regionId: string, layer: LayerId): Promise<Exercise[]>;
}
