import { createContext, useContext, ReactNode } from "react";
import { useUsageTracker } from "@/hooks/useUsageTracker";

interface UsageContextType {
  sessionCount: number;
  dailyLimit: number;
  isLimitReached: boolean;
  incrementUsage: () => Promise<boolean>;
  loading: boolean;
}

const UsageContext = createContext<UsageContextType>({
  sessionCount: 0,
  dailyLimit: 50,
  isLimitReached: false,
  incrementUsage: async () => true,
  loading: true,
});

export function UsageProvider({ children }: { children: ReactNode }) {
  const usage = useUsageTracker();
  return <UsageContext.Provider value={usage}>{children}</UsageContext.Provider>;
}

export function useUsage() {
  return useContext(UsageContext);
}
