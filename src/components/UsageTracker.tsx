import { useUsageTracker } from "@/hooks/useUsageTracker";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

export function UsageTracker() {
  const { sessionCount, dailyLimit, isLimitReached, loading } = useUsageTracker();

  if (loading) return null;

  const percentage = Math.min((sessionCount / dailyLimit) * 100, 100);

  return (
    <div className="px-4 py-3 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Zap className="w-3 h-3" />
          AI Sessions
        </span>
        <span className={isLimitReached ? "text-destructive font-semibold" : "text-muted-foreground"}>
          {sessionCount} / {dailyLimit}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" />
      {isLimitReached && (
        <p className="text-[10px] text-destructive text-center">
          Daily limit reached — resets at midnight
        </p>
      )}
    </div>
  );
}
