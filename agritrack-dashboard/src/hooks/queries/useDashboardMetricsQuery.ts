import { useMemo } from 'react';
import { useExpensesQuery } from './useExpensesQuery';
import { useIncomeQuery } from './useIncomeQuery';

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  incomeChange: number;
  expenseChange: number;
}

/**
 * React Query hook for dashboard metrics with automatic caching
 * Leverages cached data from expenses and income queries
 */
export const useDashboardMetricsQuery = () => {
  const { data: expenses = [], isLoading: expensesLoading } = useExpensesQuery();
  const { data: income = [], isLoading: incomeLoading } = useIncomeQuery();

  const metrics = useMemo<DashboardMetrics>(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalIncome = income.reduce((sum, inc) => sum + Number(inc.amount), 0);
    const profit = totalIncome - totalExpenses;

    // Calculate month-over-month changes
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    }).reduce((sum, exp) => sum + Number(exp.amount), 0);

    const lastMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
    }).reduce((sum, exp) => sum + Number(exp.amount), 0);

    const currentMonthIncome = income.filter(inc => {
      const incDate = new Date(inc.date);
      return incDate.getMonth() === currentMonth && incDate.getFullYear() === currentYear;
    }).reduce((sum, inc) => sum + Number(inc.amount), 0);

    const lastMonthIncome = income.filter(inc => {
      const incDate = new Date(inc.date);
      return incDate.getMonth() === lastMonth && incDate.getFullYear() === lastMonthYear;
    }).reduce((sum, inc) => sum + Number(inc.amount), 0);

    const expenseChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    const incomeChange = lastMonthIncome > 0 
      ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : 0;

    return {
      totalIncome,
      totalExpenses,
      profit,
      incomeChange: Number(incomeChange.toFixed(1)),
      expenseChange: Number(expenseChange.toFixed(1)),
    };
  }, [expenses, income]);

  return {
    metrics,
    isLoading: expensesLoading || incomeLoading,
  };
};
