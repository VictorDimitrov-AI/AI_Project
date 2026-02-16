import type { NutritionProfile, ActivityLevel, FitnessGoal, MacroTargets, MealPlan } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.35,
  moderate: 1.5,
  active: 1.65,
  very_active: 1.8,
};

/** Mifflin-St Jeor equation */
export function calculateBMR(profile: NutritionProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

const GOAL_CONFIGS: Record<FitnessGoal, { calAdjust: number; proteinPerKg: number; fatPerKg: number }> = {
  muscle_building: { calAdjust: 300, proteinPerKg: 2.0, fatPerKg: 1.0 },
  weight_loss: { calAdjust: -400, proteinPerKg: 1.6, fatPerKg: 0.8 },
  flexibility: { calAdjust: 0, proteinPerKg: 1.1, fatPerKg: 0.9 },
  general_fitness: { calAdjust: 0, proteinPerKg: 1.4, fatPerKg: 0.9 },
};

export function calculateMacroTargets(tdee: number, goal: FitnessGoal, weightKg: number): MacroTargets {
  const config = GOAL_CONFIGS[goal];
  const adjustedCalories = Math.round(tdee + config.calAdjust);
  const proteinGrams = Math.round(config.proteinPerKg * weightKg);
  const fatGrams = Math.round(config.fatPerKg * weightKg);
  const carbGrams = Math.round((adjustedCalories - proteinGrams * 4 - fatGrams * 9) / 4);

  return {
    calories: adjustedCalories,
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
}

export function getScaledPlan(targets: MacroTargets, goal: FitnessGoal, plans: MealPlan[]): MealPlan | null {
  const plan = plans.find((p) => p.goal === goal);
  if (!plan) return null;

  const ratio = targets.calories / plan.dailyTargets.calories;

  return {
    ...plan,
    dailyTargets: { ...targets },
    meals: plan.meals.map((meal) => ({
      ...meal,
      foods: meal.foods.map((food) => ({
        ...food,
        calories: Math.round(food.calories * ratio),
        protein: Math.round(food.protein * ratio * 10) / 10,
        carbs: Math.round(food.carbs * ratio * 10) / 10,
        fat: Math.round(food.fat * ratio * 10) / 10,
      })),
    })),
  };
}

export function convertImperialToMetric(
  heightFt: number,
  heightIn: number,
  weightLbs: number,
): { heightCm: number; weightKg: number } {
  return {
    heightCm: Math.round((heightFt * 12 + heightIn) * 2.54),
    weightKg: Math.round(weightLbs * 0.453592 * 10) / 10,
  };
}
