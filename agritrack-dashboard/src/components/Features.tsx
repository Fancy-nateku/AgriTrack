import { TrendingUp, PieChart, Receipt, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Receipt,
    title: "Expense Tracking",
    description: "Record and categorize farm expenditures by category, supplier, and date. Full audit trail, zero guesswork.",
    link: "/expenses",
  },
  {
    icon: PieChart,
    title: "Financial Analytics",
    description: "Visualize spending patterns across seasons and categories. Identify cost drivers and optimize margins.",
    link: "/dashboard",
  },
  {
    icon: TrendingUp,
    title: "Profit Monitoring",
    description: "Real-time income-to-expense ratio with month-on-month comparison. Spot trends before they become problems.",
    link: "/sales",
  },
  {
    icon: FileText,
    title: "Exportable Reports",
    description: "Generate structured financial reports for tax submissions, bank loan applications, and seasonal reviews.",
    link: "/reports",
  },
];

export const Features = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Platform Features</p>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-5">
            Built for How Farmers Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Purpose-built tools for farm financial management. No bloat, no learning curve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className="group p-7 rounded-lg border border-border bg-white hover:border-primary/30 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-md cursor-pointer"
              style={{
                transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
                animationDelay: `${index * 80}ms`
              }}
            >
              <div className="mb-5 inline-flex p-3 rounded-md bg-secondary text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
