import React from 'react';
import { Card, CardContent } from './ui/Card';
import { TrendingUp, Calendar, PieChart as PieChartIcon } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { formatMoney } from '../utils';

export function KPICards() {
  const { expenses } = useAppSelector((state) => state.expenses);
  const { settings } = useAppSelector((state) => state.settings);
  const { period, from, to } = useAppSelector((state) => state.filters);

  // Calculate filtered expenses (this logic should be moved to a selector)
  const filteredExpenses = expenses.filter((expense: any) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    switch (period) {
      case 'month':
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      case 'year':
        return expenseDate.getFullYear() === now.getFullYear();
      case 'range':
        if (!from || !to) return true;
        return expenseDate >= new Date(from) && expenseDate <= new Date(to);
      default:
        return true;
    }
  });

  const totalExpenses = filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  const categoryCount = new Set(filteredExpenses.map((e: any) => e.category)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatMoney(totalExpenses, settings.currency as 'USD' | 'EUR' | 'RUB')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{filteredExpenses.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Categories</p>
              <p className="text-2xl font-bold text-slate-900">{categoryCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}