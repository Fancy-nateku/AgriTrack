import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Search, ArrowLeft, Loader2, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useDefaultFarm } from "@/hooks/useFarm";
import { useExpenses } from "@/hooks/useExpenses";
import { api } from "@/lib/api";
import { exportExpensesToCSV, exportExpensesToPDF } from "@/lib/exportUtils";

interface Expense {
  id: string;
  farm_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt_url?: string;
  created_at: string;
}

const categories = ["Seeds", "Fertilizers", "Transport", "Labor", "Equipment", "Other"];

export default function Expenses() {
  const navigate = useNavigate();
  const { farmId, loading: farmLoading } = useDefaultFarm();
  const { expenses, loading: expensesLoading, refresh: refreshExpenses } = useExpenses();
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!farmId) {
      toast.error("No farm found. Please create a farm first.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing expense via API
        await api.expenses.update(editingId, {
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
        });
        toast.success("Expense updated successfully");
      } else {
        // Create new expense via API
        await api.expenses.create({
          farm_id: farmId,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
        });
        toast.success("Expense added successfully");
      }

      // Refresh expenses list
      refreshExpenses();
      setFormData({ category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to save expense: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.expenses.delete(id);
      refreshExpenses();
      toast.success("Expense deleted");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to delete expense: " + errorMessage);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const loading = farmLoading || expensesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">Expense Tracker</h1>
              <p className="text-muted-foreground">Track and manage all your farm expenses</p>
              <p className="text-sm text-muted-foreground mt-2">
                Total Expenses: <span className="font-semibold text-foreground">KES {totalExpenses.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    setEditingId(null);
                    setFormData({ category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
                  }
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button
                onClick={() => {
                  if (filteredExpenses.length === 0) {
                    toast.error("No expenses to export");
                    return;
                  }
                  exportExpensesToCSV(filteredExpenses);
                  toast.success("Expenses exported to CSV!");
                }}
                variant="outline"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => {
                  if (filteredExpenses.length === 0) {
                    toast.error("No expenses to export");
                    return;
                  }
                  exportExpensesToPDF(filteredExpenses);
                  toast.success("Expenses exported to PDF!");
                }}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Expense" : "Add New Expense"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the expense..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Update" : "Add"} Expense
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8 animate-slide-up">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expense Table */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No expenses found. Add your first expense to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">{expense.description}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-right text-foreground">
                          KES {expense.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
