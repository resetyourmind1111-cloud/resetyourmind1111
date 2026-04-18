/**
 * Trial-mode recommendation safety net.
 *
 * Renders <AssessmentResults /> as a logged-in trial user, then asserts that
 * EVERY recommendation in the "Start Here During Your 7-Day Reset" section
 * routes to a surface that's actually unlocked during the 7-day trial — i.e.
 * never to a deep link that would slam them into a lock screen / upgrade wall.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AssessmentResults } from "../AssessmentResults";
import { thermostatTypes } from "@/data/thermostatTypes";

// --- Mocks -----------------------------------------------------------------

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "trial-user-123", email: "trial@example.com" },
  }),
}));

vi.mock("@/hooks/useTrialStatus", async () => {
  const actual = await vi.importActual<any>("@/hooks/useTrialStatus");
  return {
    ...actual,
    useTrialStatus: () => ({ isTrialActive: true }),
  };
});

// Supabase: only the calls AssessmentResults makes during render.
//   - profiles select (full_name) — for auto-save
//   - profiles select (onboarding_reason, trial_tool_1, trial_tool_2) — for recs
//   - assessment_results insert — auto-save
//   - profiles update — last_thermostat_date / worth scores
vi.mock("@/integrations/supabase/client", () => {
  const profileRow = {
    full_name: "Test User",
    onboarding_reason: "relationships",
    trial_tool_1: "boundary-builder",
    trial_tool_2: "limiting-belief-rewriter",
  };
  const single = vi.fn().mockResolvedValue({ data: profileRow, error: null });
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const updateEq = vi.fn().mockResolvedValue({ data: null, error: null });
  const update = vi.fn(() => ({ eq: updateEq }));
  return {
    supabase: {
      from: vi.fn(() => ({ select, insert, update })),
      functions: { invoke: vi.fn().mockResolvedValue({ error: null }) },
    },
  };
});

vi.mock("html2canvas", () => ({ default: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// --- Helpers ---------------------------------------------------------------

// Routes that are accessible during the 7-day trial (no lock screen).
// Anything outside this set is a launch blocker per the product spec.
const TRIAL_SAFE_ROUTES = new Set([
  "/meditations",
  "/healing-tools",
  "/oracle",
  "/30-day-experience",
  "/patterns",
]);

// Build a valid answers map (25 questions, 1-5 scale) hitting "Settler" range.
const settlerAnswers: Record<number, number> = {};
for (let i = 1; i <= 25; i++) settlerAnswers[i] = 2; // total = 50 → low band

const settler = thermostatTypes.find((t) => t.name === "The Settler")!;

function renderResults() {
  return render(
    <MemoryRouter>
      <AssessmentResults
        firstName="Test"
        totalScore={50}
        percentage={40}
        thermostatType={settler}
        answers={settlerAnswers}
      />
    </MemoryRouter>,
  );
}

// --- Tests -----------------------------------------------------------------

describe("AssessmentResults — trial recommendation safety", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trial-mode heading", async () => {
    renderResults();
    expect(
      await screen.findByText(/Start Here During Your 7-Day Reset/i),
    ).toBeInTheDocument();
  });

  it("every recommended next step routes to a trial-unlocked surface", async () => {
    renderResults();

    // Wait for the profile fetch to resolve so personalized tool names render.
    const heading = await screen.findByText(
      /Start Here During Your 7-Day Reset/i,
    );
    const section = heading.closest("div")!;

    await waitFor(() => {
      const links = within(section).getAllByRole("link");
      expect(links.length).toBeGreaterThanOrEqual(5);
    });

    const links = within(section).getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href") || "";
      expect(
        TRIAL_SAFE_ROUTES.has(href),
        `Recommendation "${link.textContent?.trim()}" routes to ${href}, ` +
          `which is NOT in the trial-unlocked surface set. ` +
          `This will dump the user onto a lock screen.`,
      ).toBe(true);
    }
  });

  it("never recommends a specific oracle deck or spread (just /oracle)", async () => {
    renderResults();
    await screen.findByText(/Start Here During Your 7-Day Reset/i);

    // Any link that touches /oracle/... is a deep link into a deck/spread,
    // which during trial often gates behind tier checks.
    const links = screen.getAllByRole("link");
    const oracleLinks = links
      .map((l) => l.getAttribute("href") || "")
      .filter((h) => h.startsWith("/oracle"));

    expect(oracleLinks.length).toBeGreaterThan(0);
    for (const href of oracleLinks) {
      expect(href).toBe("/oracle");
    }
  });

  it("recommends ONLY the 3 trial-unlocked meditation titles by name", async () => {
    renderResults();
    const heading = await screen.findByText(
      /Start Here During Your 7-Day Reset/i,
    );
    const section = heading.closest("div")!;

    const allowedTitles = [
      "Permission Granted — Foundation Practice",
      "Morning Permission — Daily Morning Practice",
      "Evening Release — Daily Evening Practice",
    ];

    // Find the meditation row (the one whose link goes to /meditations)
    const medLink = within(section)
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/meditations");

    expect(medLink).toBeDefined();
    const text = medLink!.textContent || "";
    const matched = allowedTitles.some((t) => text.includes(t));
    expect(
      matched,
      `Meditation recommendation "${text}" does not match any of the 3 ` +
        `trial-unlocked titles: ${allowedTitles.join(", ")}`,
    ).toBe(true);
  });

  it("uses the user's assigned trial_tool_1 / trial_tool_2 (not arbitrary tools)", async () => {
    renderResults();
    const heading = await screen.findByText(
      /Start Here During Your 7-Day Reset/i,
    );
    const section = heading.closest("div")!;

    // Mocked profile assigned: boundary-builder + limiting-belief-rewriter
    // Friendly names (from TRIAL_TOOL_NAMES): "Boundary Builder" + "Limiting Belief Rewriter"
    await waitFor(() => {
      const sectionText = section.textContent || "";
      expect(sectionText).toMatch(/Boundary Builder/i);
      expect(sectionText).toMatch(/Limiting Belief Rewriter/i);
    });
  });
});
