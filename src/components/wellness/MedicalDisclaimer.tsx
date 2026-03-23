import { AlertTriangle } from "lucide-react";

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export function MedicalDisclaimer({ compact = false }: MedicalDisclaimerProps) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground/70 italic mt-4">
        The information in this module is for educational and awareness purposes only. It is not intended to diagnose, treat, cure or prevent any medical or mental health condition. If you are experiencing a mental health crisis please call 988 (Suicide and Crisis Lifeline) immediately.
      </p>
    );
  }

  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4 md:p-6 mb-6">
      <div className="flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          The information in this module is for educational and awareness purposes only. It is not intended to diagnose, treat, cure or prevent any medical or mental health condition. If you are experiencing a mental health crisis please call{" "}
          <span className="font-semibold text-foreground">988</span> (Suicide and Crisis Lifeline) immediately. For deep subconscious root cause healing — the kind that creates lasting change — book a private coaching session with Lorie.
        </p>
      </div>
    </div>
  );
}
