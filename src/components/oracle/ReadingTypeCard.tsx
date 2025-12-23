import { motion } from 'framer-motion';
import { ReadingType } from '@/data/oracleCards';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReadingTypeCardProps {
  reading: ReadingType;
  onSelect: (reading: ReadingType) => void;
  index: number;
}

export const ReadingTypeCard = ({ reading, onSelect, index }: ReadingTypeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="cursor-pointer glass-card-hover border-primary/10 hover:border-primary/30 transition-all"
        onClick={() => onSelect(reading)}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{reading.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-serif font-semibold text-foreground">{reading.name}</h3>
                <Badge variant="secondary" className="text-[10px]">
                  +{reading.points} pts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{reading.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {reading.cardCount}
                  </span>
                  {reading.cardCount === 1 ? 'card' : 'cards'}
                </span>
                {reading.requiresQuestion && (
                  <span className="text-accent">• Requires question</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
