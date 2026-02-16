import type { IDataService, BodyRegion, BodyView, Exercise, ExerciseType, Food, MealPlan } from '../types';
import bodyRegionsData from '../data/bodyRegions.json';
import exercisesData from '../data/exercises.json';
import foodsData from '../data/foods.json';
import mealPlansData from '../data/mealPlans.json';

export class StaticDataService implements IDataService {
  async getBodyRegions(view: BodyView): Promise<BodyRegion[]> {
    return (bodyRegionsData as BodyRegion[]).filter((r) => r.view === view);
  }

  async getExercises(regionId: string, type: ExerciseType): Promise<Exercise[]> {
    return (exercisesData as Exercise[]).filter(
      (e) => e.targetArea === regionId && e.type === type
    );
  }

  async getAllExercises(): Promise<Exercise[]> {
    return exercisesData as Exercise[];
  }

  async getAllFoods(): Promise<Food[]> {
    return foodsData as Food[];
  }

  async getMealPlans(): Promise<MealPlan[]> {
    return mealPlansData as unknown as MealPlan[];
  }
}
