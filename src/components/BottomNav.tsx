import { Link, useLocation } from "react-router-dom";
import { Home, Brain, LayoutGrid, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const allTabs = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Emotional Surgery™", icon: Brain, href: "/emotional-surgery" },
  { label: "Tools", icon: LayoutGrid, href: "/tools" },
  { label: "Progress", icon: TrendingUp, href: "/progress" },
  { label: "Profile", icon: User, href: "/my-account" },
];

const day1Tabs = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Profile", icon: User, href: "/my-account" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { isTrialActive, trialDay } = useTrialStatus();

  // Simplified nav for ALL trial users, not just Day 1
  const tabs = isTrialActive ? day1Tabs : allTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-[#06060e] md:hidden pb-safe">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 min-w-0 min-h-[56px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight text-center truncate max-w-full transition-opacity",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
