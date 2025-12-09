import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDefaultFarm } from "@/hooks/useFarm";
import { useActivities } from "@/hooks/useActivities";
import { api } from "@/lib/api";

interface Activity {
  id: string;
  farm_id: string;
  description: string;
  time_frame: "today" | "this-week" | "this-month" | "custom";
  custom_date?: string | null;
  priority: "low" | "medium" | "high";
  notes: string;
  completed: boolean;
  created_at: string;
}

const priorityColors = {
  low: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  medium: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
};

const timeFrameLabels = {
  today: "Today",
  "this-week": "This Week",
  "this-month": "This Month",
  custom: "Custom Date",
};

export default function ActivityPlan() {
  const { farmId, loading: farmLoading } = useDefaultFarm();
  const { activities, loading: activitiesLoading, refresh: refreshActivities } = useActivities();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null);
  const [filterTimeFrame, setFilterTimeFrame] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    description: "",
    time_frame: "today" as Activity["time_frame"],
    custom_date: "",
    priority: "medium" as Activity["priority"],
    notes: "",
  });



  const resetForm = () => {
    setFormData({
      description: "",
      time_frame: "today",
      custom_date: "",
      priority: "medium",
      notes: "",
    });
    setEditingActivity(null);
  };

  const handleOpenForm = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        description: activity.description,
        time_frame: activity.time_frame,
        custom_date: activity.custom_date || "",
        priority: activity.priority,
        notes: activity.notes,
      });
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error("Please enter an activity description");
      return;
    }

    if (formData.time_frame === "custom" && !formData.custom_date) {
      toast.error("Please select a custom date");
      return;
    }

    if (!farmId) {
      toast.error("No farm found. Please create a farm first.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingActivity) {
        // Update existing activity via API
        await api.activities.update(editingActivity.id, {
          description: formData.description,
          time_frame: formData.time_frame,
          custom_date: formData.time_frame === 'custom' ? formData.custom_date : undefined,
          priority: formData.priority,
          notes: formData.notes,
        });
        toast.success("Activity updated successfully");
      } else {
        // Create new activity via API
        await api.activities.create({
          farm_id: farmId,
          description: formData.description,
          time_frame: formData.time_frame,
          custom_date: formData.time_frame === 'custom' ? formData.custom_date : undefined,
          priority: formData.priority,
          notes: formData.notes,
        });
        toast.success("Activity added successfully");
      }

      refreshActivities();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to save activity: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await api.activities.toggleComplete(id);
      refreshActivities();
      const activity = activities.find((a) => a.id === id);
      toast.success(activity?.completed ? "Activity marked as incomplete" : "Activity completed! 🎉");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to update activity: " + errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteActivity) return;

    try {
      await api.activities.delete(deleteActivity.id);
      refreshActivities();
      toast.success("Activity deleted");
      setDeleteActivity(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Failed to delete activity: " + errorMessage);
    }
  };

  const loading = farmLoading || activitiesLoading;
  const filteredActivities = activities.filter((activity) => {
    if (filterTimeFrame === "all") return true;
    return activity.time_frame === filterTimeFrame;
  });

  const activeTasks = filteredActivities.filter((a) => !a.completed).length;
  const completedTasks = filteredActivities.filter((a) => a.completed).length;

  if (farmLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          {/* Engaging Intro Section */}
          <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 animate-scale-in">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Plan Your Farming Activities
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              Stay organized and maximize productivity by planning your daily, weekly, and monthly farming tasks
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Proper planning prevents poor performance" 🌱
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{filteredActivities.length}</div>
              </CardContent>
            </Card>
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{activeTasks}</div>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{completedTasks}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Activity
            </Button>
            
            <Select value={filterTimeFrame} onValueChange={setFilterTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-2">No activities planned yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start planning your farming activities to stay organized
                </p>
                <Button onClick={() => handleOpenForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className={`transition-all hover:shadow-md ${
                  activity.completed ? "opacity-60 bg-muted/30" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleToggleComplete(activity.id)}
                          className="flex-shrink-0"
                        >
                          <CheckCircle2
                            className={`h-6 w-6 transition-colors ${
                              activity.completed
                                ? "text-success fill-success"
                                : "text-muted-foreground hover:text-success"
                            }`}
                          />
                        </button>
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold ${
                              activity.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {activity.description}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 ml-9 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {timeFrameLabels[activity.time_frame]}
                          {activity.time_frame === "custom" && activity.custom_date
                            ? `: ${new Date(activity.custom_date).toLocaleDateString()}`
                            : ""}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${priorityColors[activity.priority]}`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} Priority
                        </Badge>
                      </div>

                      {activity.notes && (
                        <p className="text-sm text-muted-foreground ml-9 mb-3">{activity.notes}</p>
                      )}

                      <div className="flex items-center gap-3 ml-9">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(activity)}
                          className="h-8"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteActivity(activity)}
                          className="h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
              <DialogDescription>
                {editingActivity
                  ? "Update your farming activity details"
                  : "Plan a new farming activity to stay organized"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Activity Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Plant corn seeds in field A"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeFrame">Time Frame *</Label>
                  <Select
                    value={formData.time_frame}
                    onValueChange={(value) =>
                      setFormData({ ...formData, time_frame: value as Activity["time_frame"] })
                    }
                  >
                    <SelectTrigger id="timeFrame">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value as Activity["priority"] })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.time_frame === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customDate">Custom Date *</Label>
                  <Input
                    id="customDate"
                    type="date"
                    value={formData.custom_date}
                    onChange={(e) => setFormData({ ...formData, custom_date: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details or reminders..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingActivity ? "Update Activity" : "Add Activity"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteActivity} onOpenChange={() => setDeleteActivity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
