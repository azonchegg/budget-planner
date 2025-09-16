import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addExpense } from '../store/slices/expenseSlice';
import { CURRENCY_SYMBOLS } from '../utils';
import { CategoryManagement } from './CategoryManagement';

export function ExpenseForm() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const getAllCategories = () => {
    const defaultCategories = settings.categories.map((name: string) => ({ name, color: '#6B7280' }));
    const customCategories = settings.customCategories.map((cat: any) => ({ name: cat.name, color: cat.color }));
    return [...defaultCategories, ...customCategories];
  };

  const handleAddExpense = () => {
    if (!amount || !category) return;

    dispatch(addExpense({
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim() || undefined,
    }));

    // Reset form
    setAmount('');
    setCategory('');
    setNote('');
  };

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Add New Expense</CardTitle>
          </div>
          <CategoryManagement />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="amount">Amount ({CURRENCY_SYMBOLS[settings.currency as keyof typeof CURRENCY_SYMBOLS]})</Label>
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
        <Button onClick={handleAddExpense} className="mt-4 gap-2" disabled={!amount || !category}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </CardContent>
    </Card>
  );
}
