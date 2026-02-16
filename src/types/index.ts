export type BodyView = 'front' | 'back';
export type ExerciseType = 'exercise' | 'stretch';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface BodyRegion {
  id: string;
  label: string;
  view: BodyView;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  targetArea: string;
  type: ExerciseType;
  difficulty: Difficulty;
  instructions: string[];
}

export type FitnessGoal = 'muscle_building' | 'weight_loss' | 'flexibility' | 'general_fitness';
export type EquipmentLevel = 'bodyweight' | 'dumbbells' | 'full_gym';
export type SessionDuration = 15 | 30 | 45 | 60;

export interface QuizAnswers {
  goal: FitnessGoal;
  experienceLevel: Difficulty;
  equipment: EquipmentLevel;
  sessionDuration: SessionDuration;
  targetAreas: string[];
}

export interface WorkoutExerciseSlot {
  exercise: Exercise;
  sets: number;
  reps: string;
  rest: string;
}

export interface GeneratedWorkout {
  title: string;
  subtitle: string;
  slots: WorkoutExerciseSlot[];
  totalEstimatedMinutes: number;
}

export type FoodCategory = 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits' | 'dairy';

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealFood {
  foodId: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  foods: MealFood[];
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlan {
  id: string;
  goal: FitnessGoal;
  title: string;
  description: string;
  dailyTargets: MacroTargets;
  meals: Meal[];
}

export interface IDataService {
  getBodyRegions(view: BodyView): Promise<BodyRegion[]>;
  getExercises(regionId: string, type: ExerciseType): Promise<Exercise[]>;
  getAllExercises(): Promise<Exercise[]>;
  getAllFoods(): Promise<Food[]>;
  getMealPlans(): Promise<MealPlan[]>;
}
