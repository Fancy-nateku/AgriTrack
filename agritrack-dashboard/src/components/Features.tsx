import { TrendingUp, PieChart, Receipt, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Receipt,
      title: "Track Every Expense",
      description: "Easily record and categorize all your farm expenses in one place. Never lose track of where your money goes.",
      link: "/expenses",
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Understand your spending patterns with beautiful charts and graphs. Make data-driven decisions for your farm.",
      link: "/dashboard",
    },
    {
      icon: TrendingUp,
      title: "Monitor Profitability",
      description: "Track your income vs expenses in real-time. Know exactly how profitable your farm operations are.",
      link: "/sales",
    },
    {
      icon: Download,
      title: "Generate Reports",
      description: "Download detailed financial reports for tax season, loan applications, or business planning.",
      link: "/reports",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Farm Expenses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for farmers to track, analyze, and optimize their farm spending.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
