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
      title: "Worth Thermostat Assessment",
      description: "See exactly where your money patterns are set.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: "Scarcity Loop Reset",
      description: "Identify the pattern keeping you stuck financially.",
      buttonText: "Start Reset",
      href: "/patterns",
    },
    {
      title: "Money Story Audit",
      description: "Uncover the story beneath the struggle.",
      buttonText: "Open Tool",
      href: "/healing-tools",
    },
  ],
  love: [
    {
      title: "Worth Thermostat Assessment",
      description: "Discover how you're showing up in relationships.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: "People Pleaser Reset",
      description: "Break the pattern of giving yourself away.",
      buttonText: "Start Reset",
      href: "/patterns",
    },
    {
      title: "Attachment Style Analyzer",
      description: "Understand how you love and why.",
      buttonText: "Open Tool",
      href: "/healing-tools",
    },
  ],
  health: [
    {
      title: "Nervous System Diagnostic",
      description: "Find out how your nervous system is running your body.",
      buttonText: "Start Diagnostic",
      href: "/wellness",
    },
    {
      title: "Start-Stop Cycle Reset",
      description: "Break the pattern of starting over.",
      buttonText: "Start Reset",
      href: "/patterns",
    },
    {
      title: "Releasing Resistance Lesson",
      description: "The first thing to dissolve before anything else.",
      buttonText: "Open Lesson",
      href: "/releasing-resistance",
    },
  ],
  identity: [
    {
      title: "Worth Thermostat Assessment",
      description: "See where your identity is set right now.",
      buttonText: "Start Assessment",
      href: "/assessment",
    },
    {
      title: '"I Know But…" Reset',
      description: "Close the gap between who you know you are and how you're actually living.",
      buttonText: "Start Reset",
      href: "/patterns",
    },
    {
      title: "Emotional Surgery Lessons",
      description: "Go deeper into the identity work.",
      buttonText: "Open Lessons",
      href: "/emotional-surgery",
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
