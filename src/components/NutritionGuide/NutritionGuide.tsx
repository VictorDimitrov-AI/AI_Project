import { useState } from 'react';
import { FoodDatabase } from './FoodDatabase';
import { NutritionCalculator } from './NutritionCalculator';
import './NutritionGuide.css';

type NutritionTab = 'generator' | 'foods';

export function NutritionGuide() {
  const [activeTab, setActiveTab] = useState<NutritionTab>('generator');

  return (
    <div className="nutrition-guide">
      <nav className="nutrition-subnav">
        <button
          className={`subnav-btn${activeTab === 'generator' ? ' active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Meal Plan Generator
        </button>
        <button
          className={`subnav-btn${activeTab === 'foods' ? ' active' : ''}`}
          onClick={() => setActiveTab('foods')}
        >
          Food Database
        </button>
      </nav>
      {activeTab === 'generator' && <NutritionCalculator />}
      {activeTab === 'foods' && <FoodDatabase />}
    </div>
  );
}
