import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onUpgrade: () => void;
  onRemindLater: () => void;
}

export function GiftedDay15Modal({ open, onUpgrade, onRemindLater }: Props) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10, 5, 25, 0.85)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-2xl p-8 text-center"
            style={{
              background: "#2d1a4d",
              border: "2px solid #C9A84C",
              boxShadow: "0 25px 60px -10px rgba(201, 168, 76, 0.4)",
            }}
          >
            <h2
              className="font-serif text-3xl md:text-4xl font-bold mb-5"
              style={{ color: "#C9A84C" }}
            >
              You're halfway through.
            </h2>

            <div className="font-serif italic text-sm leading-relaxed text-white/90 space-y-3 text-left">
              <p>
                15 days ago you were given a gift — full access to everything inside Reset Your
                Mind 1111™.
              </p>
              <p>And you've been showing up.</p>
              <p>Here's what I want you to know:</p>
              <p>
                Because you were gifted this access, you qualify for something no one else gets.
              </p>
              <p className="font-semibold not-italic" style={{ color: "#C9A84C" }}>
                Continue as a Founding Member for just $11 for your first 30 days.
              </p>
              <p>After that — $44/month. Cancel anytime.</p>
              <p>But this offer only exists while your gifted access is active.</p>
              <p>When it expires — so does the $11 rate.</p>
            </div>

            <button
              onClick={() => {
                onUpgrade();
                navigate("/upgrade");
              }}
              style={{ background: "#C9A84C", color: "#1a0f33" }}
              className="mt-6 w-full py-3 rounded-xl font-bold text-base hover:opacity-90"
            >
              Upgrade for $11 →
            </button>

            <button
              onClick={onRemindLater}
              className="mt-3 text-xs hover:underline"
              style={{ color: "#c8b3ff" }}
            >
              Remind me later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
