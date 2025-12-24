import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { DeckSelector } from '@/components/oracle/DeckSelector';
import { ReadingTypeCard } from '@/components/oracle/ReadingTypeCard';
import { CardSpread } from '@/components/oracle/CardSpread';
import { ReadingResults } from '@/components/oracle/ReadingResults';
import { 
  readingTypes, 
  permissionGrantedDeck, 
  abundanceDeck, 
  OracleCard as OracleCardType,
  ReadingType 
} from '@/data/oracleCards';

type Step = 'deck' | 'reading-type' | 'question' | 'pulling' | 'results';

const Oracle = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('deck');
  const [selectedDeck, setSelectedDeck] = useState<'Permission Granted' | 'Abundance' | 'both'>('Permission Granted');
  const [selectedReading, setSelectedReading] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [pulledCards, setPulledCards] = useState<OracleCardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  useEffect(() => {
    if (isLoading) return;

    // Allow guests to use Oracle. Sign-in is only required for saving readings.
    if (!user) {
      setSubscriptionTier('free');
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (data?.subscription_tier) {
        setSubscriptionTier(data.subscription_tier);
      }
    };

    fetchProfile();
  }, [user, isLoading]);

  const getAvailableCards = (): OracleCardType[] => {
    if (selectedDeck === 'both') {
      return [...permissionGrantedDeck, ...abundanceDeck];
    }
    return selectedDeck === 'Permission Granted' ? permissionGrantedDeck : abundanceDeck;
  };

  const pullCards = (count: number): OracleCardType[] => {
    const available = getAvailableCards();
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const handleSelectReading = (reading: ReadingType) => {
    setSelectedReading(reading);
    if (reading.requiresQuestion) {
      setStep('question');
    } else {
      startPulling(reading);
    }
  };

  const startPulling = (reading: ReadingType) => {
    const cards = pullCards(reading.cardCount);
    setPulledCards(cards);
    setFlippedCards([]);
    setStep('pulling');
  };

  const handleFlipCard = (index: number) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const allCardsFlipped = pulledCards.length > 0 && flippedCards.length === pulledCards.length;

  const handleSaveReading = async (journalEntry: string) => {
    if (!selectedReading) return;

    if (!user) {
      toast.info('Sign in to save your readings to your profile.');
      navigate('/auth');
      return;
    }

    const cardsData = pulledCards.map((card, index) => ({
      deck: card.deck_name,
      card_number: card.card_number,
      title: card.title,
      position: selectedReading.positions?.[index] || null,
    }));

    const { error } = await supabase.from('card_pulls').insert({
      user_id: user.id,
      reading_type: selectedReading.id,
      cards_pulled: cardsData,
      question_asked: question || null,
      journal_entry: journalEntry || null,
      points_awarded: selectedReading.points,
    });

    if (error) {
      toast.error('Failed to save reading. Please try again.');
      return;
    }

    toast.success('Reading saved to your profile!');
  };


  const resetReading = () => {
    setStep('deck');
    setSelectedReading(null);
    setQuestion('');
    setPulledCards([]);
    setFlippedCards([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Oracle Cards</h1>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <p className="text-muted-foreground">
            Receive divine guidance through our sacred card decks
          </p>
          {!isLoading && !user && (
            <p className="mt-3 text-sm text-muted-foreground">
              Guest mode: you can pull cards, but you’ll need to sign in to save readings.
            </p>
          )}
        </motion.div>

        {/* Back Button */}
        {step !== 'deck' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === 'reading-type') setStep('deck');
              else if (step === 'question') setStep('reading-type');
              else if (step === 'pulling' && !allCardsFlipped) setStep('reading-type');
              else if (step === 'results') resetReading();
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Deck Selection */}
          {step === 'deck' && (
            <motion.div
              key="deck"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-xl font-semibold text-center">Choose Your Deck</h2>
              <DeckSelector
                selectedDeck={selectedDeck}
                onSelectDeck={setSelectedDeck}
                subscriptionTier={subscriptionTier}
              />
              <div className="text-center">
                <Button size="lg" onClick={() => setStep('reading-type')}>
                  Continue with {selectedDeck === 'both' ? 'Both Decks' : selectedDeck}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Reading Type Selection */}
          {step === 'reading-type' && (
            <motion.div
              key="reading-type"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="font-serif text-xl font-semibold text-center mb-6">Choose Your Reading</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {readingTypes.map((reading, index) => (
                  <ReadingTypeCard
                    key={reading.id}
                    reading={reading}
                    onSelect={handleSelectReading}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Question Input */}
          {step === 'question' && selectedReading && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedReading.icon}</div>
                <h2 className="font-serif text-xl font-semibold">{selectedReading.name}</h2>
                <p className="text-muted-foreground mt-2">{selectedReading.questionPrompt}</p>
              </div>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question or focus..."
                className="text-center"
              />
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => startPulling(selectedReading)}
                disabled={!question.trim()}
              >
                Pull Cards
              </Button>
            </motion.div>
          )}

          {/* Step 4: Card Pulling */}
          {step === 'pulling' && selectedReading && (
            <motion.div
              key="pulling"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-serif text-xl font-semibold">{selectedReading.name}</h2>
                <p className="text-muted-foreground">
                  {allCardsFlipped 
                    ? 'All cards revealed! View your reading below.' 
                    : 'Tap each card to reveal its image and guidance'}
                </p>
              </div>

              
              <CardSpread
                reading={selectedReading}
                cards={pulledCards}
                flippedCards={flippedCards}
                onFlipCard={handleFlipCard}
              />

              {allCardsFlipped && (
                <div className="text-center">
                  <Button size="lg" onClick={() => setStep('results')}>
                    View Full Reading
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 5: Results */}
          {step === 'results' && selectedReading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ReadingResults
                reading={selectedReading}
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
