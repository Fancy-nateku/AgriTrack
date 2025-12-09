import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, TrendingUp } from "lucide-react";

const expenseTrends = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 3800 },
  { month: "Apr", amount: 3908 },
];

const categoryBreakdown = [
  { name: "Seeds", value: 35, fill: "hsl(var(--primary))" },
  { name: "Labor", value: 25, fill: "hsl(var(--accent))" },
  { name: "Equipment", value: 20, fill: "hsl(var(--success))" },
  { name: "Transport", value: 20, fill: "hsl(var(--muted))" },
];

export const ReportsPreview = () => {
  return (
    <section id="reports" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analytics & Reports
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand your farm's financial trends with detailed reports and insights.
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2 italic">
            Sample reports preview - Sign up to generate your own reports
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Expense Trends */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Expense Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={expenseTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '10px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '10px' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Jan Feb Mar Apr</p>
            </CardContent>
          </Card>

          {/* Category Split */}
          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Category Split</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2 text-center">Seeds 35%</p>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Monthly PDF
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Yearly CSV
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Generate comprehensive reports for tax filing and financial planning.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
