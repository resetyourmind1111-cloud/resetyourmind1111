import { Button, ButtonProps } from "@/components/ui/button";
import { useUsage } from "@/contexts/UsageContext";
import { Loader2, Ban } from "lucide-react";
import { toast } from "sonner";
import { ReactNode } from "react";

interface AiButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function AiButton({ onClick, isLoading, loadingText, children, disabled, ...props }: AiButtonProps) {
  const { isLimitReached, incrementUsage } = useUsage();

  const handleClick = async () => {
    if (isLimitReached) {
      toast.error("Daily limit reached — resets at midnight");
      return;
    }
    const allowed = await incrementUsage();
    if (!allowed) {
      toast.error("Daily limit reached — resets at midnight");
      return;
    }
    await onClick();
  };

  if (isLimitReached) {
    return (
      <Button disabled {...props}>
        <Ban className="w-4 h-4 mr-2" />
        Daily limit reached — resets at midnight
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{loadingText || "Processing..."}</>
      ) : children}
    </Button>
  );
}
