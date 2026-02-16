import { useState, useEffect } from 'react';
import type { MealPlan } from '../../types';
import { useDataService } from '../../services/DataProvider';

export function MealPlanView() {
  const dataService = useDataService();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    dataService.getMealPlans().then(setPlans);
  }, [dataService]);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="meal-plan-cards">
      {plans.map((plan) => {
        const isExpanded = expandedId === plan.id;
        return (
          <div
            key={plan.id}
            className={`meal-plan-card${isExpanded ? ' expanded' : ''}`}
          >
            <div className="meal-plan-header" onClick={() => toggle(plan.id)}>
              <h3>{plan.title}</h3>
              <span className="chevron">&#9660;</span>
            </div>
            {isExpanded && (
              <>
                <p className="meal-plan-description">{plan.description}</p>
                <div className="macro-targets">
                  <span className="macro-badge calories">
                    {plan.dailyTargets.calories} kcal
                  </span>
                  <span className="macro-badge protein">
                    {plan.dailyTargets.protein}g protein
                  </span>
                  <span className="macro-badge carbs">
                    {plan.dailyTargets.carbs}g carbs
                  </span>
                  <span className="macro-badge fat">
                    {plan.dailyTargets.fat}g fat
                  </span>
                </div>
                {plan.meals.map((meal) => (
                  <div key={meal.name} className="meal-section">
                    <h4>{meal.name}</h4>
                    <ul className="meal-food-list">
                      {meal.foods.map((food) => (
                        <li key={food.foodId} className="meal-food-item">
                          <span className="meal-food-name">
                            {food.amount} — {food.foodId.replace(/-/g, ' ')}
                          </span>
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
