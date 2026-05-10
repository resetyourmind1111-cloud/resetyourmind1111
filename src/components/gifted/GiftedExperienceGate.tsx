import { useState, useEffect } from "react";
import { useGiftedAccess } from "@/hooks/useGiftedAccess";
import { GiftedDay15Modal } from "./GiftedDay15Modal";
import { GiftedDay21Modal } from "./GiftedDay21Modal";

export function GiftedExperienceGate() {
  const {
    isGifted,
    daysElapsed,
    daysRemaining,
    day15ModalShown,
    day21ModalShown,
    toolsOpened,
    resetsCompleted,
    currentStreak,
    markModalShown,
  } = useGiftedAccess();

  const [open15, setOpen15] = useState(false);
  const [open21, setOpen21] = useState(false);

  useEffect(() => {
    if (!isGifted) return;
    // Day 21 takes precedence if both are due (covers "remind me later" path)
    if (daysElapsed >= 21 && !day21ModalShown) {
      setOpen21(true);
      return;
    }
    if (daysElapsed >= 15 && !day15ModalShown) {
      setOpen15(true);
    }
  }, [isGifted, daysElapsed, day15ModalShown, day21ModalShown]);

  if (!isGifted) return null;

  return (
    <>
      <GiftedDay15Modal
        open={open15}
        onUpgrade={async () => {
          setOpen15(false);
          await markModalShown("day15");
        }}
        onRemindLater={async () => {
          setOpen15(false);
          await markModalShown("day15", true);
        }}
      />
      <GiftedDay21Modal
        open={open21}
        daysElapsed={daysElapsed}
        toolsOpened={toolsOpened}
        resetsCompleted={resetsCompleted}
        currentStreak={currentStreak}
        daysRemaining={daysRemaining}
        onClose={async () => {
          setOpen21(false);
          await markModalShown("day21");
        }}
      />
    </>
  );
}
