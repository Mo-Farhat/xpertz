import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { CategorySummary } from './types';

interface CategorySummaryProps {
  category: CategorySummary;
}

const CategorySummaryCard = ({ category }: CategorySummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {category.accounts.map((account) => (
            <div key={account.accountNumber} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{account.accountNumber} - {account.accountName}</p>
                <p className="text-sm text-gray-500">
                  Debits: ${account.totalDebits.toFixed(2)} | Credits: ${account.totalCredits.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(account.balance).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center font-bold">
              <span>Category Total</span>
              <span className={category.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${Math.abs(category.balance).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySummaryCard;