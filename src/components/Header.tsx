import { Wallet } from 'lucide-react'
import React from "react";

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary rounded-lg">
          <Wallet className="h-6 w-6 text-primary-foreground"/>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Budget Tracker</h1>
      </div>
      <p className="text-slate-600">Track your expenses and analyze your spending patterns</p>
    </div>
  )
}