import { TrendingUp, TrendingDown, Banknote, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useExpenses } from "@/hooks/useExpenses";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useDefaultFarm } from "@/hooks/useFarm";

export default function Dashboard() {
  const { farmId, loading: farmLoading, error: farmError } = useDefaultFarm();
  const { expenses = [], loading: expensesLoading, error: expensesError } = useExpenses();
  const [metrics, setMetrics] = useState({ totalIncome: 0, totalExpenses: 0, profit: 0, incomeChange: 0, expenseChange: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!farmId) {
        setMetricsLoading(false);
        return;
      }
      try {
        setMetricsError(null);
        const response = await api.dashboard.getMetrics(farmId);
        setMetrics(response.data.metrics || { totalIncome: 0, totalExpenses: 0, profit: 0, incomeChange: 0, expenseChange: 0 });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setMetricsError(error as Error);
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, [farmId]);

  const recentExpenses = Array.isArray(expenses) ? expenses.slice(0, 5) : [];
  const loading = farmLoading || expensesLoading || metricsLoading;
  const hasError = farmError || expensesError || metricsError;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
          <p className="text-xs text-muted-foreground mt-2">
            {farmLoading && "Connecting to backend..."}
            {!farmLoading && (expensesLoading || metricsLoading) && "Loading your data..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error message if backend is not responding
  if (hasError || !farmId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-muted-foreground" />
              Backend Connecting...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The server is waking up from sleep. This usually takes 30-60 seconds on the first request.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">What's happening:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 ml-2">
                <li>Render free tier apps sleep after 15 minutes of inactivity</li>
                <li>First request wakes up the backend server</li>
                <li>Please wait and the page will load automatically</li>
              </ul>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your farm financial overview.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-scale-in border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <Banknote className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES {metrics.totalIncome.toLocaleString()}</div>
              <div className={`flex items-center text-sm mt-1 ${metrics.incomeChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {metrics.incomeChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metrics.incomeChange >= 0 ? '+' : ''}{metrics.incomeChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-l-4 border-l-accent" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <Banknote className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES {metrics.totalExpenses.toLocaleString()}</div>
              <div className={`flex items-center text-sm mt-1 ${metrics.expenseChange >= 0 ? 'text-muted-foreground' : 'text-success'}`}>
                {metrics.expenseChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metrics.expenseChange >= 0 ? '+' : ''}{metrics.expenseChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-l-4 border-l-success" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
              <Banknote className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES {metrics.profit.toLocaleString()}</div>
              <div className={`flex items-center text-sm mt-1 ${metrics.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {metrics.profit >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metrics.profit >= 0 ? 'Healthy profit margin' : 'Loss'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link to="/expenses">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded yet. Start tracking your farm expenses!
              </div>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{expense.category.substring(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{expense.description || expense.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">-KES {Number(expense.amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
