import { OracleCard } from './OracleCard';
import { OracleCard as OracleCardType, ReadingType } from '@/data/oracleCards';
import { motion } from 'framer-motion';

interface CardSpreadProps {
  reading: ReadingType;
  cards: OracleCardType[];
  flippedCards: number[];
  onFlipCard: (index: number) => void;
}

export const CardSpread = ({ reading, cards, flippedCards, onFlipCard }: CardSpreadProps) => {
  const getLayoutClass = () => {
    switch (reading.id) {
      case 'single':
      case 'yes-no':
        return 'flex justify-center';
      case 'three-card':
      case 'relationship':
      case 'career-money':
      case 'decision':
        return 'flex flex-wrap justify-center gap-6';
      case 'weekly':
        return 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4';
      case 'monthly':
        return 'grid grid-cols-2 md:grid-cols-4 gap-4';
      case 'life-areas':
        return 'flex flex-wrap justify-center gap-6';
      default:
        return 'flex flex-wrap justify-center gap-4';
    }
  };

  const getCardSize = () => {
    switch (reading.id) {
      case 'single':
      case 'yes-no':
        return 'lg';
      case 'weekly':
        return 'sm';
      default:
        return 'md';
    }
  };

  const renderYesNoResult = () => {
    if (reading.id !== 'yes-no' || cards.length === 0 || !flippedCards.includes(0)) return null;
    
    const isYes = cards[0].card_number <= 26;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`mt-6 p-6 rounded-xl text-center ${
          isYes 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}
      >
        <div className="text-4xl mb-2">{isYes ? '✓' : '✗'}</div>
        <h3 className={`text-2xl font-serif font-bold ${isYes ? 'text-green-600' : 'text-red-600'}`}>
          {isYes ? 'YES' : 'NO'}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Cards 1-26 indicate Yes • Cards 27-52 indicate No
        </p>
      </motion.div>
    );
  };

  const renderRelationshipLayout = () => {
    if (reading.id !== 'relationship' || cards.length < 3) return null;

    return (
      <div className="flex flex-col items-center gap-6">
        {/* Top card (Dynamic) */}
        <OracleCard
          card={cards[2]}
          position={reading.positions?.[2]}
          isFlipped={flippedCards.includes(2)}
          onFlip={() => onFlipCard(2)}
          size="md"
        />
        {/* Bottom two cards (Self & Other) */}
        <div className="flex gap-8">
          <OracleCard
            card={cards[0]}
            position={reading.positions?.[0]}
            isFlipped={flippedCards.includes(0)}
            onFlip={() => onFlipCard(0)}
            size="md"
          />
          <OracleCard
            card={cards[1]}
            position={reading.positions?.[1]}
            isFlipped={flippedCards.includes(1)}
            onFlip={() => onFlipCard(1)}
            size="md"
          />
        </div>
      </div>
    );
  };

  const renderLifeAreasLayout = () => {
    if (reading.id !== 'life-areas' || cards.length < 5) return null;

    return (
      <div className="flex flex-col items-center gap-4">
        {/* Top card (Love) */}
        <OracleCard
          card={cards[0]}
          position={reading.positions?.[0]}
          isFlipped={flippedCards.includes(0)}
          onFlip={() => onFlipCard(0)}
          size="md"
        />
        {/* Middle row (Career, Spiritual Growth) */}
        <div className="flex gap-16">
          <OracleCard
            card={cards[1]}
            position={reading.positions?.[1]}
            isFlipped={flippedCards.includes(1)}
            onFlip={() => onFlipCard(1)}
            size="md"
          />
          <OracleCard
            card={cards[4]}
            position={reading.positions?.[4]}
            isFlipped={flippedCards.includes(4)}
            onFlip={() => onFlipCard(4)}
            size="md"
          />
        </div>
        {/* Bottom row (Health, Money) */}
        <div className="flex gap-8">
          <OracleCard
            card={cards[2]}
            position={reading.positions?.[2]}
            isFlipped={flippedCards.includes(2)}
            onFlip={() => onFlipCard(2)}
            size="md"
          />
          <OracleCard
            card={cards[3]}
            position={reading.positions?.[3]}
            isFlipped={flippedCards.includes(3)}
            onFlip={() => onFlipCard(3)}
            size="md"
          />
        </div>
      </div>
    );
  };

  // Special layouts
  if (reading.id === 'relationship') {
    return (
      <div className="py-8">
        {renderRelationshipLayout()}
      </div>
    );
  }

  if (reading.id === 'life-areas') {
    return (
      <div className="py-8">
        {renderLifeAreasLayout()}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className={getLayoutClass()}>
        {cards.map((card, index) => (
          <motion.div
            key={`${card.deck_name}-${card.card_number}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OracleCard
              card={card}
              position={reading.positions?.[index]}
              isFlipped={flippedCards.includes(index)}
              onFlip={() => onFlipCard(index)}
              size={getCardSize() as 'sm' | 'md' | 'lg'}
            />
          </motion.div>
        ))}
      </div>
      {renderYesNoResult()}
    </div>
  );
};
