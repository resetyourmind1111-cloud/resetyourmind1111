import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeckInfo {
  id: 'Permission Granted' | 'Abundance' | 'Relationship Guidance';
  name: string;
  description: string;
  icon: string;
  cardCount: number;
  bgClass: string;
  borderClass: string;
  available: boolean;
  tierRequired: string;
}

interface DeckSelectorProps {
  onSelectDeck: (deck: 'Permission Granted' | 'Abundance' | 'Relationship Guidance') => void;
  subscriptionTier: string;
}

export const DeckSelector = ({ onSelectDeck, subscriptionTier }: DeckSelectorProps) => {
  const canAccessTier2 = subscriptionTier === 'tier2' || subscriptionTier === 'tier3';

  const decks: DeckInfo[] = [
    {
      id: 'Permission Granted',
      name: 'Permission Granted',
      description: '52 cards for self-discovery, boundaries, and claiming your worth',
      icon: '💜',
      cardCount: 52,
      bgClass: 'from-[hsl(271,60%,27%)] to-[hsl(280,50%,35%)]',
      borderClass: 'border-[hsl(271,60%,27%)]/30',
      available: true,
      tierRequired: 'Reset',
    },
    {
      id: 'Abundance',
      name: 'Abundance',
      description: '52 cards for wealth consciousness, prosperity, and manifestation',
      icon: '✨',
      cardCount: 52,
      bgClass: 'from-[hsl(130,15%,55%)] to-[hsl(130,20%,40%)]',
      borderClass: 'border-[hsl(130,15%,55%)]/30',
      available: canAccessTier2,
      tierRequired: 'Expand',
    },
    {
      id: 'Relationship Guidance',
      name: 'Relationship Guidance',
      description: '52 cards for love, boundaries, patterns, and conscious connection',
      icon: '🌹',
      cardCount: 52,
      bgClass: 'from-[hsl(340,40%,55%)] to-[hsl(340,45%,40%)]',
      borderClass: 'border-[hsl(340,40%,55%)]/30',
      available: canAccessTier2,
      tierRequired: 'Expand',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {decks.map((deck, index) => (
        <motion.div
          key={deck.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
        >
          <Card
            className={`cursor-pointer transition-all duration-500 relative overflow-hidden group ${deck.borderClass} ${
              deck.available
                ? 'hover:shadow-[0_0_40px_hsl(43_52%_54%/0.15)] hover:-translate-y-2'
                : 'opacity-60'
            }`}
            onClick={() => deck.available && onSelectDeck(deck.id)}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${deck.bgClass} opacity-15 group-hover:opacity-25 transition-opacity duration-500`} />
            
            <CardContent className="p-6 relative flex flex-col items-center text-center min-h-[240px]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {deck.icon}
              </div>
              
              <h3 className="font-serif font-bold text-xl mb-2 text-foreground">
                {deck.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {deck.description}
              </p>
              
              <div className="text-xs text-muted-foreground mb-4">
                {deck.cardCount} Cards • 10 Unique Spreads
              </div>

              {deck.available ? (
                <Button 
                  className="w-full mt-auto btn-glow"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDeck(deck.id);
                  }}
                >
                  Select Deck
                </Button>
              ) : (
                <div className="w-full mt-auto space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Requires {deck.tierRequired} membership</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Upgrade to Access
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
