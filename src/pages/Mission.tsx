import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

const PERMISSION_LIST = [
  "Stop surviving",
  "Stop bracing",
  "Stop carrying everything alone",
  "Rest without guilt",
  "Receive support",
  "Feel safe slowing down",
  "Stop overthinking every moment",
  "Believe peace is possible for you too",
];

const PURPLE = "#2d1a4d";
const GOLD = "#c9a84c";
const LAVENDER = "#9b7fc7";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Montserrat', sans-serif";

function GoldDivider() {
  return (
    <div className="flex justify-center my-8 sm:my-10 md:my-14">
      <div
        className="h-px w-20 sm:w-28 md:w-32"
        style={{ backgroundColor: GOLD, opacity: 0.7 }}
      />
    </div>
  );
}

function SectionSubhead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] mb-5 sm:mb-6 md:mb-8 text-center font-semibold"
      style={{ color: GOLD, fontFamily: SANS }}
    >
      {children}
    </p>
  );
}

export default function Mission() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: SERIF }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-12 sm:pb-16">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: PURPLE, fontFamily: SANS }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header */}
        <header className="text-center pt-8 sm:pt-10 md:pt-14">
          <p
            className="text-2xl sm:text-3xl font-bold tracking-wider mb-2"
            style={{ color: PURPLE, fontFamily: SERIF }}
          >
            1111
          </p>
          <div className="flex justify-center my-3 sm:my-4">
            <div className="h-px w-16 sm:w-20" style={{ backgroundColor: GOLD }} />
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 leading-[1.1]"
            style={{ color: PURPLE, fontFamily: SERIF }}
          >
            Permission Granted™
          </h1>
          <p
            className="italic text-base sm:text-lg md:text-xl"
            style={{ color: LAVENDER, fontFamily: SERIF }}
          >
            Why Reset Your Mind 1111 exists.
          </p>
        </header>

        <GoldDivider />

        {/* Section 1 */}
        <section>
          <p
            className="text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-relaxed text-center"
            style={{ color: PURPLE }}
          >
            You do not need another self-help lecture. You need Permission Granted™ for your nervous
            system to finally stop feeling like life is an emergency.
          </p>
        </section>

        <GoldDivider />

        {/* Section 2 — The Real Problem */}
        <section>
          <SectionSubhead>THE REAL PROBLEM</SectionSubhead>
          <div
            className="space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ color: PURPLE }}
          >
            <p>
              A lot of emotionally exhausted people are trying to: manifest abundance, heal
              emotionally, feel confident, receive love, rest, slow down, or 'raise their vibration'…
              while their body is still preparing for danger underneath it all.
            </p>
            <p>
              So even when they WANT peace — their nervous system keeps pulling them back toward:
              overthinking, hypervigilance, people pleasing, doom scrolling, burnout, emotional
              exhaustion, or survival mode.
            </p>
            <p>
              A nervous system conditioned for survival will often resist the very things the mind
              says it wants.
            </p>
          </div>
        </section>

        <GoldDivider />

        {/* Section 3 — Why We Built This */}
        <section>
          <SectionSubhead>WHY WE BUILT THIS</SectionSubhead>
          <div
            className="space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ color: PURPLE }}
          >
            <p>That's why we created Permission Granted™ and Reset Your Mind 1111.</p>
            <p>Not as another meditation app.</p>
            <p>Not as another healing course you never finish.</p>
            <p>Not as another place telling you to 'just think positive.'</p>
            <p>
              But as a nervous system and subconscious rewiring experience designed to help
              emotionally exhausted people finally teach their body what safety feels like again.
            </p>
          </div>
        </section>

        <GoldDivider />

        {/* Section 4 — Permission Granted To */}
        <section>
          <SectionSubhead>PERMISSION GRANTED™ TO:</SectionSubhead>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4 max-w-xl mx-auto">
            {PERMISSION_LIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 sm:gap-3 text-base sm:text-lg"
                style={{ color: PURPLE }}
              >
                <Sparkles
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-1"
                  style={{ color: GOLD }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <GoldDivider />

        {/* Section 5 — How We Do It */}
        <section>
          <SectionSubhead>HOW WE DO IT</SectionSubhead>
          <div
            className="space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ color: PURPLE }}
          >
            <p>
              Inside the experience we gently work with the nervous system through: guided regulation,
              somatic reset practices, visualization, emotional rewiring, manifestation through
              nervous system safety, and subconscious identity shifts.
            </p>
            <p>No forced positivity.</p>
            <p>No needing to 'be good' at healing.</p>
            <p>No pressure to share.</p>
            <p>Beginner safe.</p>
            <p>Gentle enough for overwhelmed nervous systems.</p>
            <p>Designed for emotionally exhausted people.</p>
          </div>
        </section>
      </div>

      {/* Closing — deep purple section */}
      <section
        className="px-5 sm:px-8 md:px-10 py-12 sm:py-16 md:py-20"
        style={{ backgroundColor: PURPLE }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-5 sm:mb-6"
            style={{ color: "#ffffff", fontFamily: SERIF }}
          >
            Because manifestation becomes very difficult when the body still feels unsafe receiving
            what the mind is asking for.
          </p>
          <p
            className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 sm:mb-10"
            style={{ color: GOLD, fontFamily: SERIF }}
          >
            Most people do not need more pressure. They need Permission Granted™ to finally feel safe
            again.
          </p>

          <div className="flex justify-center my-6 sm:my-8">
            <div
              className="h-px w-16 sm:w-20 md:w-24"
              style={{ backgroundColor: GOLD, opacity: 0.7 }}
            />
          </div>

          <p
            className="italic text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10"
            style={{ color: GOLD, fontFamily: SERIF }}
          >
            That's the work. 💜
          </p>

          <div style={{ color: "#ffffff", fontFamily: SERIF }} className="space-y-1">
            <p className="text-base sm:text-lg">— Lorie Wu</p>
            <p className="text-sm sm:text-base" style={{ color: LAVENDER }}>
              CEO, Reset Your Mind 1111™
            </p>
            <p className="text-sm sm:text-base" style={{ color: LAVENDER }}>
              Creator of Permission Granted™
            </p>
            <p className="text-sm sm:text-base" style={{ color: LAVENDER }}>
              Creator of The Worth Thermostat™
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
