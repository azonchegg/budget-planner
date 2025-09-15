# Budget Tracker

A modern, responsive budget tracking application built with React and TypeScript. Track your expenses, categorize spending, and analyze your financial patterns with beautiful charts and statistics.

## Features

- **Expense Management**: Add, edit, and delete expenses with categories and notes
- **Category System**: Pre-defined categories for different types of spending
- **Period Filtering**: View expenses by month, year, or custom date range
- **Visual Analytics**: 
  - Pie chart showing spending by category
  - Timeline chart showing daily spending trends
  - Transaction table with full details
- **Data Persistence**: All data stored locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Technologies Used

- **React 19** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, responsive charts
- **Radix UI** - Accessible UI components
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation utilities

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. **Add Expenses**: Fill out the form with amount, category, date, and optional note
2. **Filter Data**: Use the period filter to view expenses for specific time ranges
3. **View Analytics**: Switch between different tabs to see:
   - Category breakdown with pie chart
   - Daily spending timeline
   - Detailed transaction list
4. **Manage Data**: Delete individual transactions as needed

## Data Storage

All data is stored locally in your browser's localStorage, so your information stays private and doesn't leave your device.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)
