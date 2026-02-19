import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const scrollToLearnMore = () => {
    const element = document.getElementById("features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-semibold tracking-wide uppercase">
              <BarChart3 className="h-4 w-4" />
              Professional Farm Management
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Master Your Farm <br />
                <span className="text-primary italic">Finances</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Precision expense tracking and financial planning designed for the modern farmer. 
                Turn raw data into actionable growth strategies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-primary hover:bg-primary/95 text-white px-8 py-6 text-lg rounded-md transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToLearnMore} 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg border-2 hover:bg-secondary rounded-md transition-all duration-200"
              >
                View Features
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">1,000+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Farmers</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">KES 20M+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Tracked</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Data Control</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="relative bg-white border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="font-bold text-lg text-foreground">Real-time Overview</h3>
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(15,103,64,0.3)]"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-secondary p-5 rounded-lg">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Portfolio Income</div>
                    <div className="text-2xl font-black text-foreground">KES 45,230</div>
                    <div className="text-xs font-bold text-primary mt-1.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5%
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-5 rounded-lg">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Efficiency Rate</div>
                    <div className="text-2xl font-black text-foreground">94.2%</div>
                    <div className="text-xs font-bold text-muted-foreground mt-1.5 tracking-wide">STABLE</div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-md border border-border">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-secondary rounded flex items-center justify-center font-bold text-primary">0{i}</div>
                        <div className="space-y-2">
                          <div className="h-2.5 w-32 bg-border rounded"></div>
                          <div className="h-2 w-20 bg-secondary rounded"></div>
                        </div>
                      </div>
                      <div className="h-2.5 w-16 bg-border rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
