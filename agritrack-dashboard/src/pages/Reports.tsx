import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, Loader2, FileSpreadsheet } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useIncome } from "@/hooks/useIncome";
import { exportFinancialSummaryToPDF, exportExpensesToCSV, exportIncomeToCSV } from "@/lib/exportUtils";

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const { expenses, loading: expensesLoading } = useExpenses();
  const { income, loading: incomeLoading } = useIncome();

  // Aggregate data by month
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { month: string; expenses: number; income: number }>();
    
    // Get last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthMap.set(monthKey, { month: monthName, expenses: 0, income: 0 });
    }

    // Aggregate expenses
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(monthKey)) {
        const data = monthMap.get(monthKey)!;
        data.expenses += Number(expense.amount);
      }
    });

    // Aggregate income
    income.forEach(inc => {
      const date = new Date(inc.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(monthKey)) {
        const data = monthMap.get(monthKey)!;
        data.income += Number(inc.amount);
      }
    });

    return Array.from(monthMap.values());
  }, [expenses, income]);

  // Aggregate expenses by category
  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const category = expense.category;
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + Number(expense.amount));
    });

    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--muted))",
    ];

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        fill: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const handleDownloadMonthlySummary = () => {
    try {
      toast.loading("Generating monthly summary...");
      
      // Export combined financial summary as PDF
      exportFinancialSummaryToPDF(expenses, income, "Last 6 Months");
      
      toast.success("Monthly summary downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const handleDownloadYearlyReport = () => {
    try {
      toast.loading("Generating yearly report...");
      
      // Filter data for current year
      const currentYear = new Date().getFullYear();
      const yearlyExpenses = expenses.filter(exp => 
        new Date(exp.date).getFullYear() === currentYear
      );
      const yearlyIncome = income.filter(inc => 
        new Date(inc.date).getFullYear() === currentYear
      );
      
      exportFinancialSummaryToPDF(yearlyExpenses, yearlyIncome, `Year ${currentYear}`);
      
      toast.success("Yearly report downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const handleExportExpensesCSV = () => {
    try {
      if (expenses.length === 0) {
        toast.error("No expenses to export");
        return;
      }
      exportExpensesToCSV(expenses);
      toast.success("Expenses exported to CSV!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export expenses");
    }
  };

  const handleExportIncomeCSV = () => {
    try {
      if (income.length === 0) {
        toast.error("No income to export");
        return;
      }
      exportIncomeToCSV(income);
      toast.success("Income exported to CSV!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export income");
    }
  };

  if (expensesLoading || incomeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">Understand your farm's financial trends</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleDownloadMonthlySummary} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Monthly Summary (PDF)
              </Button>
              <Button onClick={handleDownloadYearlyReport} className="bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Yearly Report (PDF)
              </Button>
              <Button onClick={handleExportExpensesCSV} variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Expenses (CSV)
              </Button>
              <Button onClick={handleExportIncomeCSV} variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Income (CSV)
              </Button>
            </div>
          </div>
        </div>

        {/* Time Period Selector */}
        <Card className="mb-8 animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">Time Period:</label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expense Trends Chart */}
        <Card className="mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Income vs Expenses Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 || monthlyData.every(d => d.expenses === 0 && d.income === 0) ? (
              <div className="text-center py-12 text-muted-foreground">
                No data available yet. Start tracking your income and expenses!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No expense data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Category Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No expense data available yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: category.fill }}
                        ></div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">KES {category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
