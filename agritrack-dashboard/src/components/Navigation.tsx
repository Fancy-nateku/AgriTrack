import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export const Navigation = ({ onLoginClick, onSignupClick, isLoggedIn, userEmail, onLogout }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AgriTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/activity-plan"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/activity-plan") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Activity Plan
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/expenses") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Expenses
            </Link>
            <Link
              to="/sales"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/sales") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Sales
            </Link>
            <Link
              to="/reports"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/reports") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Reports
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">{userEmail}</span>
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                  Login
                </Button>
                <Button onClick={() => navigate('/login')} size="sm" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/activity-plan"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/activity-plan") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Activity Plan
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/expenses") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Expenses
              </Link>
              <Link
                to="/sales"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/sales") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Sales
              </Link>
              <Link
                to="/reports"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 ${
                  isActive("/reports") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Reports
              </Link>
              <div className="pt-4 border-t border-border space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="text-sm text-muted-foreground px-2">{userEmail}</div>
                    <Button onClick={onLogout} variant="outline" size="sm" className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => navigate('/login')} variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                    <Button onClick={() => navigate('/login')} size="sm" className="w-full bg-primary hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
