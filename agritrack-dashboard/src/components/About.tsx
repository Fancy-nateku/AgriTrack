import { Sprout, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Who We Are</p>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-5">
            About AgriTrack
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Built to give farmers a clear, honest view of their farm finances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              AgriTrack was built on a straightforward premise: farmers deserve financial
              tools as dependable as their equipment. We help agricultural operations
              of all sizes track expenses, plan budgets, and make decisions grounded in
              real data.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We focus on clarity and speed. Whether you're tracking seed costs after
              a planting season or reviewing annual profit margins before the harvest,
              AgriTrack keeps the numbers in front of you.
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
                  Community-First
                </h4>
                <p className="text-sm text-muted-foreground">
                  Built with and for Kenyan farmers
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

        <div className="bg-secondary rounded-lg p-10 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
            Why AgriTrack
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-8">Practical reasons. No fluff.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Minimal Setup</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Register, create a farm, and start entering expenses immediately.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Works Anywhere</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Responsive layout designed for phones and desktop equally.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Your Data</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All records are yours. Export reports whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
