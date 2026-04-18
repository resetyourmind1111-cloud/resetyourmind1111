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
import { Link } from 'react-router-dom';

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
  const { isTrialActive, trialExpired } = useTrialStatus();
  const isTrialUser = isTrialActive || trialExpired;
  
  // Oracle preview state
  const [oraclePreviewPulls, setOraclePreviewPulls] = useState<number>(0);
  const [showTrialEntry, setShowTrialEntry] = useState(false);
  const [trialPullComplete, setTrialPullComplete] = useState(false);
  // Day-6 surprise gift: one bonus pull on top of the trial cap.
  const [day6BonusAvailable, setDay6BonusAvailable] = useState(false);
  // True when the *current* pull consumed the Day-6 bonus — used to chain to the bonus Permission Slip.
  const [day6BonusJustConsumed, setDay6BonusJustConsumed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { setSubscriptionTier('free'); return; }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier, oracle_preview_pulls_used, day6_gift_shown, day6_bonus_oracle_used')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data?.subscription_tier) setSubscriptionTier(data.subscription_tier);
      if (data) setOraclePreviewPulls((data as any).oracle_preview_pulls_used || 0);
      // Bonus pull is available if Day 6 gift has been opened but bonus not yet redeemed.
      if (
        data &&
        (data as any).day6_gift_shown === true &&
        (data as any).day6_bonus_oracle_used === false
      ) {
        setDay6BonusAvailable(true);
      }
    };
    fetchProfile();
  }, [user, isLoading]);

  const isFreeTier = subscriptionTier === 'free';
  const isTrialOracleUser = isTrialActive && isFreeTier;
  // Effective cap = 3 + (1 if Day 6 bonus active)
  const effectiveCap = 3 + (day6BonusAvailable ? 1 : 0);
  const pullsRemaining = Math.max(0, effectiveCap - oraclePreviewPulls);
  const pullsExhausted = oraclePreviewPulls >= effectiveCap;

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

  // Trial single-card pull
  const handleTrialPull = async () => {
    if (!user || pullsExhausted) return;
    const available = getDeckCards('Permission Granted');
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const card = shuffled[0];
    setPulledCards([card]);
    setFlippedCards([]);
    setTrialPullComplete(false);
    setShowTrialEntry(false);
    
    // Create a single-card spread template
    setSelectedSpread({
      spread_name: 'Single Card Pull',
      deck_name: 'Permission Granted',
      number_of_cards: 1,
      position_meanings: ['Your Message'],
      layout_type: 'single',
      question_prompt: 'What do I need to know right now?',
      icon: '✨',
      points: 5,
      tier_required: 1,
      description: 'A single card pull for guidance',
    } as SpreadTemplate);
    setStep('pulling');
    
    // If the Day-6 bonus is available, this pull is FREE (doesn't count against
    // the 3-pull trial cap) and immediately consumes the bonus + triggers the
    // bonus Permission Slip chain. Otherwise increment the normal counter.
    const updates: Record<string, any> = {};
    if (day6BonusAvailable) {
      updates.day6_bonus_oracle_used = true;
      setDay6BonusAvailable(false);
      setDay6BonusJustConsumed(true);
    } else {
      const newPulls = oraclePreviewPulls + 1;
      setOraclePreviewPulls(newPulls);
      updates.oracle_preview_pulls_used = newPulls;
    }
    await supabase.from('profiles').update(updates as any).eq('user_id', user.id);
  };

  const handleFlipCard = (index: number) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards(prev => [...prev, index]);
      if (isTrialOracleUser && pulledCards.length === 1) {
        setTrialPullComplete(true);
      }
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
    setTrialPullComplete(false);
    if (isTrialOracleUser) {
      setShowTrialEntry(true);
    }
  };

  const goBack = () => {
    if (step === 'spread') setStep('deck');
    else if (step === 'question') setStep('spread');
    else if (step === 'pulling' && !allCardsFlipped) setStep('spread');
    else if (step === 'results') resetReading();
  };

  // Trial user: show special entry/limit screens
  if (isTrialOracleUser) {
    // Pull limit reached
    if (pullsExhausted && step === 'deck') {
      return (
         <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-lg flex flex-col items-center justify-center">
            <div className="w-full mb-4">
              <Link to="/home" className="flex items-center gap-1 text-sm text-foreground/65 hover:text-foreground/90 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-xl border-t-2 border-[#C9A84C] bg-card p-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
                Your 3 Preview Pulls Are Complete
              </p>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                You've experienced the oracle.
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Now unlock the full library:
              </p>
              <div className="text-left space-y-2 mb-6 max-w-xs mx-auto">
                {[
                  "Permission Granted™ Oracle Deck (52 cards)",
                  "Abundance Oracle Deck (52 cards)",
                  "Relationships Oracle Deck (52 cards)",
                  "All 10 spreads",
                  "Daily oracle pull on your dashboard",
                  "Save readings to your healing plan",
                ].map((item) => (
                  <p key={item} className="text-sm text-[#C9A84C] flex items-start gap-2">
                    <span>—</span> {item}
                  </p>
                ))}
              </div>
              <Link to="/upgrade">
                <Button variant="gold" size="lg" className="w-full mb-3">
                  Unlock My Full Oracle →
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mb-4">Founding rate: $44/month — locked in for life.</p>
              <Link to="/home" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Back to dashboard
              </Link>
            </motion.div>
          </main>
          <Footer />
        </div>
      );
    }

    // Trial entry screen (before first pull or returning)
    if (step === 'deck' || showTrialEntry) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-lg flex flex-col items-center justify-center">
            <div className="w-full mb-4">
              <Link to="/home" className="flex items-center gap-1 text-sm text-foreground/65 hover:text-foreground/90 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-xl border-t-2 border-[#C9A84C] bg-card p-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-3">
                Your Oracle Preview
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                3 free pulls from the<br />Permission Granted™ deck.
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Experience the oracle before you unlock the full library.
                You have {pullsRemaining} pull{pullsRemaining !== 1 ? 's' : ''} remaining.
              </p>

              {/* Pull counter circles */}
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-[#C9A84C] transition-colors ${
                      i < oraclePreviewPulls ? 'bg-[#C9A84C]' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              <Button variant="gold" size="lg" className="w-full mb-4" onClick={handleTrialPull}>
                Pull my card →
              </Button>

              <p className="text-xs text-muted-foreground">
                Single pulls only during preview.
                <br />Full access includes 3 decks, 156 cards, and 10 spreads.
              </p>

              {oraclePreviewPulls === 0 && (
                <p className="text-[#C9A84C] text-sm italic mt-4">Your first pull is waiting.</p>
              )}
            </motion.div>
          </main>
          <Footer />
        </div>
      );
    }

    // Trial user in pulling/results mode - show card with after-pull info
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          {step === 'pulling' && (
            <Button variant="ghost" size="sm" onClick={() => { resetReading(); setShowTrialEntry(true); }} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          <AnimatePresence mode="wait">
            {step === 'pulling' && selectedSpread && (
              <motion.div key="pulling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="text-center">
                  <h2 className="font-serif text-xl font-semibold">Your Card</h2>
                  <p className="text-muted-foreground">
                    {allCardsFlipped ? 'Card revealed!' : 'Tap the card to reveal'}
                  </p>
                </div>

                <CardSpread
                  spread={selectedSpread}
                  cards={pulledCards}
                  flippedCards={flippedCards}
                  onFlipCard={handleFlipCard}
                />

                {allCardsFlipped && (
                  <div className="text-center space-y-4">
                    <Button size="lg" className="btn-glow" onClick={() => setStep('results')}>
                      View Full Reading
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'results' && selectedSpread && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <ReadingResults
                  spread={selectedSpread}
                  cards={pulledCards}
                  question={question}
                  onSaveReading={handleSaveReading}
                  onNewReading={resetReading}
                  canSave={Boolean(user)}
                />

                {/* Day-6 bonus chain: route to bonus Permission Slip draw */}
                {day6BonusJustConsumed && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border-2 border-[#C9A84C] bg-card p-6 text-center shadow-[0_0_30px_rgba(201,168,76,0.15)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
                      One More Gift
                    </p>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      Your bonus Permission Slip is waiting.
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      One more piece of permission — just for showing up on Day 6.
                    </p>
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setDay6BonusJustConsumed(false);
                        navigate('/permission-slips?bonus=1');
                      }}
                    >
                      Draw My Bonus Slip →
                    </Button>
                  </motion.div>
                )}

                {/* After-pull info */}
                {pullsRemaining > 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    {pullsRemaining} preview pull{pullsRemaining !== 1 ? 's' : ''} remaining.
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#C9A84C]/30 bg-card p-6 text-center"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
                      Your 3 Preview Pulls Are Complete
                    </p>
                    <h3 className="font-serif text-lg text-foreground mb-3">
                      You've experienced the oracle.
                    </h3>
                    <div className="text-left space-y-1 mb-4 max-w-xs mx-auto">
                      {[
                        "Permission Granted™ Oracle Deck (52 cards)",
                        "Abundance Oracle Deck (52 cards)",
                        "Relationships Oracle Deck (52 cards)",
                        "All 10 spreads",
                      ].map((item) => (
                        <p key={item} className="text-xs text-[#C9A84C] flex items-start gap-2">
                          <span>—</span> {item}
                        </p>
                      ))}
                    </div>
                    <Link to="/upgrade">
                      <Button variant="gold" size="lg" className="w-full mb-2">
                        Unlock My Full Oracle →
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">Founding rate: $44/month — locked in for life.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Paid user: full oracle experience ---
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
          {step === 'deck' && (
            <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-serif text-xl font-semibold text-center mb-6">Choose Your Deck</h2>
              <DeckSelector onSelectDeck={handleSelectDeck} subscriptionTier={subscriptionTier} />
            </motion.div>
          )}

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
