import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCard as OracleCardType } from '@/data/oracleCards';

interface OracleCardProps {
  card: OracleCardType;
  position?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const OracleCard = ({ 
  card, 
  position, 
  isFlipped = false, 
  onFlip, 
  size = 'md',
  showDetails = false 
}: OracleCardProps) => {
  const [flipped, setFlipped] = useState(isFlipped);

  const handleFlip = () => {
    if (!flipped && onFlip) {
      onFlip();
    }
    setFlipped(true);
  };

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-40 h-56',
    lg: 'w-56 h-80',
  };

  const isPermissionDeck = card.deck_name === 'Permission Granted';

  return (
    <div className="flex flex-col items-center gap-2">
      {position && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
          {position}
        </span>
      )}
      <motion.div
        className={`${sizeClasses[size]} cursor-pointer perspective-1000`}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Back */}
          <div
            className={`absolute inset-0 rounded-xl flex items-center justify-center ${
              isPermissionDeck 
                ? 'bg-gradient-to-br from-primary via-purple-600 to-primary-foreground/20' 
                : 'bg-gradient-to-br from-accent via-amber-500 to-yellow-600'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-2 rounded-lg border-2 border-white/30 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <div className="text-3xl mb-2">✨</div>
                <div className="font-serif text-sm font-semibold">
                  {isPermissionDeck ? 'Permission Granted' : 'Abundance'}
                </div>
                <div className="text-xs opacity-70 mt-1">Oracle</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-3 left-3 w-6 h-6 border border-white/40 rotate-45" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border border-white/40 rotate-45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
          </div>

          {/* Card Front */}
          <div
            className="absolute inset-0 rounded-xl bg-card border border-border shadow-lg overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className={`p-3 text-center ${
              isPermissionDeck 
                ? 'bg-gradient-to-r from-primary/10 to-purple-500/10' 
                : 'bg-gradient-to-r from-accent/10 to-amber-500/10'
            }`}>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {card.category}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <h3 className={`font-serif text-base md:text-lg font-semibold mb-2 ${
                isPermissionDeck ? 'text-primary' : 'text-accent'
              }`}>
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground italic leading-relaxed">
                "{card.message}"
              </p>
            </div>
            <div className={`py-2 text-center text-[10px] text-muted-foreground ${
              isPermissionDeck 
                ? 'bg-gradient-to-r from-primary/5 to-purple-500/5' 
                : 'bg-gradient-to-r from-accent/5 to-amber-500/5'
            }`}>
              Card {card.card_number}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Card Details */}
      <AnimatePresence>
        {showDetails && flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 glass-card max-w-md"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Guidebook Message</h4>
                <p className="text-sm">{card.guidebook_text}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Deep Love Question</h4>
                <p className="text-sm italic text-primary">{card.deep_love_question}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Affirmation</h4>
                <p className="text-sm font-medium">{card.affirmation}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Integration Prompt</h4>
                <p className="text-sm">{card.integration_prompt}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
