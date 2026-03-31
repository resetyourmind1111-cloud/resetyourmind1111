import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { PastDueBanner } from "@/components/PastDueBanner";
import { BottomNav } from "@/components/BottomNav";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthenticatedLayout({ children, title, subtitle }: AuthenticatedLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PastDueBanner />
      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
            <div className="section-divider mt-6" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
