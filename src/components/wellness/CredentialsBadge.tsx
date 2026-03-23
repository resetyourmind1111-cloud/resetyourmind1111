export function CredentialsBadge() {
  return (
    <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-6 mb-8 text-center">
      <p className="text-sm text-accent font-semibold tracking-wide uppercase mb-2">
        Created by Lorie Wu — The Emotional Surgeon™
      </p>
      <p className="text-sm text-muted-foreground mb-3">Master Certified Practitioner:</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-foreground/80">
        <span>✦ Neuro-Linguistic Programming (NLP)</span>
        <span>✦ Timeline Therapy™</span>
        <span>✦ Hypnotherapy</span>
        <span>✦ 6 MindShifting Techniques</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 italic">
        (Problems · Blockages · Trauma · Identity · Reality · Beliefs)
      </p>
    </div>
  );
}
