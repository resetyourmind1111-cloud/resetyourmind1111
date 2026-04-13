import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface TrialBackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
}

export function TrialBackButton({ fallbackPath = "/home", label = "Back", className = "" }: TrialBackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-1 text-sm text-foreground/65 hover:text-foreground/90 transition-colors ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
