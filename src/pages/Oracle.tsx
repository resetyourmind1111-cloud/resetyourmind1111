import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowLeft, History } from 'lucide-react';
import { toast } from 'sonner';

import { DeckSelector } from '@/components/oracle/DeckSelector';
import { SpreadSelector } from '@/components/oracle/SpreadSelector';
import { TrialLockedContent } from '@/components/TrialLockedContent';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { CardSpread } from '@/components/oracle/CardSpread';
import { ReadingResults } from '@/components/oracle/ReadingResults';
import { 
  OracleCard as OracleCardType,
  SpreadTemplate,
  getDeckCards,
} from '@/data/oracleCards';

type Step = 'deck' | 'spread' | 'question' | 'pulling' | 'results';
type DeckName = 'Permission Granted' | 'Abundance' | 'Relationship Guidance';

const Oracle = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('deck');
  const [selectedDeck, setSelectedDeck] = useState<DeckName>('Permission Granted');
  const [selectedSpread, setSelectedSpread] = useState<SpreadTemplate | null>(null);
  const [question, setQuestion] = useState('');
  const [pulledCards, setPulledCards] = useState<OracleCardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { setSubscriptionTier('free'); return; }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data?.subscription_tier) setSubscriptionTier(data.subscription_tier);
    };
    fetchProfile();
  }, [user, isLoading]);

  const handleSelectDeck = (deck: DeckName) => {
    setSelectedDeck(deck);
    setStep('spread');
  };

  const handleSelectSpread = (spread: SpreadTemplate) => {
    setSelectedSpread(spread);
    setStep('question');
  };

  const pullCards = (count: number): OracleCardType[] => {
    const available = getDeckCards(selectedDeck);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const startPulling = () => {
    if (!selectedSpread) return;
    const cards = pullCards(selectedSpread.number_of_cards);
    setPulledCards(cards);
    setFlippedCards([]);
    setStep('pulling');
  };

  const handleFlipCard = (index: number) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards(prev => [...prev, index]);
    }
  };

  const allCardsFlipped = pulledCards.length > 0 && flippedCards.length === pulledCards.length;

  const handleSaveReading = async (journalEntry: string, actionItems: boolean[]) => {
    if (!selectedSpread) return;
    if (!user) {
      toast.info('Sign in to save your readings.');
      navigate('/auth');
      return;
    }

    const cardsData = pulledCards.map((card, index) => ({
      deck: card.deck_name,
      card_number: card.card_number,
      title: card.title,
      position: selectedSpread.position_meanings?.[index] || null,
    }));

    const { error } = await supabase.from('card_pulls').insert({
      user_id: user.id,
      reading_type: selectedSpread.layout_type,
      spread_name: selectedSpread.spread_name,
      deck_used: selectedDeck,
      cards_pulled: cardsData,
      question_asked: question || null,
      journal_entry: journalEntry || null,
      points_awarded: selectedSpread.points,
      action_items_completed: actionItems,
    });

    if (error) {
      console.error('Failed to save reading:', error);
      toast.error('Failed to save reading.');
      return;
    }
    toast.success('Reading saved!');
  };

  const resetReading = () => {
    setStep('deck');
    setSelectedSpread(null);
    setQuestion('');
    setPulledCards([]);
    setFlippedCards([]);
  };

  const goBack = () => {
    if (step === 'spread') setStep('deck');
    else if (step === 'question') setStep('spread');
    else if (step === 'pulling' && !allCardsFlipped) setStep('spread');
    else if (step === 'results') resetReading();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Oracle Guidance</h1>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <p className="text-muted-foreground">
            Receive divine guidance through our sacred card decks
          </p>
          {!isLoading && !user && (
            <p className="mt-3 text-sm text-muted-foreground">
              Guest mode — sign in to save readings
            </p>
          )}
          {user && step === 'deck' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/saved-readings')}
            >
              <History className="w-4 h-4 mr-2" />
              Saved Readings
            </Button>
          )}
        </motion.div>

        {/* Back Button */}
        {step !== 'deck' && step !== 'spread' && (
          <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Deck Selection */}
          {step === 'deck' && (
            <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-serif text-xl font-semibold text-center mb-6">Choose Your Deck</h2>
              <DeckSelector onSelectDeck={handleSelectDeck} subscriptionTier={subscriptionTier} />
            </motion.div>
          )}

          {/* Step 2: Spread Selection */}
          {step === 'spread' && (
            <motion.div key="spread" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <SpreadSelector
                deckName={selectedDeck}
                subscriptionTier={subscriptionTier}
                onSelectSpread={handleSelectSpread}
                onBack={() => setStep('deck')}
              />
            </motion.div>
          )}

          {/* Step 3: Question */}
          {step === 'question' && selectedSpread && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedSpread.icon}</div>
                <h2 className="font-serif text-xl font-semibold">{selectedSpread.spread_name}</h2>
                <p className="text-muted-foreground mt-2 italic">"{selectedSpread.question_prompt}"</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedSpread.number_of_cards} {selectedSpread.number_of_cards === 1 ? 'card' : 'cards'} • +{selectedSpread.points} points
                </p>
              </div>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Your question or focus (optional)..."
                className="text-center"
              />
              <Button className="w-full btn-glow" size="lg" onClick={startPulling}>
                Pull Cards
              </Button>
            </motion.div>
          )}

          {/* Step 4: Card Pulling */}
          {step === 'pulling' && selectedSpread && (
            <motion.div
              key="pulling"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-serif text-xl font-semibold">{selectedSpread.spread_name}</h2>
                <p className="text-muted-foreground">
                  {allCardsFlipped 
                    ? 'All cards revealed! View your reading below.' 
                    : `Tap each card to reveal (${flippedCards.length}/${pulledCards.length})`}
                </p>
              </div>

              <CardSpread
                spread={selectedSpread}
                cards={pulledCards}
                flippedCards={flippedCards}
                onFlipCard={handleFlipCard}
              />

              {allCardsFlipped && (
                <div className="text-center">
                  <Button size="lg" className="btn-glow" onClick={() => setStep('results')}>
                    View Full Reading
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 5: Results */}
          {step === 'results' && selectedSpread && (
            <motion.div key="results" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <ReadingResults
                spread={selectedSpread}
                cards={pulledCards}
                question={question}
                onSaveReading={handleSaveReading}
                onNewReading={resetReading}
                canSave={Boolean(user)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Oracle;
