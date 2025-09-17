import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Expense } from '../../types'
import { generateId } from '../../utils'

interface ExpenseState {
  expenses: Expense[]
  isLoading: boolean
  error: string | null
}

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null
}

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Load expenses from localStorage
    loadExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
      state.isLoading = false
    },

    // Add new expense
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      const newExpense: Expense = {
        id: generateId(),
        ...action.payload
      }
      state.expenses.unshift(newExpense) // Add to beginning of array
    },

    // Update existing expense
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
    },

    // Delete expense
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload)
    },

    // Clear all expenses
    clearExpenses: (state) => {
      state.expenses = []
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const { loadExpenses, addExpense, updateExpense, deleteExpense, clearExpenses, setLoading, setError } =
  expenseSlice.actions

export default expenseSlice.reducer
