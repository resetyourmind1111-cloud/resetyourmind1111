import { useParams, useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { healingTools } from "@/data/healingToolsData";
import { useTrialStatus } from "@/hooks/useTrialStatus";

// Tools the 30-Day curriculum routes trial users to during Days 1-3.
// These must remain unlocked for active trialists regardless of assigned trial_tool_1/2.
const TRIAL_CURRICULUM_TOOLS = ["emotional-trigger-tracker"];
import LimitingBeliefRewriter from "@/components/healing-tools/LimitingBeliefRewriter";
import EmotionalTriggerTracker from "@/components/healing-tools/EmotionalTriggerTracker";
import InnerChildHealing from "@/components/healing-tools/InnerChildHealing";
import ShadowWorkLibrary from "@/components/healing-tools/ShadowWorkLibrary";
import MoneyStoryAudit from "@/components/healing-tools/MoneyStoryAudit";
import AbundanceEvidenceLog from "@/components/healing-tools/AbundanceEvidenceLog";
import IncomeFrequencyTracker from "@/components/healing-tools/IncomeFrequencyTracker";
import ManifestationTracker from "@/components/healing-tools/ManifestationTracker";
import BoundaryBuilder from "@/components/healing-tools/BoundaryBuilder";
import AttachmentStyleAnalyzer from "@/components/healing-tools/AttachmentStyleAnalyzer";
import MoonPhaseTracker from "@/components/healing-tools/MoonPhaseTracker";
import AngelNumberJournal from "@/components/healing-tools/AngelNumberJournal";
import SomaticBreathing from "@/components/healing-tools/SomaticBreathing";
import BodyMapJournal from "@/components/healing-tools/BodyMapJournal";
import AffirmationBuilder from "@/components/healing-tools/AffirmationBuilder";
import VisibilityChallengeTracker from "@/components/healing-tools/VisibilityChallengeTracker";
import CEOSelfAssessment from "@/components/healing-tools/CEOSelfAssessment";
import ValuesClarityTool from "@/components/healing-tools/ValuesClarityTool";
import ChakraBalancingGuide from "@/components/healing-tools/ChakraBalancingGuide";
import EnergyCordCutting from "@/components/healing-tools/EnergyCordCutting";
import NervousSystemDiagnostic from "@/components/healing-tools/NervousSystemDiagnostic";

const toolComponents: Record<string, React.ComponentType> = {
  "limiting-belief-rewriter": LimitingBeliefRewriter,
  "emotional-trigger-tracker": EmotionalTriggerTracker,
  "inner-child-healing": InnerChildHealing,
  "shadow-work-library": ShadowWorkLibrary,
  "money-story-audit": MoneyStoryAudit,
  "abundance-evidence-log": AbundanceEvidenceLog,
  "income-frequency-tracker": IncomeFrequencyTracker,
  "manifestation-tracker": ManifestationTracker,
  "boundary-builder": BoundaryBuilder,
  "attachment-style-analyzer": AttachmentStyleAnalyzer,
  "moon-phase-tracker": MoonPhaseTracker,
  "angel-number-journal": AngelNumberJournal,
  "somatic-breathing": SomaticBreathing,
  "body-map-journal": BodyMapJournal,
  "affirmation-builder": AffirmationBuilder,
  "visibility-challenge": VisibilityChallengeTracker,
  "ceo-self-assessment": CEOSelfAssessment,
  "values-clarity-tool": ValuesClarityTool,
  "chakra-balancing": ChakraBalancingGuide,
  "energy-cord-cutting": EnergyCordCutting,
  "nervous-system-diagnostic": NervousSystemDiagnostic,
};

export default function HealingToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive } = useTrialStatus();

  const { data: profile } = useQuery({
    queryKey: ["profile-healing-tool", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier, trial_tool_1, trial_tool_2")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const tier = profile?.subscription_tier || "free";
  const isTrialUnlocked = toolId && (
    profile?.trial_tool_1 === toolId || profile?.trial_tool_2 === toolId
  );
  const tool = healingTools.find((t) => t.id === toolId);
  const ToolComponent = toolId ? toolComponents[toolId] : null;

  if (!tool) {
    return (
      <AuthenticatedLayout title="Tool Not Found">
        <p className="text-muted-foreground">This tool doesn't exist or hasn't been built yet.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/healing-tools")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </Button>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title={tool.name} subtitle={tool.description}>
      <Button
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/healing-tools")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Tools
      </Button>
      {(() => {
        const freeTierTools = ["nervous-system-diagnostic"];
        const isFreeTool = freeTierTools.includes(toolId || "");
        const isCurriculumUnlocked = isTrialActive && TRIAL_CURRICULUM_TOOLS.includes(toolId || "");
        const effectiveTier = (isTrialUnlocked || isFreeTool || isCurriculumUnlocked) ? "expand" : tier;
        const requiredTier = isFreeTool ? "reset" as const : "expand" as const;
        return (
          <LockedContent requiredTier={requiredTier} currentTier={effectiveTier}>
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <div className="glass-card p-12 text-center">
                <span className="text-5xl mb-4 block">{tool.icon}</span>
                <h3 className="font-serif text-xl text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">This tool is being built and will be available shortly.</p>
              </div>
            )}
          </LockedContent>
        );
      })()}
    </AuthenticatedLayout>
  );
}
