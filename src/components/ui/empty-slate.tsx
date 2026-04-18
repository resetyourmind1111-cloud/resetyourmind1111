import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptySlateProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}

/**
 * Branded empty state.
 * Centered content, gold accent, cream text on dark.
 * Used when a section has no data yet.
 */
export function EmptySlate({
  icon,
  title,
  body,
  ctaLabel,
  ctaTo,
  onCta,
  secondaryLabel,
  onSecondary,
  className = "",
}: EmptySlateProps) {
  const cta = ctaLabel ? (
    ctaTo ? (
      <Link to={ctaTo}>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl mt-2">
          {ctaLabel}
        </Button>
      </Link>
    ) : (
      <Button
        onClick={onCta}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl mt-2"
      >
        {ctaLabel}
      </Button>
    )
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-border/40 bg-card/60 p-8 text-center ${className}`}
    >
      {icon && (
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg md:text-xl text-foreground mb-2">
        {title}
      </h3>
      {body && (
        <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto leading-relaxed mb-4">
          {body}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
        {cta}
        {secondaryLabel && (
          <button
            onClick={onSecondary}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-4"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
