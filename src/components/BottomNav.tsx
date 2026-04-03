import { Link, useLocation } from "react-router-dom";
import { Home, Brain, LayoutGrid, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Emotional Surgery™", icon: Brain, href: "/emotional-surgery" },
  { label: "Tools", icon: LayoutGrid, href: "/tools" },
  { label: "Progress", icon: TrendingUp, href: "/progress" },
  { label: "Profile", icon: User, href: "/my-account" },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-[#06060e] md:hidden">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-1 flex-1 min-w-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isActive && (
                <span className="text-[10px] font-medium leading-tight text-center truncate max-w-full">
                  {tab.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
