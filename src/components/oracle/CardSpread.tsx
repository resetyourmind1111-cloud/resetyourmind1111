import { OracleCard } from './OracleCard';
import { OracleCard as OracleCardType, SpreadTemplate } from '@/data/oracleCards';
import { motion } from 'framer-motion';

interface CardSpreadProps {
  spread: SpreadTemplate;
  cards: OracleCardType[];
  flippedCards: number[];
  onFlipCard: (index: number) => void;
}

export const CardSpread = ({ spread, cards, flippedCards, onFlipCard }: CardSpreadProps) => {
  const getPositionLabel = (index: number): string => {
    const meanings = spread.position_meanings;
    if (!meanings?.[index]) return `Card ${index + 1}`;
    // Extract the short label before the dash
    const full = meanings[index];
    const dashIndex = full.indexOf('—');
    return dashIndex > 0 ? full.substring(0, dashIndex).trim() : full;
  };

  const getCardSize = (): 'sm' | 'md' | 'lg' => {
    if (spread.number_of_cards === 1) return 'lg';
    if (spread.number_of_cards >= 7) return 'sm';
    return 'md';
  };

  const renderCard = (index: number, size?: 'sm' | 'md' | 'lg') => {
    if (!cards[index]) return null;
    return (
      <motion.div
        key={`${cards[index].deck_name}-${cards[index].card_number}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <OracleCard
          card={cards[index]}
          position={getPositionLabel(index)}
          isFlipped={flippedCards.includes(index)}
          onFlip={() => onFlipCard(index)}
          size={size || getCardSize()}
        />
      </motion.div>
    );
  };

  // Default grid layout
  const renderDefaultLayout = () => (
    <div className="flex flex-wrap justify-center gap-6">
      {cards.map((_, index) => renderCard(index))}
    </div>
  );

  // Two-column layout (pairs of cards)
  const renderTwoColumnLayout = () => {
    const pairs: number[][] = [];
    for (let i = 0; i < cards.length; i += 2) {
      pairs.push(i + 1 < cards.length ? [i, i + 1] : [i]);
    }
    return (
      <div className="flex flex-col items-center gap-6">
        {pairs.map((pair, pairIdx) => (
          <div key={pairIdx} className="flex gap-8 justify-center">
            {pair.map(i => renderCard(i))}
          </div>
        ))}
      </div>
    );
  };

  // Single card center
  const renderSingleLayout = () => (
    <div className="flex justify-center">
      {renderCard(0, 'lg')}
    </div>
  );

  // Three in a row
  const renderThreeRowLayout = () => (
    <div className="flex justify-center gap-6 flex-wrap">
      {cards.map((_, i) => renderCard(i))}
    </div>
  );

  // 2x2 grid
  const renderTwoByTwoLayout = () => (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8 justify-center">
        {renderCard(0)}
        {renderCard(1)}
      </div>
      <div className="flex gap-8 justify-center">
        {renderCard(2)}
        {cards.length > 3 && renderCard(3)}
      </div>
    </div>
  );

  // Deep Love spread (cross pattern): 5 center, 2 left, 3 right, 4 bottom, 1 top
  const renderDeepLoveLayout = () => (
    <div className="flex flex-col items-center gap-4">
      {renderCard(4)}
      <div className="flex gap-8 justify-center items-center">
        {renderCard(1)}
        {renderCard(0)}
        {renderCard(2)}
      </div>
      {renderCard(3)}
    </div>
  );

  // Stay or Go: decision tree
  const renderStayOrGoLayout = () => (
    <div className="flex flex-col items-center gap-4">
      {renderCard(0, 'md')}
      <div className="flex gap-12 justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-serif font-bold text-muted-foreground uppercase tracking-wider">Stay</span>
          {renderCard(1, 'sm')}
          {renderCard(2, 'sm')}
          {renderCard(3, 'sm')}
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-serif font-bold text-muted-foreground uppercase tracking-wider">Go</span>
          {renderCard(4, 'sm')}
          {renderCard(5, 'sm')}
          {renderCard(6, 'sm')}
        </div>
      </div>
      {renderCard(7, 'md')}
      {renderCard(8, 'md')}
    </div>
  );

  // Staircase layout (ascending)
  const renderStaircaseLayout = () => (
    <div className="flex flex-col items-start gap-2 pl-4">
      {cards.map((_, index) => (
        <div key={index} style={{ marginLeft: `${index * 40}px` }}>
          {renderCard(index, 'sm')}
        </div>
      ))}
    </div>
  );

  // Life areas / wheel layout
  const renderLifeAreasLayout = () => {
    if (cards.length <= 5) {
      return (
        <div className="flex flex-col items-center gap-4">
          {renderCard(4)}
          <div className="flex gap-8 justify-center">
            {renderCard(1)}
            {renderCard(2)}
            {renderCard(3)}
          </div>
          {renderCard(0)}
        </div>
      );
    }
    // 7 cards
    return (
      <div className="flex flex-col items-center gap-4">
        {renderCard(4, 'sm')}
        <div className="flex gap-6 justify-center">
          {renderCard(3, 'sm')}
          {renderCard(0, 'sm')}
          {renderCard(1, 'sm')}
        </div>
        <div className="flex gap-6 justify-center">
          {renderCard(6, 'sm')}
          {renderCard(5, 'sm')}
          {renderCard(2, 'sm')}
        </div>
      </div>
    );
  };

  // Inventory circle / wheel with 8+ cards
  const renderInventoryLayout = () => (
    <div className="flex flex-col items-center gap-4">
      {renderCard(0, 'sm')}
      <div className="flex gap-6 justify-center">
        {renderCard(7, 'sm')}
        {renderCard(1, 'sm')}
      </div>
      <div className="flex gap-6 justify-center">
        {renderCard(6, 'sm')}
        {renderCard(2, 'sm')}
      </div>
      <div className="flex gap-6 justify-center">
        {renderCard(5, 'sm')}
        {renderCard(3, 'sm')}
      </div>
      {renderCard(4, 'sm')}
    </div>
  );

  // Red flag cross pattern
  const renderRedFlagLayout = () => (
    <div className="flex flex-col items-center gap-4">
      {renderCard(1)}
      <div className="flex gap-8 justify-center items-center">
        {renderCard(3)}
        {renderCard(0)}
        {renderCard(4)}
      </div>
      {renderCard(2)}
    </div>
  );

  // Wheel layout for 11 cards
  const renderWheelLayout = () => {
    if (cards.length < 11) return renderDefaultLayout();
    return (
      <div className="flex flex-col items-center gap-3">
        {renderCard(0, 'sm')}
        <div className="flex gap-6 justify-center">
          {renderCard(9, 'sm')}
          {renderCard(1, 'sm')}
        </div>
        <div className="flex gap-10 justify-center items-center">
          {renderCard(8, 'sm')}
          {renderCard(10, 'sm')}
          {renderCard(2, 'sm')}
        </div>
        <div className="flex gap-6 justify-center">
          {renderCard(7, 'sm')}
          {renderCard(3, 'sm')}
        </div>
        <div className="flex gap-6 justify-center">
          {renderCard(6, 'sm')}
          {renderCard(4, 'sm')}
        </div>
        {renderCard(5, 'sm')}
      </div>
    );
  };

  // Choose layout based on layout_type
  const renderLayout = () => {
    switch (spread.layout_type) {
      case 'single': return renderSingleLayout();
      case 'three-row': return renderThreeRowLayout();
      case 'two-column': return renderTwoColumnLayout();
      case 'two-by-two': return renderTwoByTwoLayout();
      case 'deep-love': return renderDeepLoveLayout();
      case 'hard-decision': return renderDeepLoveLayout(); // Similar cross pattern
      case 'worth-thermostat': return renderTwoColumnLayout();
      case 'inventory-circle': return renderInventoryLayout();
      case 'prosperity-mandala': return renderLifeAreasLayout();
      case 'money-spread': return renderTwoColumnLayout();
      case 'life-areas': return renderLifeAreasLayout();
      case 'health-check': return renderLifeAreasLayout();
      case 'red-flag': return renderRedFlagLayout();
      case 'staircase': return renderStaircaseLayout();
      case 'bridge': return renderTwoColumnLayout();
      case 'stay-or-go': return renderStayOrGoLayout();
      case 'heart-formation': return renderLifeAreasLayout();
      case 'wheel': return renderWheelLayout();
      default: return renderDefaultLayout();
    }
  };

  return (
    <div className="py-8">
      {renderLayout()}
    </div>
  );
};
