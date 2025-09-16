import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { loadExpenses } from './store/slices/expenseSlice';
import { loadSettings } from './store/slices/settingsSlice';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { ExpenseForm } from './components/ExpenseForm';
import { FilterForm } from './components/FilterForm';
import { Analytics } from './components/Analytics';
import { loadFromStorage, defaultSettings } from './utils';

function AppContent() {
  const dispatch = useAppDispatch();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = loadFromStorage('budget-expenses', []);
    const savedSettings = loadFromStorage('budget-settings', defaultSettings);
    
    dispatch(loadExpenses(savedExpenses));
    dispatch(loadSettings(savedSettings));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <KPICards />
        <ExpenseForm />
        <FilterForm />
        <Analytics />
        
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Data stored locally in your browser • Built with React & TypeScript</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;