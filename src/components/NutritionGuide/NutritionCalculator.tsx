import { useState, useEffect } from 'react';
import type { Sex, ActivityLevel, FitnessGoal, MacroTargets, MealPlan } from '../../types';
import { useDataService } from '../../services/DataProvider';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacroTargets,
  getScaledPlan,
  convertImperialToMetric,
} from '../../services/nutritionCalculator';
import { QuizStep } from '../WorkoutBuilder/QuizStep';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male', description: 'Biological male for BMR calculation' },
  { value: 'female', label: 'Female', description: 'Biological female for BMR calculation' },
];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 'light', label: 'Light', description: 'Light exercise 1–3 days per week' },
  { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3–5 days per week' },
  { value: 'active', label: 'Active', description: 'Hard exercise 6–7 days per week' },
  { value: 'very_active', label: 'Very Active', description: 'Intense training or physical job' },
];

const GOAL_OPTIONS = [
  { value: 'muscle_building', label: 'Build Muscle', description: 'Calorie surplus for muscle growth' },
  { value: 'weight_loss', label: 'Lose Weight', description: 'Calorie deficit for fat loss' },
  { value: 'flexibility', label: 'Flexibility', description: 'Maintenance calories for recovery focus' },
  { value: 'general_fitness', label: 'General Fitness', description: 'Balanced maintenance plan' },
];

type Units = 'metric' | 'imperial';

