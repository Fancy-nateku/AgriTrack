import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, ArrowLeft, TrendingUp, DollarSign, TrendingDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDefaultFarm } from "@/hooks/useFarm";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { api } from "@/lib/api";
import type { Income as IncomeType } from "@/types/database";

interface Income {
  id: string;
  farm_id: string;
  source: string;
  description?: string;
  amount: number;
  date: string;
  created_at: string;
}

const incomeSources = ["Crops", "Livestock", "Dairy", "Poultry", "Other"];

export default function Sales() {
  const navigate = useNavigate();
  const { farmId, loading: farmLoading } = useDefaultFarm();
  const { income, loading: incomeLoading, refresh: refreshIncome } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    source: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });


  const loading = farmLoading || incomeLoading || expensesLoading;

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!farmId) {
      toast.error("No farm found. Please create a farm first.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing income via API
        await api.income.update(editingId, {
          source: formData.source,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
        });

       toast.success("Sale updated successfully");
      } else {
        // Create new income via API
        await api.income.create({
          farm_id: farmId,
          source: formData.source,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
        });

        toast.success("Sale added successfully");
      }

      // Refresh the income list
      refreshIncome();
      setFormData({ source: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to save sale: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Income) => {
    setFormData({
      source: item.source,
      description: item.description || "",
      amount: item.amount.toString(),
      date: item.date,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.income.delete(id);
      refreshIncome();
      toast.success("Sale deleted");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to delete sale: " + errorMessage);
    }
  };

  if (farmLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sales & Profitability</h1>
              <p className="text-muted-foreground">Track your sales and monitor farm profitability</p>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setEditingId(null);
                  setFormData({ source: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
                }
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "Add New Sale"}
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                KES {totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From all sales
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                KES {totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All farm expenses
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Profit
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                KES {netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Income minus expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Sale" : "Add New Sale"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source/Product Type</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
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
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="e.g., 100 bags of maize"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Update Sale" : "Add Sale"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ source: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sales List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Sales Records</CardTitle>
          </CardHeader>
          <CardContent>
            {income.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No sales recorded yet. Add your first sale to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {income.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {item.source}
                          </span>
                        </TableCell>
                        <TableCell>{item.description || "-"}</TableCell>
                        <TableCell className="text-right font-semibold">
                          KES {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
