import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Filter, PieChart as PieChartIcon, BarChart3, Trash2, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { Expense, Settings, Period } from './types';
import { CategoryManagement } from './components/CategoryManagement';
import { 
  formatMoney, 
  generateId, 
  getDateRange, 
  filterExpensesByDateRange, 
  getExpensesByCategory, 
  getExpensesByDay, 
  getTotalExpenses,
  loadFromStorage,
  saveToStorage,
  defaultSettings,
  CURRENCY_SYMBOLS
} from './utils';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [period, setPeriod] = useState<Period>('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = loadFromStorage<Expense[]>('budget-expenses', []);
    const savedSettings = loadFromStorage<Settings>('budget-settings', defaultSettings);
    setExpenses(savedExpenses);
    setSettings(savedSettings);
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    saveToStorage('budget-expenses', expenses);
  }, [expenses]);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    saveToStorage('budget-settings', settings);
  }, [settings]);

  // Get filtered expenses based on selected period
  const dateRange = getDateRange(period, from, to);
  const filtered = filterExpensesByDateRange(expenses, dateRange.from, dateRange.to);
  const total = getTotalExpenses(filtered);
  const byCategory = getExpensesByCategory(filtered, settings.customCategories);
  const byDay = getExpensesByDay(filtered);

  const addExpense = () => {
    if (!amount || !category) return;

    const newExpense: Expense = {
      id: generateId(),
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim() || undefined,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setCategory('');
    setNote('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getAllCategories = () => {
    const defaultCategories = settings.categories.map(name => ({ name, color: '#6B7280' }));
    const customCategories = settings.customCategories.map(cat => ({ name: cat.name, color: cat.color }));
    return [...defaultCategories, ...customCategories];
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Budget Tracker</h1>
          </div>
          <p className="text-slate-600">Track your expenses and analyze your spending patterns</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-slate-900">{formatMoney(total, settings.currency)}</p>
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
                  <p className="text-2xl font-bold text-slate-900">{filtered.length}</p>
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
                  <p className="text-2xl font-bold text-slate-900">{byCategory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Form */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Add New Expense</CardTitle>
              </div>
              <CategoryManagement 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="amount">Amount ({CURRENCY_SYMBOLS[settings.currency]})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCategories().map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Lunch with colleagues"
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={addExpense} className="mt-4 gap-2" disabled={!amount || !category}>
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Period Filter */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filter Period</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(value: string) => setPeriod(value as Period)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="range">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  disabled={period !== 'range'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={period !== 'range'}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-slate-600">
                View statistics in the tabs below.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
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
                          <Tooltip formatter={(value: any) => formatMoney(Number(value), settings.currency)} />
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
                            {formatMoney(cat.value, settings.currency)}
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
                        <YAxis tickFormatter={(value) => formatMoney(value, settings.currency)} />
                        <Tooltip formatter={(value: any) => formatMoney(Number(value), settings.currency)} />
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
                        {filtered.map((expense) => (
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
                              {formatMoney(expense.amount, settings.currency)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteExpense(expense.id)}
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

        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Data stored locally in your browser • Built with React & TypeScript</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