export function NutritionCalculator() {
  const dataService = useDataService();
  const [step, setStep] = useState(0);
  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState('');
  const [units, setUnits] = useState<Units>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const [results, setResults] = useState<{ tdee: number; targets: MacroTargets; plan: MealPlan | null } | null>(null);
  const [plans, setPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    dataService.getMealPlans().then(setPlans);
  }, [dataService]);

  const totalSteps = 4;

  const handleBodyStatsNext = () => {
    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum < 10 || ageNum > 120) return;

    let hCm: number;
    let wKg: number;

    if (units === 'metric') {
      hCm = parseFloat(heightCm);
      wKg = parseFloat(weightKg);
    } else {
      const converted = convertImperialToMetric(
        parseFloat(heightFt) || 0,
        parseFloat(heightIn) || 0,
        parseFloat(weightLbs) || 0,
      );
      hCm = converted.heightCm;
      wKg = converted.weightKg;
    }

    if (!hCm || hCm < 100 || hCm > 250) return;
    if (!wKg || wKg < 30 || wKg > 300) return;

    setHeightCm(String(hCm));
    setWeightKg(String(wKg));
    setStep(2);
  };

  const computeResults = (selectedGoal: FitnessGoal) => {
    const profile = {
      sex: sex!,
      age: parseInt(age, 10),
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      activityLevel: activityLevel!,
      goal: selectedGoal,
    };
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const targets = calculateMacroTargets(tdee, selectedGoal, profile.weightKg);
    const plan = getScaledPlan(targets, selectedGoal, plans);
    setResults({ tdee, targets, plan });
  };

  const handleStartOver = () => {
    setStep(0);
    setSex(null);
    setAge('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeightKg('');
    setWeightLbs('');
    setActivityLevel(null);
    setGoal(null);
    setResults(null);
  };

  if (results) {
    const { tdee, targets, plan } = results;
    return (
      <div className="calc-results">
        <h2 className="calc-results-title">Your Nutrition Profile</h2>
        <div className="calc-tdee-card">
          <span className="calc-tdee-label">Daily Energy Expenditure (TDEE)</span>
          <span className="calc-tdee-value">{tdee} kcal</span>
        </div>

        <div className="calc-macros-grid">
          <div className="calc-macro-card">
            <span className="calc-macro-value">{targets.calories}</span>
            <span className="calc-macro-label">Calories</span>
          </div>
          <div className="calc-macro-card protein">
            <span className="calc-macro-value">{targets.protein}g</span>
            <span className="calc-macro-label">Protein</span>
          </div>
          <div className="calc-macro-card carbs">
            <span className="calc-macro-value">{targets.carbs}g</span>
            <span className="calc-macro-label">Carbs</span>
          </div>
          <div className="calc-macro-card fat">
            <span className="calc-macro-value">{targets.fat}g</span>
            <span className="calc-macro-label">Fat</span>
          </div>
        </div>

        {plan && (
          <div className="calc-scaled-plan">
            <h3>Scaled Meal Plan — {plan.title}</h3>
            {plan.meals.map((meal) => (
              <div key={meal.name} className="calc-meal-section">
                <h4>{meal.name}</h4>
                <ul className="meal-food-list">
                  {meal.foods.map((food) => (
                    <li key={food.foodId} className="meal-food-item">
                      <span className="meal-food-name">{food.foodId.replace(/-/g, ' ')} — {food.amount}</span>
                      <span className="meal-food-macros">
                        <span>{food.calories} cal</span>
                        <span className="protein">{food.protein}g P</span>
                        <span className="carbs">{food.carbs}g C</span>
                        <span className="fat">{food.fat}g F</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <button className="start-over-btn" onClick={handleStartOver}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="nutrition-calculator">
      <div className="progress-dots">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`dot${i === step ? ' active' : ''}${i < step ? ' completed' : ''}`}
          />
        ))}
      </div>

      {step === 0 && (
        <QuizStep
          question="What is your biological sex?"
          options={SEX_OPTIONS}
          selectedValue={sex ?? undefined}
          onSelect={(v) => {
            setSex(v as Sex);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <div className="quiz-step">
          <h2 className="quiz-question">Enter your body stats</h2>

          <div className="unit-toggle">
            <button
              className={`unit-btn${units === 'metric' ? ' selected' : ''}`}
              onClick={() => setUnits('metric')}
            >
              Metric
            </button>
            <button
              className={`unit-btn${units === 'imperial' ? ' selected' : ''}`}
              onClick={() => setUnits('imperial')}
            >
              Imperial
            </button>
          </div>

          <div className="calc-field">
            <label className="field-label">Age</label>
            <input
              type="number"
              className="calc-input"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={10}
              max={120}
            />
          </div>

          {units === 'metric' ? (
            <>
              <div className="calc-field">
                <label className="field-label">Height (cm)</label>
                <input
                  type="number"
                  className="calc-input"
                  placeholder="e.g. 180"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
              </div>
              <div className="calc-field">
                <label className="field-label">Weight (kg)</label>
                <input
                  type="number"
                  className="calc-input"
                  placeholder="e.g. 80"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="calc-field">
                <label className="field-label">Height</label>
                <div className="calc-input-row">
                  <input
                    type="number"
                    className="calc-input"
                    placeholder="ft"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                  />
                  <input
                    type="number"
                    className="calc-input"
                    placeholder="in"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                  />
                </div>
              </div>
              <div className="calc-field">
                <label className="field-label">Weight (lbs)</label>
                <input
                  type="number"
                  className="calc-input"
                  placeholder="e.g. 176"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
              </div>
            </>
          )}

          <button className="generate-btn" onClick={handleBodyStatsNext}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <QuizStep
          question="What's your activity level?"
          options={ACTIVITY_OPTIONS}
          selectedValue={activityLevel ?? undefined}
          onSelect={(v) => {
            setActivityLevel(v as ActivityLevel);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <QuizStep
          question="What's your nutrition goal?"
          options={GOAL_OPTIONS}
          selectedValue={goal ?? undefined}
          onSelect={(v) => {
            const g = v as FitnessGoal;
            setGoal(g);
            computeResults(g);
          }}
        />
      )}

      {step > 0 && (
        <button className="back-btn" onClick={() => setStep(step - 1)}>
          ← Back
        </button>
      )}
    </div>
  );
}
