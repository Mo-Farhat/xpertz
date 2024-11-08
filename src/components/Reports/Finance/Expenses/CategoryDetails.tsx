import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

interface CategoryDetailsProps {
  categories: Record<string, number>;
  totalExpenses: number;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ categories, totalExpenses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{category}</span>
                  <p className="text-sm text-gray-500">
                    {((amount / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDetails;