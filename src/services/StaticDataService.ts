import type { IDataService, Layer, BodyRegion, BodyView, LayerId, Exercise } from '../types';
import layersData from '../data/layers.json';
import bodyRegionsData from '../data/bodyRegions.json';
import exercisesData from '../data/exercises.json';

export class StaticDataService implements IDataService {
  async getLayers(): Promise<Layer[]> {
    return layersData as Layer[];
  }

  async getBodyRegions(view: BodyView, layer: LayerId): Promise<BodyRegion[]> {
    return (bodyRegionsData as BodyRegion[]).filter(
      (r) => r.view === view && r.layers.includes(layer)
    );
  }

  async getExercises(regionId: string, layer: LayerId): Promise<Exercise[]> {
    return (exercisesData as Exercise[]).filter(
      (e) => e.targetArea === regionId && e.layers.includes(layer)
    );
  }
}
