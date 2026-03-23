import { ExternalLink } from "lucide-react";

interface AviniProductLinkProps {
  products: string[];
}

export function AviniProductLink({ products }: AviniProductLinkProps) {
  return (
    <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 mt-4">
      <p className="text-sm text-foreground/90 mb-2">
        <span className="font-semibold text-accent">Avini Health support:</span>{" "}
        {products.join(", ")} —{" "}
        <a
          href="https://AVINIHEALTH.COM/LORIE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 inline-flex items-center gap-1"
        >
          Shop at AVINIHEALTH.COM/LORIE <ExternalLink className="w-3 h-3" />
        </a>
      </p>
      <p className="text-xs text-muted-foreground/70 italic">
        These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  );
}
