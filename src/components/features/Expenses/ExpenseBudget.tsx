import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "../../hooks/use-toast";

interface ExpenseData {
    id: string;
    date: Date;
    category: string;
    amount: number;
  }
  
  const ExpenseBudget: React.FC = () => {
    const { toast } = useToast();
    const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [totalBudget] = useState(100000); // Example budget
  
    useEffect(() => {
      const fetchExpenses = async () => {
        setIsLoading(true);
        try {
          const q = query(collection(db, 'expenses'));
          const snapshot = await getDocs(q);
          
          const expensesData: ExpenseData[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              category: data.category || 'Uncategorized',
              amount: Number(data.amount) || 0,
              date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
            };
          });
  
          setExpenses(expensesData);
          const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
          setTotalSpent(total);
        } catch (error) {
          console.error('Error fetching expenses:', error);
          toast({
            title: "Error",
            description: "Failed to load expense data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchExpenses();
    }, [timeframe, toast]);
  
    // Group expenses by category for the chart
    const categoryData = expenses.reduce((acc: { category: string; amount: number }[], expense) => {
      const existingCategory = acc.find(item => item.category === expense.category);
      if (existingCategory) {
        existingCategory.amount += expense.amount;
      } else {
        acc.push({
          category: expense.category,
          amount: expense.amount
        });
      }
      return acc;
    }, []);
  
    const percentageUsed = (totalSpent / totalBudget) * 100;
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Budget Overview</h3>
          <Select 
            value={timeframe} 
            onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeframe(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Budget: ${totalBudget.toLocaleString()}</span>
                <span>Spent: ${totalSpent.toLocaleString()}</span>
              </div>
              <Progress value={percentageUsed} className="h-2" />
              <div className="text-sm text-gray-500">
                {percentageUsed.toFixed(1)}% of budget used
              </div>
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4">Expenses by Category</h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default ExpenseBudget;