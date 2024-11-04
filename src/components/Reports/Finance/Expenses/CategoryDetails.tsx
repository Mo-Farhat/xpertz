import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

interface CategoryDetailsProps {
  categories: Record<string, number>;
  totalExpenses: number;
  colors: string[];
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ categories, totalExpenses, colors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount], index) => (
              <div key={category} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="font-medium">{category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {((amount / totalExpenses) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDetails;