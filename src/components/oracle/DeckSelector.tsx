import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeckSelectorProps {
  selectedDeck: 'Permission Granted' | 'Abundance' | 'both';
  onSelectDeck: (deck: 'Permission Granted' | 'Abundance' | 'both') => void;
  subscriptionTier: string;
  showBothOption?: boolean;
}

export const DeckSelector = ({ 
  selectedDeck, 
  onSelectDeck, 
  subscriptionTier,
  showBothOption = true 
}: DeckSelectorProps) => {
  const canAccessAbundance = subscriptionTier === 'tier2' || subscriptionTier === 'tier3';

  const decks = [
    {
      id: 'Permission Granted' as const,
      name: 'Permission Granted',
      description: '52 cards for self-discovery and inner work',
      icon: '💜',
      gradient: 'from-primary via-purple-500 to-violet-600',
      available: true,
    },
    {
      id: 'Abundance' as const,
      name: 'Abundance',
      description: '52 cards for wealth and prosperity',
      icon: '✨',
      gradient: 'from-accent via-amber-500 to-yellow-600',
      available: canAccessAbundance,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map((deck, index) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedDeck === deck.id 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : deck.available 
                    ? 'hover:shadow-lg' 
                    : 'opacity-60'
              }`}
              onClick={() => deck.available && onSelectDeck(deck.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${deck.gradient} opacity-10`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{deck.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-semibold text-lg">{deck.name}</h3>
                      {!deck.available && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{deck.description}</p>
                  </div>
                </div>
                {!deck.available && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Available with Tier 2 or Tier 3 subscription
                    </p>
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

      {showBothOption && canAccessAbundance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className={`cursor-pointer transition-all ${
              selectedDeck === 'both' 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => onSelectDeck('both')}
          >
            <CardContent className="p-4 text-center">
              <span className="text-2xl mr-2">💜✨</span>
              <span className="font-medium">Both Decks Combined</span>
              <span className="text-muted-foreground text-sm ml-2">(104 cards)</span>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
