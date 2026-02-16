import { useState } from 'react';
import { MealPlanView } from './MealPlanView';
import { FoodDatabase } from './FoodDatabase';
import './NutritionGuide.css';

type NutritionTab = 'plans' | 'foods';

export function NutritionGuide() {
  const [activeTab, setActiveTab] = useState<NutritionTab>('plans');

  return (
    <div className="nutrition-guide">
      <nav className="nutrition-subnav">
        <button
          className={`subnav-btn${activeTab === 'plans' ? ' active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Meal Plans
        </button>
        <button
          className={`subnav-btn${activeTab === 'foods' ? ' active' : ''}`}
          onClick={() => setActiveTab('foods')}
        >
          Food Database
        </button>
      </nav>
      {activeTab === 'plans' ? <MealPlanView /> : <FoodDatabase />}
    </div>
  );
}
