import { useState } from 'react';
import { motion } from 'framer-motion';
import { OracleCard as OracleCardType, ReadingType } from '@/data/oracleCards';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Heart, Sparkles, Target, Share2, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingResultsProps {
  reading: ReadingType;
  cards: OracleCardType[];
  question?: string;
  onSaveReading: (journalEntry: string) => Promise<void>;
  onNewReading: () => void;
  canSave?: boolean;
}


export const ReadingResults = ({ 
  reading, 
  cards, 
  question,
  onSaveReading, 
  onNewReading,
  canSave = true,
}: ReadingResultsProps) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const handleSave = async () => {
    if (!canSave) {
      toast.info('Sign in to save your readings.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveReading(journalEntry);
    } catch (error) {
      toast.error('Failed to save reading');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const shareText = `✨ My ${reading.name} Oracle Reading ✨\n\n${cards.map((card, i) => 
      `${reading.positions?.[i] || `Card ${i + 1}`}: ${card.title}\n"${card.message}"`
    ).join('\n\n')}`;
    
    try {
      await navigator.share({
        title: `${reading.name} Oracle Reading`,
        text: shareText,
      });
    } catch {
      await navigator.clipboard.writeText(shareText);
      toast.success('Reading copied to clipboard!');
    }
  };

  const currentCard = cards[selectedCardIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Card Navigation */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-2">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => setSelectedCardIndex(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCardIndex === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {reading.positions?.[index] || `Card ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Card Details */}
      <Card className="glass-card">
        <CardHeader className="text-center">
          <div className={`inline-flex mx-auto px-3 py-1 rounded-full text-xs font-medium mb-2 ${
            currentCard.deck_name === 'Permission Granted' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-accent/10 text-accent'
          }`}>
            {currentCard.category}
          </div>
          <CardTitle className="font-serif text-2xl">{currentCard.title}</CardTitle>
          <p className="text-lg text-muted-foreground italic">"{currentCard.message}"</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {reading.positions && (
            <div className="text-center">
              <span className="text-sm font-medium text-muted-foreground">
                Position: {reading.positions[selectedCardIndex]}
              </span>
            </div>
          )}

          <div className="grid gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">Guidebook Message</h4>
              </div>
              <p className="text-sm text-foreground/80">{currentCard.guidebook_text}</p>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm text-primary">Deep Love Question</h4>
              </div>
              <p className="text-sm italic">{currentCard.deep_love_question}</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="font-medium text-sm text-accent">Affirmation</h4>
              </div>
              <p className="text-sm font-medium">{currentCard.affirmation}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-foreground" />
                <h4 className="font-medium text-sm">Integration Prompt</h4>
              </div>
              <p className="text-sm">{currentCard.integration_prompt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entry */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif">Journal Your Reflections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <span className="font-medium">Your question:</span> {question}
            </div>
          )}
          <Textarea
            placeholder="What insights did this reading bring? How does it relate to your life right now?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isSaving || !canSave}>
              <Save className="w-4 h-4 mr-2" />
              {!canSave ? 'Sign in to Save' : isSaving ? 'Saving...' : 'Save Reading'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" onClick={onNewReading}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Reading
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Points Earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
      >
        <span className="text-2xl mr-2">🌟</span>
        <span className="font-medium">You earned {reading.points} points for this reading!</span>
      </motion.div>
    </motion.div>
  );
};
