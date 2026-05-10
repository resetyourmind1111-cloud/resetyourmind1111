import { Sparkles } from "lucide-react";

const BULLETS = [
  "No forced positivity",
  "No needing to 'be good' at healing",
  "No pressure to share",
  "Beginner safe",
  "Gentle enough for overwhelmed nervous systems",
  "Designed for emotionally exhausted people",
];

/**
 * Permission Granted™ positioning section.
 * Designed to sit above the pricing tiers on /upgrade.
 * Uses literal brand hex tokens per spec (deep purple #2d1a4d, gold #c9a84c, lavender #9b7fc7).
 */
export function PermissionGrantedSection() {
  return (
    <section
      className="w-full py-16 md:py-24 px-6 md:px-10"
      style={{ backgroundColor: "#2d1a4d", fontFamily: "'Cormorant Garamond', serif" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl md:text-5xl font-semibold mb-10 leading-tight"
          style={{ color: "#c9a84c", fontFamily: "'Cormorant Garamond', serif" }}
        >
          Why Reset Your Mind 1111™ is different.
        </h2>

        <div
          className="space-y-6 text-lg md:text-xl leading-relaxed text-left md:text-center"
          style={{ color: "#ffffff" }}
        >
          <p>
            You do not need another self-help lecture. You need Permission Granted™ for your nervous
            system to finally stop feeling like life is an emergency.
          </p>
          <p>
            A nervous system conditioned for survival will often resist the very things the mind says
            it wants.
          </p>
          <p>
            That's why Reset Your Mind 1111™ is not another meditation app. Not another healing course
            you never finish. Not another place telling you to 'just think positive.'
          </p>
          <p>
            It's a nervous system and subconscious rewiring experience designed to help emotionally
            exhausted people finally teach their body what safety feels like again.
          </p>
        </div>

        <ul className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-left max-w-2xl mx-auto">
          {BULLETS.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 text-base md:text-lg"
              style={{ color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}
            >
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "#9b7fc7" }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div
          className="mt-14 italic text-xl md:text-2xl leading-relaxed"
          style={{ color: "#c9a84c", fontFamily: "'Cormorant Garamond', serif" }}
        >
          <p>
            Because manifestation becomes very difficult when the body still feels unsafe receiving
            what the mind is asking for.
          </p>
          <p className="mt-4">
            Most people do not need more pressure. They need Permission Granted™.
          </p>
        </div>

        <p
          className="mt-10 text-xs uppercase tracking-[0.3em]"
          style={{ color: "#9b7fc7", fontFamily: "'Montserrat', sans-serif" }}
        >
          Choose your path below
        </p>
      </div>
    </section>
  );
}
