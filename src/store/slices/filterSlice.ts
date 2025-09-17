import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Period } from '../../types'

interface FilterState {
  period: Period
  from: string
  to: string
  selectedCategory: string
}

const initialState: FilterState = {
  period: 'month',
  from: '',
  to: '',
  selectedCategory: ''
}

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Update period filter
    setPeriod: (state, action: PayloadAction<Period>) => {
      state.period = action.payload
    },

    // Update from date
    setFromDate: (state, action: PayloadAction<string>) => {
      state.from = action.payload
    },

    // Update to date
    setToDate: (state, action: PayloadAction<string>) => {
      state.to = action.payload
    },

    // Update selected category
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },

    // Reset all filters
    resetFilters: (state) => {
      state.period = 'month'
      state.from = ''
      state.to = ''
      state.selectedCategory = ''
    }
  }
})

export const { setPeriod, setFromDate, setToDate, setSelectedCategory, resetFilters } = filterSlice.actions

export default filterSlice.reducer
