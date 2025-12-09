import { Sprout, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-secondary border-t-2 border-primary/30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Ready to Transform Your Farm Management?
              </h3>
              <p className="text-primary-foreground/90 text-lg">
                Join thousands of farmers growing smarter every day
              </p>
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 font-semibold shadow-xl group whitespace-nowrap"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <Sprout className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">AgriTrack</span>
                <p className="text-xs text-muted-foreground">Farm Expense Intelligence</p>
              </div>
            </div>
            <p className="text-base text-foreground/80 max-w-md leading-relaxed">
              Built by farmers, for farmers. Track every penny, maximize every harvest, 
              and grow your operation with data-driven insights.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-3 bg-background/50 hover:bg-primary rounded-lg text-foreground hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-background/50 hover:bg-primary rounded-lg text-foreground hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-background/50 hover:bg-primary rounded-lg text-foreground hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg border-b-2 border-primary/30 pb-2">
              Resources
            </h3>
            <ul className="space-y-3">
              {['Documentation', 'Video Tutorials', 'Case Studies', 'Blog', 'Help Center'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg border-b-2 border-primary/30 pb-2">
              Company
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Partners', 'Press Kit', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-0.5 bg-primary transition-all duration-200 mr-0 group-hover:mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-primary/30">
          <p className="text-sm text-foreground/60 text-center">
            © {new Date().getFullYear()} AgriTrack. Cultivating Financial Success.
          </p>
        </div>
      </div>
    </footer>
  );
};
