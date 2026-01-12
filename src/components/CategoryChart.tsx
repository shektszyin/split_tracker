import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense, CategoryItem } from '../types';

interface CategoryChartProps {
  expenses: Expense[];
  categories: CategoryItem[];
  getCategoryColor: (name: string) => string;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ expenses, categories, getCategoryColor }) => {
  if (expenses.length === 0) return null;

  // Aggregate based on the current available categories + any old ones existing in expenses
  const allCategoryNames = Array.from(new Set([
    ...categories.map(c => c.name),
    ...expenses.map(e => e.category)
  ]));

  const data = allCategoryNames.map((catName) => {
    const value = expenses
      .filter((e) => e.category === catName)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: catName, value };
  }).filter(item => item.value > 0);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2 px-2">
         <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Spending Breakdown</h3>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '16px', 
                color: '#f1f5f9',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 500 }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 mt-2">
          {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(entry.name) }}></div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{entry.name}</span>
              </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryChart;
