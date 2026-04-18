import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 pb-safe pt-safe">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <Compass className="w-8 h-8" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">
          404 · Page not found
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-3">
          You've wandered off the path.
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          This page doesn't exist — but your reset is still right here, waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl min-h-[48px] w-full sm:w-auto">
              Go home →
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[48px] px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
