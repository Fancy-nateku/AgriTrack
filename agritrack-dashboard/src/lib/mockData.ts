export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export const mockExpenses: Expense[] = [
  { id: "1", date: "2024-01-15", category: "Seeds", amount: 25000, description: "Corn seeds for spring planting" },
  { id: "2", date: "2024-01-18", category: "Labor", amount: 32000, description: "Seasonal workers - 2 weeks" },
  { id: "3", date: "2024-01-20", category: "Equipment", amount: 85000, description: "Tractor maintenance and repairs" },
  { id: "4", date: "2024-01-22", category: "Fertilizer", amount: 42000, description: "Organic fertilizer bulk purchase" },
  { id: "5", date: "2024-01-25", category: "Transport", amount: 12000, description: "Delivery to market" },
  { id: "6", date: "2024-02-01", category: "Seeds", amount: 18000, description: "Vegetable seeds variety pack" },
  { id: "7", date: "2024-02-05", category: "Utilities", amount: 6500, description: "Irrigation water bill" },
  { id: "8", date: "2024-02-08", category: "Labor", amount: 29000, description: "Harvesting crew" },
  { id: "9", date: "2024-02-12", category: "Equipment", amount: 4500, description: "Small tools and supplies" },
  { id: "10", date: "2024-02-15", category: "Pesticide", amount: 8900, description: "Organic pest control" },
];

export const categories = [
  "Seeds",
  "Labor",
  "Equipment",
  "Fertilizer",
  "Pesticide",
  "Transport",
  "Utilities",
  "Maintenance",
  "Insurance",
  "Other",
];

export const monthlyData = [
  { month: "Jan", expenses: 12450, income: 18200 },
  { month: "Feb", expenses: 10890, income: 22400 },
  { month: "Mar", expenses: 15200, income: 25600 },
  { month: "Apr", expenses: 13800, income: 28900 },
  { month: "May", expenses: 16500, income: 32100 },
  { month: "Jun", expenses: 14200, income: 29800 },
];

export const categoryBreakdown = [
  { name: "Seeds", value: 4300, fill: "hsl(var(--chart-1))" },
  { name: "Labor", value: 6100, fill: "hsl(var(--chart-2))" },
  { name: "Equipment", value: 8950, fill: "hsl(var(--chart-3))" },
  { name: "Fertilizer", value: 4200, fill: "hsl(var(--chart-4))" },
  { name: "Transport", value: 1200, fill: "hsl(var(--chart-5))" },
  { name: "Other", value: 3680, fill: "hsl(var(--muted))" },
];
