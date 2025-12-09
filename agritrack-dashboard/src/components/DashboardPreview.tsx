import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Banknote, TrendingDown } from "lucide-react";

const monthlyData = [
  { month: "Jan", income: 400000, expenses: 240000 },
  { month: "Feb", income: 300000, expenses: 139800 },
  { month: "Mar", income: 500000, expenses: 380000 },
  { month: "Apr", income: 480000, expenses: 390800 },
  { month: "May", income: 600000, expenses: 480000 },
  { month: "Jun", income: 700000, expenses: 380000 },
];

export const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visualize Your Financial Trends
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track expenses versus income to understand your farm's profitability over time.
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2 italic">
            Sample dashboard preview - Sign up to see your real farm data
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="animate-scale-in border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <Banknote className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES 1,245,000</div>
              <div className="flex items-center text-sm text-success mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% growth
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-l-4 border-l-accent" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <Banknote className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES 823,000</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% increase
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-l-4 border-l-success" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
              <Banknote className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KES 422,000</div>
              <div className="flex items-center text-sm text-success mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Healthy margin
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button variant="default" size="sm">Monthly</Button>
              <Button variant="outline" size="sm">Quarterly</Button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142 76% 45%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(142 76% 55%)" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43 86% 60%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(43 86% 70%)" stopOpacity={0.3} />
                  </linearGradient>
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
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
                  }}
                  formatter={(value: number) => `KES ${value.toLocaleString()}`}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill="url(#incomeGradient)" 
                  name="Income" 
                  radius={[8, 8, 0, 0]} 
                />
                <Bar 
                  dataKey="expenses" 
                  fill="url(#expensesGradient)" 
                  name="Expenses" 
                  radius={[8, 8, 0, 0]} 
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(142 76% 45%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(142 76% 45%)", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  filter="url(#lineGlow)"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(43 86% 60%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(43 86% 60%)", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  filter="url(#lineGlow)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">Your Farm's Command Center</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A clean, intuitive dashboard that brings all your important farm data into one place for easy decision-making.
          </p>
        </div>
      </div>
    </section>
  );
};
