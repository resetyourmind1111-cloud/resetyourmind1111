import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Minimal PDF generator — builds a valid PDF 1.4 from scratch
function buildPdf(report: any, userName: string): Uint8Array {
  const objects: string[] = [];
  let objectCount = 0;
  const offsets: number[] = [];

  function addObject(content: string): number {
    objectCount++;
    objects.push(content);
    return objectCount;
  }

  // Color constants (RGB 0-1)
  const GOLD = { r: 0.788, g: 0.659, b: 0.298 }; // #C9A84C
  const DARK = { r: 0.024, g: 0.024, b: 0.055 }; // #06060e
  const PURPLE = { r: 0.545, g: 0.361, b: 0.796 }; // purple-ish
  const EMERALD = { r: 0.196, g: 0.722, b: 0.529 };
  const AMBER = { r: 0.961, g: 0.620, b: 0.043 };
  const ROSE = { r: 0.878, g: 0.325, b: 0.420 };
  const WHITE = { r: 1, g: 1, b: 1 };
  const GRAY = { r: 0.6, g: 0.6, b: 0.65 };

  const PAGE_W = 612; // US Letter
  const PAGE_H = 792;
  const MARGIN = 54;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  // We'll collect drawing commands per page
  const pages: string[][] = [[]];
  let curY = PAGE_H - MARGIN;

  function currentPage(): string[] {
    return pages[pages.length - 1];
  }

  function newPage() {
    pages.push([]);
    curY = PAGE_H - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (curY - needed < MARGIN + 20) {
      newPage();
    }
  }

  // Text helpers — escape PDF string
  function esc(text: string): string {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2014/g, " - ")
      .replace(/\u2013/g, "-")
      .replace(/[\u2026]/g, "...")
      .replace(/[^\x00-\x7F]/g, ""); // strip remaining non-ASCII
  }

  function setColor(c: { r: number; g: number; b: number }) {
    currentPage().push(`${c.r.toFixed(3)} ${c.g.toFixed(3)} ${c.b.toFixed(3)} rg`);
    currentPage().push(`${c.r.toFixed(3)} ${c.g.toFixed(3)} ${c.b.toFixed(3)} RG`);
  }

  function drawRect(x: number, y: number, w: number, h: number, fill: { r: number; g: number; b: number }) {
    currentPage().push(`${fill.r.toFixed(3)} ${fill.g.toFixed(3)} ${fill.b.toFixed(3)} rg`);
    currentPage().push(`${x} ${y} ${w} ${h} re f`);
  }

  function drawLine(x1: number, y1: number, x2: number, y2: number, color: { r: number; g: number; b: number }, width = 0.5) {
    currentPage().push(`${color.r.toFixed(3)} ${color.g.toFixed(3)} ${color.b.toFixed(3)} RG`);
    currentPage().push(`${width} w`);
    currentPage().push(`${x1} ${y1} m ${x2} ${y2} l S`);
  }

  // Word-wrap text to fit width, return lines
  function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
    const avgCharWidth = fontSize * 0.48; // approximation for Helvetica
    const maxChars = Math.floor(maxWidth / avgCharWidth);
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      if (current.length + word.length + 1 > maxChars && current.length > 0) {
        lines.push(current);
        current = word;
      } else {
        current = current ? current + " " + word : word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawText(text: string, x: number, fontSize: number, color: { r: number; g: number; b: number }, fontKey = "/F1", maxWidth = CONTENT_W) {
    const lines = wrapText(text, fontSize, maxWidth);
    const lineHeight = fontSize * 1.45;

    for (const line of lines) {
      ensureSpace(lineHeight);
      setColor(color);
      currentPage().push(`BT ${fontKey} ${fontSize} Tf ${x} ${curY} Td (${esc(line)}) Tj ET`);
      curY -= lineHeight;
    }
  }

  function drawCenteredText(text: string, fontSize: number, color: { r: number; g: number; b: number }, fontKey = "/F1") {
    const lines = wrapText(text, fontSize, CONTENT_W - 40);
    const lineHeight = fontSize * 1.45;

    for (const line of lines) {
      ensureSpace(lineHeight);
      const textWidth = line.length * fontSize * 0.48;
      const x = (PAGE_W - textWidth) / 2;
      setColor(color);
      currentPage().push(`BT ${fontKey} ${fontSize} Tf ${x} ${curY} Td (${esc(line)}) Tj ET`);
      curY -= lineHeight;
    }
  }

  function drawSection(title: string, body: string, accentColor: { r: number; g: number; b: number }) {
    ensureSpace(60);

    // Accent bar
    drawRect(MARGIN, curY - 2, 3, 16, accentColor);

    // Title
    setColor(accentColor);
    currentPage().push(`BT /F2 10 Tf ${MARGIN + 12} ${curY} Td (${esc(title.toUpperCase())}) Tj ET`);
    curY -= 20;

    // Body
    drawText(body, MARGIN + 12, 10, GRAY, "/F1", CONTENT_W - 20);
    curY -= 8;

    // Divider
    drawLine(MARGIN, curY, PAGE_W - MARGIN, curY, { r: 0.15, g: 0.15, b: 0.18 });
    curY -= 16;
  }

  // ═══════════════════════════════════════
  // PAGE 1 — Cover / Title
  // ═══════════════════════════════════════

  // Dark background
  drawRect(0, 0, PAGE_W, PAGE_H, DARK);

  // Gold accent line at top
  drawRect(0, PAGE_H - 4, PAGE_W, 4, GOLD);

  // Title area
  curY = PAGE_H - 120;

  // Small label
  drawCenteredText("YOUR TRANSFORMATION REPORT", 9, GOLD, "/F2");
  curY -= 12;

  // Gold divider
  drawLine(PAGE_W / 2 - 60, curY, PAGE_W / 2 + 60, curY, GOLD, 1);
  curY -= 30;

  // Report title
  const reportTitle = report.reportTitle || "Your Transformation";
  drawCenteredText(reportTitle, 22, WHITE, "/F2");
  curY -= 20;

  // User name
  if (userName) {
    drawCenteredText(`Prepared for ${userName}`, 11, GRAY, "/F1");
    curY -= 8;
  }

  // Date
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  drawCenteredText(dateStr, 9, GRAY, "/F1");
  curY -= 40;

  // Gold divider
  drawLine(PAGE_W / 2 - 80, curY, PAGE_W / 2 + 80, curY, GOLD, 0.5);
  curY -= 30;

  // Transformation summary
  if (report.transformationSummary) {
    drawText(report.transformationSummary, MARGIN + 30, 11, { r: 0.85, g: 0.85, b: 0.88 }, "/F1", CONTENT_W - 60);
  }

  // Footer line
  drawRect(0, 36, PAGE_W, 0.5, GOLD);
  setColor(GRAY);
  currentPage().push(`BT /F1 7 Tf ${MARGIN} 22 Td (Your Mind Reset  |  Transformation Report) Tj ET`);

  // ═══════════════════════════════════════
  // PAGE 2+ — Content
  // ═══════════════════════════════════════
  newPage();
  drawRect(0, 0, PAGE_W, PAGE_H, DARK);
  drawRect(0, PAGE_H - 3, PAGE_W, 3, GOLD);

  curY = PAGE_H - MARGIN - 10;

  // Key Insights
  if (report.topInsights && report.topInsights.length > 0) {
    setColor(GOLD);
    currentPage().push(`BT /F2 12 Tf ${MARGIN} ${curY} Td (KEY INSIGHTS) Tj ET`);
    curY -= 8;
    drawLine(MARGIN, curY, MARGIN + 80, curY, GOLD, 1);
    curY -= 20;

    for (const insight of report.topInsights) {
      drawSection(insight.title, insight.insight, PURPLE);
    }
  }

  // Growth Evidence
  if (report.growthEvidence) {
    drawSection("Growth Evidence", report.growthEvidence, EMERALD);
  }

  // Core Strength
  if (report.strengthProfile) {
    drawSection("Your Core Strength", report.strengthProfile, GOLD);
  }

  // Blind Spot
  if (report.blindSpot) {
    drawSection("Your Blind Spot", report.blindSpot, AMBER);
  }

  // Next Chapter
  if (report.nextChapter) {
    ensureSpace(100);

    // Header
    setColor(PURPLE);
    currentPage().push(`BT /F2 12 Tf ${MARGIN} ${curY} Td (YOUR NEXT CHAPTER) Tj ET`);
    curY -= 8;
    drawLine(MARGIN, curY, MARGIN + 100, curY, PURPLE, 1);
    curY -= 24;

    if (report.nextChapter.focus) {
      drawText("FOCUS:", MARGIN + 8, 8, PURPLE, "/F2", CONTENT_W - 20);
      drawText(report.nextChapter.focus, MARGIN + 8, 10, GRAY, "/F1", CONTENT_W - 20);
      curY -= 8;
    }

    if (report.nextChapter.action) {
      drawText("THIS WEEK'S ACTION:", MARGIN + 8, 8, GOLD, "/F2", CONTENT_W - 20);
      drawText(report.nextChapter.action, MARGIN + 8, 10, GRAY, "/F1", CONTENT_W - 20);
      curY -= 8;
    }

    if (report.nextChapter.affirmation) {
      ensureSpace(40);
      // Affirmation box
      const boxH = 36;
      drawRect(MARGIN, curY - boxH + 10, CONTENT_W, boxH, { r: 0.06, g: 0.06, b: 0.08 });
      drawRect(MARGIN, curY - boxH + 10, 3, boxH, GOLD);
      curY -= 6;
      drawText(`"${report.nextChapter.affirmation}"`, MARGIN + 16, 10, WHITE, "/F1", CONTENT_W - 40);
      curY -= boxH - 14;
    }

    curY -= 12;
    drawLine(MARGIN, curY, PAGE_W - MARGIN, curY, { r: 0.15, g: 0.15, b: 0.18 });
    curY -= 20;
  }

  // Celebration Message
  if (report.celebrationMessage) {
    ensureSpace(80);

    drawCenteredText("A LETTER FROM YOUR FUTURE SELF", 9, ROSE, "/F2");
    curY -= 6;
    drawLine(PAGE_W / 2 - 40, curY, PAGE_W / 2 + 40, curY, ROSE, 0.5);
    curY -= 16;

    drawText(`"${report.celebrationMessage}"`, MARGIN + 20, 10.5, { r: 0.85, g: 0.82, b: 0.88 }, "/F1", CONTENT_W - 40);
  }

  // Footer on last page
  curY = 36;
  drawRect(0, 36, PAGE_W, 0.5, GOLD);
  setColor(GRAY);
  currentPage().push(`BT /F1 7 Tf ${MARGIN} 22 Td (Your Mind Reset  |  yourmind.reset  |  Generated ${dateStr}) Tj ET`);

  // ═══════════════════════════════════════
  // Assemble PDF
  // ═══════════════════════════════════════

  // Catalog, Pages, Fonts
  const catalogId = addObject("<<\n/Type /Catalog\n/Pages 2 0 R\n>>");
  const pagesId = addObject(""); // placeholder — filled below
  const font1Id = addObject("<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n/Encoding /WinAnsiEncoding\n>>");
  const font2Id = addObject("<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n/Encoding /WinAnsiEncoding\n>>");

  // Page objects
  const pageObjIds: number[] = [];
  const streamObjIds: number[] = [];

  for (let i = 0; i < pages.length; i++) {
    const streamContent = pages[i].join("\n");
    const streamId = addObject(`<<\n/Length ${streamContent.length}\n>>\nstream\n${streamContent}\nendstream`);
    streamObjIds.push(streamId);

    const pageId = addObject(
      `<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 ${PAGE_W} ${PAGE_H}]\n` +
      `/Contents ${streamId} 0 R\n` +
      `/Resources <<\n/Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >>\n>>\n>>`
    );
    pageObjIds.push(pageId);
  }

  // Fix Pages object
  const pageRefs = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  objects[pagesId - 1] = `<<\n/Type /Pages\n/Kids [${pageRefs}]\n/Count ${pages.length}\n>>`;

  // Build final PDF bytes
  let pdf = "%PDF-1.4\n%\xC0\xC1\xC2\xC3\n";

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<<\n/Size ${objects.length + 1}\n/Root ${catalogId} 0 R\n>>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { report, userName } = await req.json();

    if (!report) {
      return new Response(JSON.stringify({ error: "No report data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdfBytes = buildPdf(report, userName || "");

    // Return as base64 so the client can create a blob
    const base64 = btoa(String.fromCharCode(...pdfBytes));

    return new Response(JSON.stringify({ pdf: base64 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-report-pdf error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
