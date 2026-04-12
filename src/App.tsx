import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { PwaInstallBanner } from "@/components/PwaInstallBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UsageProvider } from "@/contexts/UsageContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Oracle from "./pages/Oracle";
import CardGallery from "./pages/CardGallery";
import MeditationLibrary from "./pages/MeditationLibrary";
import PermissionSlips from "./pages/PermissionSlips";
import HealingTools from "./pages/HealingTools";
import HealingToolPage from "./pages/HealingToolPage";
import HumanDesign from "./pages/HumanDesign";
import Manifesto from "./pages/Manifesto";
import MyProgress from "./pages/MyProgress";
import Progress from "./pages/Progress";
import MyAccount from "./pages/MyAccount";
import WellnessHub from "./pages/WellnessHub";
import SavedReadings from "./pages/SavedReadings";
import ThirtyDayExperience from "./pages/ThirtyDayExperience";
import EmotionalSurgery from "./pages/EmotionalSurgery";
import EmotionalSurgeryModule from "./pages/EmotionalSurgeryModule";
import Tools from "./pages/Tools";
import Upgrade from "./pages/Upgrade";
import DigitalWorkbook from "./pages/DigitalWorkbook";
import SupportFlow from "./pages/SupportFlow";
import SupportFlowCategory from "./pages/SupportFlowCategory";
import SupportFlowComplete from "./pages/SupportFlowComplete";
import ReleasingResistance from "./pages/ReleasingResistance";
import Patterns from "./pages/Patterns";
import PatternQuiz from "./pages/PatternQuiz";
import PatternResult from "./pages/PatternResult";
import PatternModule from "./pages/PatternModule";
import PatternCheckin from "./pages/PatternCheckin";
import Onboarding from "./pages/Onboarding";
import ResetPlan from "./pages/ResetPlan";
import MyShifts from "./pages/MyShifts";
import MonthlyReset from "./pages/MonthlyReset";
import WhatsNext from "./pages/WhatsNext";
import SacredCircle from "./pages/SacredCircle";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UsageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/oracle" element={<Oracle />} />
              <Route path="/card-gallery" element={<CardGallery />} />
              <Route path="/meditations" element={<MeditationLibrary />} />
              <Route path="/permission-slips" element={<PermissionSlips />} />
              <Route path="/healing-tools" element={<HealingTools />} />
              <Route path="/healing-tools/:toolId" element={<HealingToolPage />} />
              <Route path="/human-design" element={<HumanDesign />} />
              <Route path="/manifesto" element={<Manifesto />} />
              <Route path="/my-progress" element={<MyProgress />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/wellness" element={<WellnessHub />} />
              <Route path="/saved-readings" element={<SavedReadings />} />
              <Route path="/30-day-experience" element={<ThirtyDayExperience />} />
              <Route path="/emotional-surgery" element={<EmotionalSurgery />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/workbook" element={<DigitalWorkbook />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/support-flow" element={<SupportFlow />} />
              <Route path="/support-flow/complete" element={<SupportFlowComplete />} />
              <Route path="/support-flow/:state" element={<SupportFlowCategory />} />
              <Route path="/module/:slug" element={<EmotionalSurgeryModule />} />
              <Route path="/releasing-resistance" element={<ReleasingResistance />} />
              <Route path="/patterns" element={<Patterns />} />
              <Route path="/patterns/quiz" element={<PatternQuiz />} />
              <Route path="/patterns/result" element={<PatternResult />} />
              <Route path="/patterns/check-in" element={<PatternCheckin />} />
              <Route path="/patterns/:slug" element={<PatternModule />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/reset-plan" element={<ResetPlan />} />
              <Route path="/my-shifts" element={<MyShifts />} />
              <Route path="/monthly-reset" element={<MonthlyReset />} />
              <Route path="/whats-next" element={<WhatsNext />} />
              <Route path="/sacred-circle" element={<SacredCircle />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UsageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
