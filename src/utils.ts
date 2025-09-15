import { Expense, CategoryData, DayData, Settings, CustomCategory } from './types';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, isWithinInterval } from 'date-fns';

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  RUB: '₽'
};

export function formatMoney(amount: number, currency: keyof typeof CURRENCY_SYMBOLS): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getDateRange(period: 'month' | 'year' | 'range', from?: string, to?: string): { from: string; to: string } {
  const now = new Date();
  
  switch (period) {
    case 'month':
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd')
      };
    case 'year':
      return {
        from: format(startOfYear(now), 'yyyy-MM-dd'),
        to: format(endOfYear(now), 'yyyy-MM-dd')
      };
    case 'range':
      return {
        from: from || format(startOfMonth(now), 'yyyy-MM-dd'),
        to: to || format(endOfMonth(now), 'yyyy-MM-dd')
      };
    default:
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd')
      };
  }
}

export function filterExpensesByDateRange(expenses: Expense[], from: string, to: string): Expense[] {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: fromDate, end: toDate });
  });
}

export function getExpensesByCategory(expenses: Expense[], customCategories: CustomCategory[] = []): CategoryData[] {
  const categoryMap = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = categoryMap.get(expense.category) || 0;
    categoryMap.set(expense.category, current + expense.amount);
  });
  
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  
  return Array.from(categoryMap.entries()).map(([name, value], index) => {
    const customCategory = customCategories.find(cat => cat.name === name);
    return {
      name,
      value,
      color: customCategory ? customCategory.color : defaultColors[index % defaultColors.length]
    };
  });
}

export function getExpensesByDay(expenses: Expense[]): DayData[] {
  const dayMap = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = dayMap.get(expense.date) || 0;
    dayMap.set(expense.date, current + expense.amount);
  });
  
  return Array.from(dayMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export const defaultSettings: Settings = {
  currency: 'USD',
  categories: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other'
  ],
  customCategories: []
};
