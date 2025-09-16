import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPeriod, setFromDate, setToDate } from '../store/slices/filterSlice';
import { Period } from '../types';

export function FilterForm() {
  const dispatch = useAppDispatch();
  const { period, from, to } = useAppSelector((state) => state.filters);

  const handlePeriodChange = (value: string) => {
    dispatch(setPeriod(value as Period));
  };

  const handleFromChange = (value: string) => {
    dispatch(setFromDate(value));
  };

  const handleToChange = (value: string) => {
    dispatch(setToDate(value));
  };

  return (
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
            <Select value={period} onValueChange={handlePeriodChange}>
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
              onChange={(e) => handleFromChange(e.target.value)}
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
              onChange={(e) => handleToChange(e.target.value)}
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
  );
}
