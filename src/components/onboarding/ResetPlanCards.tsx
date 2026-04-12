import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PlanCard {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

const plansByWound: Record<string, PlanCard[]> = {
  wealth: [
    {
      title: "Worth Thermostat™",
      description: "See exactly where your money patterns are set.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: "Scarcity Loop Reset",
      description: "Identify the pattern keeping you stuck financially.",
      buttonText: "Start Reset",
      href: "/patterns/quiz",
    },
    {
      title: "Money Story Audit",
      description: "Uncover the story beneath the struggle.",
      buttonText: "Open Tool",
      href: "/healing-tools/money-story-audit",
    },
  ],
  love: [
    {
      title: "Worth Thermostat™",
      description: "Discover how you're showing up in relationships.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: "People Pleaser Reset",
      description: "Break the pattern of giving yourself away.",
      buttonText: "Start Reset",
      href: "/patterns/quiz",
    },
    {
      title: "Nervous System Diagnostic",
      description: "Find out how your nervous system is running your body.",
      buttonText: "Open Tool",
      href: "/healing-tools/nervous-system-diagnostic",
    },
  ],
  health: [
    {
      title: "Nervous System Diagnostic",
      description: "Find out how your nervous system is running your body.",
      buttonText: "Start Diagnostic",
      href: "/healing-tools/nervous-system-diagnostic",
    },
    {
      title: "Start-Stop Cycle Reset",
      description: "Break the pattern of starting over.",
      buttonText: "Start Reset",
      href: "/patterns/quiz",
    },
    {
      title: "Releasing Resistance",
      description: "The first thing to dissolve before anything else.",
      buttonText: "Open Lesson",
      href: "/releasing-resistance",
    },
  ],
  identity: [
    {
      title: "Worth Thermostat™",
      description: "See where your identity is set right now.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: "Identity Pattern Quiz",
      description: "Discover which identity pattern has been running your life — and how to interrupt it.",
      buttonText: "Take the Quiz",
      href: "/patterns/quiz",
    },
    {
      title: "Limiting Belief Rewriter",
      description: "Rewrite the belief that's been keeping you hidden, hesitant, or stuck in preparation mode.",
      buttonText: "Open Tool",
      href: "/healing-tools/limiting-belief-rewriter",
    },
  ],
};

export function ResetPlanCards({ primaryWound }: { primaryWound: string }) {
  const cards = plansByWound[primaryWound] || plansByWound.wealth;

  return (
    <div className="grid gap-4">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="p-5 bg-card/80 border-border/50 hover:border-primary/40 transition-all"
        >
          <h3 className="font-serif font-semibold text-foreground text-base mb-1">
            {card.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{card.description}</p>
          <Link to={card.href}>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary/10 gap-2"
            >
              {card.buttonText} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}
