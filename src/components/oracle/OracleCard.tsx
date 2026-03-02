import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCard as OracleCardType } from '@/data/oracleCards';
import { getCardImage, getCardImageForNumber } from '@/data/cardImageMap';

interface OracleCardProps {
  card: OracleCardType;
  position?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const deckColors: Record<string, { gradient: string; label: string }> = {
  'Permission Granted': { gradient: 'from-[hsl(271,60%,27%)] via-[hsl(280,50%,35%)] to-[hsl(271,60%,27%)]/80', label: 'Permission Granted' },
  'Abundance': { gradient: 'from-[hsl(130,15%,55%)] via-[hsl(130,20%,40%)] to-[hsl(43,52%,54%)]', label: 'Abundance' },
  'Relationship Guidance': { gradient: 'from-[hsl(340,40%,55%)] via-[hsl(340,45%,40%)] to-[hsl(340,40%,55%)]/80', label: 'Relationship' },
};

export const OracleCard = ({ 
  card, 
  position, 
  isFlipped = false, 
  onFlip, 
  size = 'md',
  showDetails = false 
}: OracleCardProps) => {
  const [flipped, setFlipped] = useState(isFlipped);
  const [imageFailed, setImageFailed] = useState(false);

  const mappedCardImage = card.deck_name === 'Permission Granted' ? getCardImage(card.title) : null;
  const cardImage = mappedCardImage ?? (card.deck_name === 'Permission Granted' ? getCardImageForNumber(card.card_number) : null);
  const showTextOverlay = Boolean(mappedCardImage);

  const handleFlip = () => {
    if (!flipped && onFlip) {
      onFlip();
    }
    setFlipped(true);
  };

  const sizeClasses = {
    sm: 'w-28 h-40',
    md: 'w-44 h-64',
    lg: 'w-64 h-96',
  };

  const deckStyle = deckColors[card.deck_name] || deckColors['Permission Granted'];

  return (
    <div className="flex flex-col items-center gap-2">
      {position && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center max-w-[120px]">
          {position}
        </span>
      )}
      <motion.div
        className={`${sizeClasses[size]} cursor-pointer`}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ perspective: 1000 }}
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
            className={`absolute inset-0 rounded-xl shadow-xl bg-gradient-to-br ${deckStyle.gradient}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-2 rounded-lg border-2 border-foreground/20 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">✨</div>
                <div className="font-serif text-sm font-semibold text-foreground">
                  {deckStyle.label}
                </div>
                <div className="text-xs opacity-70 mt-1 text-foreground">Oracle</div>
              </div>
            </div>
            <div className="absolute top-3 left-3 w-6 h-6 border border-foreground/30 rotate-45" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border border-foreground/30 rotate-45" />
          </div>

          {/* Card Front */}
          <div
            className="absolute inset-0 rounded-xl shadow-xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {cardImage && !imageFailed ? (
              <div className="relative w-full h-full">
                <img
                  src={cardImage}
                  alt={`${card.title} oracle card`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain bg-card"
                  onError={() => setImageFailed(true)}
                />
                {showTextOverlay && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                      <h3 className="font-serif text-sm md:text-base font-bold text-foreground drop-shadow-lg uppercase tracking-wide">
                        {card.title}
                      </h3>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="inline-block text-[8px] uppercase tracking-wider text-foreground/90 bg-background/40 px-2 py-1 rounded-full">
                        {card.category}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-card border border-border flex flex-col">
                <div className={`p-2 text-center bg-gradient-to-r ${deckStyle.gradient} opacity-20`}>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {card.category}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="text-4xl mb-3">
                    {card.deck_name === 'Permission Granted' ? '💜' : card.deck_name === 'Abundance' ? '✨' : '🌹'}
                  </div>
                  <h3 className="font-serif text-sm md:text-base font-semibold mb-2 text-primary">
                    {card.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground italic leading-relaxed">
                    "{card.message}"
                  </p>
                </div>
                <div className="py-1.5 text-center text-[9px] text-muted-foreground bg-muted/30">
                  Card {card.card_number}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

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
