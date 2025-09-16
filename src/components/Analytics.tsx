import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieChartIcon, BarChart3, Calendar, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteExpense } from '../store/slices/expenseSlice';
import { getExpensesByCategory, getExpensesByDay, getTotalExpenses, filterExpensesByDateRange, getDateRange } from '../utils';

export function Analytics() {
  const dispatch = useAppDispatch();
  const { expenses } = useAppSelector((state) => state.expenses);
  const { settings } = useAppSelector((state) => state.settings);
  const { period, from, to } = useAppSelector((state) => state.filters);

  // Calculate filtered expenses
  const dateRange = getDateRange(period, from, to);
  const filtered = filterExpensesByDateRange(expenses, dateRange.from, dateRange.to);
  const total = getTotalExpenses(filtered);
  const byCategory = getExpensesByCategory(filtered, settings.customCategories);
  const byDay = getExpensesByDay(filtered);

  const handleDeleteExpense = (id: string) => {
    dispatch(deleteExpense(id));
  };

  return (
    <Tabs defaultValue="byCategory" className="w-full">
      <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-6">
        <TabsTrigger value="byCategory" className="gap-2">
          <PieChartIcon className="h-4 w-4" />
          By Category
        </TabsTrigger>
        <TabsTrigger value="timeline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="table">Transactions</TabsTrigger>
      </TabsList>

      <TabsContent value="byCategory">
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {byCategory.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No expenses for the selected period</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byCategory}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        innerRadius={40}
                      >
                        {byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatMoney(Number(value), settings.currency as 'USD' | 'EUR' | 'RUB')} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
                  {byCategory.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{cat.name}</p>
                        <p className="text-sm text-slate-600">
                          {((cat.value / total) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatMoney(cat.value, settings.currency as 'USD' | 'EUR' | 'RUB')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {byDay.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data for timeline chart</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={byDay} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatMoney(value, settings.currency as 'USD' | 'EUR' | 'RUB')} />
                    <Tooltip formatter={(value: any) => formatMoney(Number(value), settings.currency as 'USD' | 'EUR' | 'RUB')} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="table">
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Category</th>
                      <th className="text-left px-6 py-3 font-medium">Note</th>
                      <th className="text-right px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((expense: any) => (
                      <tr key={expense.id} className="border-t hover:bg-slate-50/60">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {expense.note || '—'}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          {formatMoney(expense.amount, settings.currency as 'USD' | 'EUR' | 'RUB')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Helper function for formatting money
function formatMoney(amount: number, currency: 'USD' | 'EUR' | 'RUB'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
