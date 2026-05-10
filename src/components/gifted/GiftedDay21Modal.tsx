import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  daysElapsed: number;
  toolsOpened: number;
  resetsCompleted: number;
  currentStreak: number;
  daysRemaining: number;
  onClose: () => void;
}

export function GiftedDay21Modal({
  open,
  daysElapsed,
  toolsOpened,
  resetsCompleted,
  currentStreak,
  daysRemaining,
  onClose,
}: Props) {
  const navigate = useNavigate();

  const stats = [
    { label: "Days of Resets", value: daysElapsed },
    { label: "Tools Explored", value: toolsOpened },
    { label: "Resets Completed", value: resetsCompleted },
    { label: "Day Streak", value: currentStreak },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10, 5, 25, 0.6)" }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl p-8 text-center bg-white max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "0 25px 60px -10px rgba(61, 42, 92, 0.4)" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3"
              style={{ color: "#9b7fcc" }}
            >
              21 DAYS IN
            </p>
            <h2
              className="font-serif text-3xl md:text-4xl font-bold mb-6"
              style={{ color: "#3d2a5c" }}
            >
              Look how far you've come.
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4"
                  style={{
                    border: "2px solid #C9A84C",
                    background: "linear-gradient(180deg, #fffaec 0%, #ffffff 100%)",
                  }}
                >
                  <div
                    className="font-serif text-3xl font-bold"
                    style={{ color: "#3d2a5c" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#3d2a5c", opacity: 0.7 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="font-serif italic text-sm leading-relaxed space-y-3 text-left mb-6"
              style={{ color: "#3d2a5c" }}
            >
              <p>
                You have {daysRemaining} {daysRemaining === 1 ? "day" : "days"} of gifted access
                left.
              </p>
              <p>When it expires — all of this stays with you.</p>
              <p>Your progress, your history, your tools.</p>
              <p>But only if you continue.</p>
              <p className="font-semibold not-italic" style={{ color: "#b8922a" }}>
                Founding Member rate: $11 for your first 30 days.
              </p>
              <p>This offer expires with your free access.</p>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate("/upgrade");
              }}
              style={{ background: "#3d2a5c", color: "#C9A84C" }}
              className="w-full py-3 rounded-xl font-bold text-base hover:opacity-90"
            >
              Continue My Journey — $11 →
            </button>
            <button
              onClick={onClose}
              className="mt-3 text-xs text-gray-500 hover:underline"
            >
              I'll decide later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
