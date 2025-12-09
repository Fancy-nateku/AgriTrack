import { Sprout, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About AgriTrack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering farmers with simple, powerful tools to manage expenses
            and grow profitably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground">
              AgriTrack was born from a simple belief: farmers deserve financial
              tools as reliable as their equipment. We're committed to helping
              agricultural businesses of all sizes track expenses, plan budgets,
              and make data-driven decisions that lead to sustainable growth.
            </p>
            <p className="text-muted-foreground">
              Since 2025, we've helped thousands of farmers take control of
              their finances, saving an average of 20% on operational costs
              through better expense tracking and planning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="animate-scale-in">
              <CardContent className="pt-6 text-center">
                <Sprout className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  Farm-Focused
                </h4>
                <p className="text-sm text-muted-foreground">
                  Built specifically for agricultural needs
                </p>
              </CardContent>
            </Card>

            <Card
              className="animate-scale-in"
              style={{ animationDelay: "100ms" }}
            >
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  5,000+ Farmers
                </h4>
                <p className="text-sm text-muted-foreground">
                  Trusted by farming communities
                </p>
              </CardContent>
            </Card>

            <Card
              className="animate-scale-in"
              style={{ animationDelay: "200ms" }}
            >
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  Simple & Effective
                </h4>
                <p className="text-sm text-muted-foreground">
                  Easy to use, powerful results
                </p>
              </CardContent>
            </Card>

            <Card
              className="animate-scale-in"
              style={{ animationDelay: "300ms" }}
            >
              <CardContent className="pt-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  Always Improving
                </h4>
                <p className="text-sm text-muted-foreground">
                  Evolving with your feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Why Choose AgriTrack?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                No Learning Curve
              </h4>
              <p className="text-sm text-muted-foreground">
                Start tracking expenses in minutes, not days
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Mobile-Friendly
              </h4>
              <p className="text-sm text-muted-foreground">
                Track from the field or the office
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Affordable Pricing
              </h4>
              <p className="text-sm text-muted-foreground">
                Plans that fit farms of every size
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
