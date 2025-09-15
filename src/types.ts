export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

export interface Settings {
  currency: 'USD' | 'EUR' | 'RUB';
  categories: string[];
  customCategories: CustomCategory[];
}

export type Period = 'month' | 'year' | 'range';

export interface DateRange {
  from: string;
  to: string;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface DayData {
  date: string;
  total: number;
}
