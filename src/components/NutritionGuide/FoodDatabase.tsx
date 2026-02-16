import { useState, useEffect, useMemo } from 'react';
import type { Food, FoodCategory } from '../../types';
import { useDataService } from '../../services/DataProvider';

const CATEGORIES: FoodCategory[] = ['protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy'];

type SortKey = 'name' | 'calories' | 'protein' | 'carbs' | 'fat';

export function FoodDatabase() {
  const dataService = useDataService();
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    dataService.getAllFoods().then(setFoods);
  }, [dataService]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'name');
    }
  };

  const filtered = useMemo(() => {
    let result = foods;
    if (activeCategory) {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [foods, search, activeCategory, sortKey, sortAsc]);

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (
      <span className="sort-arrow">{sortAsc ? '▲' : '▼'}</span>
    ) : null;

  return (
    <div>
      <div className="food-db-controls">
        <input
          className="food-search"
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="category-filters">
          <button
            className={`category-btn${activeCategory === null ? ' active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <table className="food-table">
        <thead>
          <tr>
            <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => handleSort('name')}>
              Food{sortArrow('name')}
            </th>
            <th className={sortKey === 'calories' ? 'sorted' : ''} onClick={() => handleSort('calories')}>
              Cal{sortArrow('calories')}
            </th>
            <th className={sortKey === 'protein' ? 'sorted' : ''} onClick={() => handleSort('protein')}>
              Protein{sortArrow('protein')}
            </th>
            <th className={sortKey === 'carbs' ? 'sorted' : ''} onClick={() => handleSort('carbs')}>
              Carbs{sortArrow('carbs')}
            </th>
            <th className={sortKey === 'fat' ? 'sorted' : ''} onClick={() => handleSort('fat')}>
              Fat{sortArrow('fat')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((food) => (
            <tr key={food.id}>
              <td>
                {food.name}
                <br />
                <small style={{ color: '#666' }}>{food.servingSize}</small>
              </td>
              <td>{food.calories}</td>
              <td className="protein">{food.protein}g</td>
              <td className="carbs">{food.carbs}g</td>
              <td className="fat">{food.fat}g</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="food-count">{filtered.length} foods</p>
    </div>
  );
}
