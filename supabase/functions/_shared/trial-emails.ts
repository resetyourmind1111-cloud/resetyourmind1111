// Day 1-7 trial email copy. Each email returns subject + HTML body.
// Personalized with first name and onboarding_reason where useful.

const BRAND_DARK = "#06060e";
const BRAND_GOLD = "#C9A84C";
const BRAND_CREAM = "#F9F6F0";
const APP_URL = "https://resetyourmind1111.lovable.app";

function shell(innerHtml: string, ctaText: string, ctaPath: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND_DARK};font-family:Georgia,serif;color:${BRAND_CREAM};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_DARK};padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#0a0a14;border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:40px 32px;">
<tr><td>
<div style="text-align:center;font-size:13px;letter-spacing:3px;color:${BRAND_GOLD};margin-bottom:32px;">RESET YOUR MIND 1111&trade;</div>
${innerHtml}
<div style="text-align:center;margin:36px 0 8px;">
<a href="${APP_URL}${ctaPath}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_DARK};text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-family:Arial,sans-serif;letter-spacing:0.5px;">${ctaText}</a>
</div>
<p style="text-align:center;font-size:12px;color:rgba(249,246,240,0.5);margin-top:32px;font-family:Arial,sans-serif;">
Reset Your Mind 1111&trade; &middot; <a href="${APP_URL}/account" style="color:rgba(249,246,240,0.5);">Notification settings</a>
</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

const reasonHook: Record<string, string> = {
  stuck: "the part of you that's been quietly stuck",
  sabotage: "the pattern that keeps interrupting your momentum",
  relationships: "the relationships you keep recreating",
  levelup: "the next version of you that's been waiting",
};

export interface TrialEmail {
  day: number;
  subject: string;
  html: (firstName: string, reason: string | null) => string;
}

export const TRIAL_EMAILS: TrialEmail[] = [
  {
    day: 1,
    subject: "Welcome to your reset",
    html: (n) => shell(
      `<h1 style="font-size:28px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">Welcome, ${n}.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">You just made a quiet, powerful choice — to stop settling for crumbs.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Over the next 7 days, you'll meet the parts of yourself that have been waiting for permission. No pressure. No performance. Just a daily 5-minute practice that rewires what you'll accept as normal.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your first permission slip is waiting inside.</p>`,
      "Open Day 1 →", "/home"
    ),
  },
  {
    day: 2,
    subject: "Day 2 — the hardest day is the next one",
    html: (n, r) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, here's the truth no one tells you.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Day 2 is where most people quietly drift. The novelty wears off. Life gets loud. ${r && reasonHook[r] ? `And ${reasonHook[r]} starts whispering that nothing is really changing.` : "And the old patterns start whispering that nothing is really changing."}</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">It is. Five minutes today. That's all.</p>`,
      "Continue My Reset →", "/home"
    ),
  },
  {
    day: 3,
    subject: "Day 3 — something special inside",
    html: (n) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, you made it through the dip.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">This is the day most people stop. You didn't. That tells me something about who you actually are.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">There's a Founding Member offer waiting in your app today — only because you're here, doing the work. 111 spots, $44/mo locked while you stay active. No pressure to claim it. But I wanted you to see it.</p>`,
      "See What's Inside →", "/home"
    ),
  },
  {
    day: 4,
    subject: "Day 4 — your nervous system is listening",
    html: (n) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, the body keeps the receipts.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your nervous system has been holding the patterns longer than your mind has. Today's practice is for the body — not the mind.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Five minutes. That's the whole ask.</p>`,
      "Open Day 4 →", "/home"
    ),
  },
  {
    day: 5,
    subject: "Day 5 — the proof is starting to show",
    html: (n) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, notice what's different.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">By Day 5, something subtle starts shifting. A pause before the old reaction. A second of softness you didn't have before. The fact that you're still here.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Today's tool will help you name it.</p>`,
      "Continue →", "/home"
    ),
  },
  {
    day: 6,
    subject: "Day 6 — a gift is waiting",
    html: (n) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, I left you something.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Open the app today. There's a gift card on your home screen — only visible once, only on Day 6, only for you.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Tomorrow is your last day of preview. Today is for celebration.</p>`,
      "Open My Gift →", "/home"
    ),
  },
  {
    day: 7,
    subject: "Day 7 — the real choice begins",
    html: (n) => shell(
      `<h1 style="font-size:26px;color:${BRAND_GOLD};margin:0 0 16px;font-weight:400;">${n}, you finished what you started.</h1>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Most people don't make it here. You did. That's not nothing — that's the pattern breaking.</p>
<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your preview ends today. The next chapter — the real reset — is on the other side. Founding Member spots are still open. Choose what's next for you.</p>`,
      "Claim Your Spot →", "/upgrade"
    ),
  },
];
