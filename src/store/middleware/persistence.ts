import { Middleware } from '@reduxjs/toolkit'

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)

  // Save to localStorage after state changes
  const state = store.getState()

  // Save expenses
  localStorage.setItem('budget-expenses', JSON.stringify(state.expenses.expenses))

  // Save settings
  localStorage.setItem('budget-settings', JSON.stringify(state.settings.settings))

  return result
}
