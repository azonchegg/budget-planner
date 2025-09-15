import { Card, CardContent } from './ui/Card'
import { Calendar, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'
import React from 'react'

export function KPICards({expenses, transactions, categories}: {expenses: string, transactions: string, categories: string}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-600"/>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-slate-900">{expenses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600"/>
            </div>
            <div>
              <p className="text-sm text-slate-600">Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{transactions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-green-600"/>
            </div>
            <div>
              <p className="text-sm text-slate-600">Categories</p>
              <p className="text-2xl font-bold text-slate-900">{categories}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}