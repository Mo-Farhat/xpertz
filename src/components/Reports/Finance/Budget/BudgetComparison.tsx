import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { BudgetData } from './types';
import BudgetSummary from './BudgetSummary';
import BudgetComparisonTable from './BudgetComparisonTable';

const BudgetComparison = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: [],
    expenses: [],
    summary: {
      totalBudgetedIncome: 0,
      totalActualIncome: 0,
      totalBudgetedExpenses: 0,
      totalActualExpenses: 0,
      netBudgetedIncome: 0,
      netActualIncome: 0
    }
  });

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!tenant?.id) return;

      try {
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);

        const [budgetSnapshot, actualSnapshot] = await Promise.all([
          getDocs(query(
            collection(db, `tenants/${tenant.id}/budgets`),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate))
          )),
          getDocs(query(
            collection(db, `tenants/${tenant.id}/transactions`),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate))
          ))
        ]);

        // Process budget data
        const budgetMap = new Map();
        budgetSnapshot.docs.forEach(doc => {
          const data = doc.data();
          budgetMap.set(data.category, {
            budgeted: data.amount,
            actual: 0,
            category: data.category,
            type: data.type
          });
        });

        // Process actual transactions
        actualSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (budgetMap.has(data.category)) {
            const item = budgetMap.get(data.category);
            item.actual += data.amount;
          }
        });

        // Calculate variances and create final data structure
        const income = [];
        const expenses = [];
        let totalBudgetedIncome = 0;
        let totalActualIncome = 0;
        let totalBudgetedExpenses = 0;
        let totalActualExpenses = 0;

        budgetMap.forEach(item => {
          const variance = item.actual - item.budgeted;
          const variancePercentage = (variance / item.budgeted) * 100;

          const finalItem = {
            category: item.category,
            budgeted: item.budgeted,
            actual: item.actual,
            variance,
            variancePercentage
          };

          if (item.type === 'income') {
            income.push(finalItem);
            totalBudgetedIncome += item.budgeted;
            totalActualIncome += item.actual;
          } else {
            expenses.push(finalItem);
            totalBudgetedExpenses += item.budgeted;
            totalActualExpenses += item.actual;
          }
        });

        setBudgetData({
          income,
          expenses,
          summary: {
            totalBudgetedIncome,
            totalActualIncome,
            totalBudgetedExpenses,
            totalActualExpenses,
            netBudgetedIncome: totalBudgetedIncome - totalBudgetedExpenses,
            netActualIncome: totalActualIncome - totalActualExpenses
          }
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
        toast({
          title: "Error",
          description: "Failed to load budget comparison data",
          variant: "destructive",
        });
      }
    };

    fetchBudgetData();
  }, [tenant, selectedMonth, selectedYear, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Budget vs. Actual Comparison</h3>
        <div className="flex gap-4">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <BudgetSummary data={budgetData} />

      <div className="space-y-6">
        <BudgetComparisonTable title="Income Categories" items={budgetData.income} />
        <BudgetComparisonTable title="Expense Categories" items={budgetData.expenses} />
      </div>
    </div>
  );
};

export default BudgetComparison;