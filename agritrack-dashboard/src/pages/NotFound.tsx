import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-5xl font-bold text-primary">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">Requested path:</span>
            </p>
            <code className="text-xs bg-background px-2 py-1 rounded">
              {location.pathname}
            </code>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">Try these instead:</p>
            <div className="space-y-1">
              <Link 
                to="/" 
                className="block text-sm text-primary hover:underline"
              >
                → Home Page
              </Link>
              <Link 
                to="/dashboard" 
                className="block text-sm text-primary hover:underline"
              >
                → Dashboard
              </Link>
              <Link 
                to="/expenses" 
                className="block text-sm text-primary hover:underline"
              >
                → Expenses
              </Link>
              <Link 
                to="/#contact" 
                className="block text-sm text-primary hover:underline"
              >
                → Contact Support
              </Link>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
