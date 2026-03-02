import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SpreadTemplate } from '@/data/oracleCards';

interface SpreadSelectorProps {
  deckName: string;
  subscriptionTier: string;
  onSelectSpread: (spread: SpreadTemplate) => void;
  onBack: () => void;
}

const deckThemes: Record<string, { accent: string; gradient: string; icon: string }> = {
  'Permission Granted': { accent: 'hsl(271,60%,27%)', gradient: 'from-[hsl(271,60%,27%)]/10 to-transparent', icon: '💜' },
  'Abundance': { accent: 'hsl(130,15%,55%)', gradient: 'from-[hsl(130,15%,55%)]/10 to-transparent', icon: '✨' },
  'Relationship Guidance': { accent: 'hsl(340,40%,55%)', gradient: 'from-[hsl(340,40%,55%)]/10 to-transparent', icon: '🌹' },
};

export const SpreadSelector = ({ deckName, subscriptionTier, onSelectSpread, onBack }: SpreadSelectorProps) => {
  const [spreads, setSpreads] = useState<SpreadTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = deckThemes[deckName] || deckThemes['Permission Granted'];

  const tierNumber = subscriptionTier === 'tier3' ? 3 : subscriptionTier === 'tier2' ? 2 : 1;

  useEffect(() => {
    const fetchSpreads = async () => {
      const { data, error } = await supabase
        .from('spread_templates')
        .select('*')
        .eq('deck_name', deckName)
        .order('number_of_cards', { ascending: true });

      if (!error && data) {
        setSpreads(data.map(s => ({
          ...s,
          position_meanings: s.position_meanings as string[],
          description: s.description || '',
          icon: s.icon || '✨',
          points: s.points || 5,
        })));
      }
      setLoading(false);
    };
    fetchSpreads();
  }, [deckName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse-soft text-4xl">{theme.icon}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="font-serif text-2xl font-bold">{theme.icon} {deckName} Readings</h2>
          <p className="text-sm text-muted-foreground">Choose your spread • {spreads.length} unique readings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {spreads.map((spread, index) => {
          const isLocked = spread.tier_required > tierNumber;
          const tierLabel = spread.tier_required === 3 ? 'Embody' : spread.tier_required === 2 ? 'Expand' : 'Reset';

          return (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`transition-all duration-300 relative overflow-hidden ${
                  isLocked
                    ? 'opacity-60'
                    : 'cursor-pointer glass-card-hover border-primary/10 hover:border-primary/30'
                }`}
                onClick={() => !isLocked && onSelectSpread(spread)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{spread.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-serif font-semibold text-foreground">{spread.spread_name}</h3>
                        <Badge variant="secondary" className="text-[10px]">
                          {spread.number_of_cards} {spread.number_of_cards === 1 ? 'card' : 'cards'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          +{spread.points} pts
                        </Badge>
                        {spread.tier_required > 1 && (
                          <Badge variant="default" className="text-[10px] bg-secondary">
                            {tierLabel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{spread.description}</p>
                      
                      {isLocked && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Available with {tierLabel} membership
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
