import { useState } from 'react';
import { motion } from 'framer-motion';
import { OracleCard as OracleCardType, SpreadTemplate } from '@/data/oracleCards';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Heart, Sparkles, Target, Share2, Save, RotateCcw, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingResultsProps {
  spread: SpreadTemplate;
  cards: OracleCardType[];
  question?: string;
  onSaveReading: (journalEntry: string, actionItems: boolean[]) => Promise<void>;
  onNewReading: () => void;
  canSave?: boolean;
}

export const ReadingResults = ({ 
  spread, 
  cards, 
  question,
  onSaveReading, 
  onNewReading,
  canSave = true,
}: ReadingResultsProps) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [actionItems, setActionItems] = useState<boolean[]>(cards.map(() => false));

  const handleSave = async () => {
    if (!canSave) {
      toast.info('Sign in to save your readings.');
      return;
    }
    setIsSaving(true);
    try {
      await onSaveReading(journalEntry, actionItems);
    } catch {
      toast.error('Failed to save reading');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const shareText = `✨ My ${spread.spread_name} Oracle Reading ✨\n\n${cards.map((card, i) => {
      const pos = spread.position_meanings?.[i];
      const label = pos ? pos.split('—')[0].trim() : `Card ${i + 1}`;
      return `${label}: ${card.title}\n"${card.message}"`;
    }).join('\n\n')}`;
    
    try {
      await navigator.share({ title: `${spread.spread_name} Reading`, text: shareText });
    } catch {
      await navigator.clipboard.writeText(shareText);
      toast.success('Reading copied to clipboard!');
    }
  };

  const toggleActionItem = (index: number) => {
    setActionItems(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const completedActions = actionItems.filter(Boolean).length;
  const currentCard = cards[selectedCardIndex];
  const positionMeaning = spread.position_meanings?.[selectedCardIndex] || `Card ${selectedCardIndex + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Card Navigation */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {cards.map((_, index) => {
            const label = spread.position_meanings?.[index]?.split('—')[0]?.trim() || `Card ${index + 1}`;
            return (
              <button
                key={index}
                onClick={() => setSelectedCardIndex(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCardIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Card Details */}
      <Card className="glass-card">
        <CardHeader className="text-center">
          <div className="inline-flex mx-auto px-3 py-1 rounded-full text-xs font-medium mb-2 bg-primary/10 text-primary">
            {currentCard.category}
          </div>
          <CardTitle className="font-serif text-2xl">{currentCard.title}</CardTitle>
          <p className="text-lg text-muted-foreground italic">"{currentCard.message}"</p>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-medium">Position:</span> {positionMeaning}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Action Items */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Integration Actions
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedActions} of {cards.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {cards.map((card, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox
                checked={actionItems[index]}
                onCheckedChange={() => toggleActionItem(index)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className={`text-sm ${actionItems[index] ? 'line-through text-muted-foreground' : ''}`}>
                  <span className="font-medium">{card.title}:</span> {card.integration_prompt}
                </p>
              </div>
            </div>
          ))}
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
        <span className="font-medium">You earned {spread.points} points for this reading!</span>
      </motion.div>
    </motion.div>
  );
};
