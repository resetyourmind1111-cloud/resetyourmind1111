import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface SavedReading {
  id: string;
  reading_type: string;
  spread_name: string | null;
  deck_used: string | null;
  cards_pulled: Array<{ title: string; position?: string; deck?: string; card_number?: number }>;
  question_asked: string | null;
  journal_entry: string | null;
  points_awarded: number;
  action_items_completed: boolean[] | null;
  created_at: string;
}

const SavedReadings = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [deckFilter, setDeckFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchReadings = async () => {
      let query = supabase
        .from('card_pulls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (deckFilter !== 'all') {
        query = query.eq('deck_used', deckFilter);
      }

      const { data } = await query;
      if (data) {
        setReadings(data.map(r => ({
          ...r,
          cards_pulled: (r.cards_pulled as SavedReading['cards_pulled']) || [],
          action_items_completed: (r.action_items_completed as boolean[]) || null,
        })));
      }
      setLoading(false);
    };
    fetchReadings();
  }, [user, isLoading, navigate, deckFilter]);

  // Calculate most pulled cards
  const cardCounts: Record<string, number> = {};
  readings.forEach(r => {
    r.cards_pulled?.forEach(c => {
      const key = `${c.deck || ''}: ${c.title}`;
      cardCounts[key] = (cardCounts[key] || 0) + 1;
    });
  });
  const topCards = Object.entries(cardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse-soft text-4xl">✨</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/oracle')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Oracle
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold">Saved Readings</h1>
            <p className="text-sm text-muted-foreground">{readings.length} readings saved</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={deckFilter} onValueChange={setDeckFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by deck" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Decks</SelectItem>
              <SelectItem value="Permission Granted">Permission Granted</SelectItem>
              <SelectItem value="Abundance">Abundance</SelectItem>
              <SelectItem value="Relationship Guidance">Relationship Guidance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Most Pulled Cards */}
        {topCards.length > 0 && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Most Pulled Cards
              </CardTitle>
              <p className="text-xs text-muted-foreground">These cards keep appearing — what are they teaching you?</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topCards.map(([name, count]) => (
                  <Badge key={name} variant="secondary" className="px-3 py-1.5">
                    {name} <span className="ml-2 text-primary font-bold">×{count}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Readings List */}
        <div className="space-y-4">
          {readings.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-4">🔮</div>
              <p>No readings saved yet. Pull some cards to get started!</p>
              <Button className="mt-4" onClick={() => navigate('/oracle')}>Go to Oracle</Button>
            </div>
          )}

          {readings.map((reading, index) => {
            const isExpanded = expandedId === reading.id;
            const completedActions = reading.action_items_completed?.filter(Boolean).length || 0;
            const totalActions = reading.action_items_completed?.length || 0;

            return (
              <motion.div
                key={reading.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className="glass-card cursor-pointer transition-all hover:border-primary/20"
                  onClick={() => setExpandedId(isExpanded ? null : reading.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-semibold">
                            {reading.spread_name || reading.reading_type}
                          </h3>
                          {reading.deck_used && (
                            <Badge variant="outline" className="text-[10px]">
                              {reading.deck_used}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px]">
                            {reading.cards_pulled?.length || 0} cards
                          </Badge>
                        </div>
                        {reading.question_asked && (
                          <p className="text-sm text-muted-foreground italic mb-1">
                            "{reading.question_asked}"
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(reading.created_at), 'MMM d, yyyy h:mm a')}
                          </span>
                          {totalActions > 0 && (
                            <span>{completedActions}/{totalActions} actions</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-primary font-medium">
                        +{reading.points_awarded} pts
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-border space-y-3"
                      >
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Cards Pulled
                          </h4>
                          {reading.cards_pulled?.map((card, i) => (
                            <div key={i} className="text-sm pl-4 py-1 border-l-2 border-primary/20">
                              <span className="font-medium">{card.position?.split('—')[0]?.trim() || `Card ${i + 1}`}:</span>{' '}
                              {card.title}
                            </div>
                          ))}
                        </div>
                        {reading.journal_entry && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Journal Entry</h4>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                              {reading.journal_entry}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SavedReadings;
