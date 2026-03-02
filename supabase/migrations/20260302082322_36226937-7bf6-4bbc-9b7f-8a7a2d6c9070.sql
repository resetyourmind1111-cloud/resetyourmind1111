
-- Create spread_templates table
CREATE TABLE public.spread_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spread_name TEXT NOT NULL,
  deck_name TEXT NOT NULL,
  number_of_cards INTEGER NOT NULL,
  position_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
  question_prompt TEXT NOT NULL,
  tier_required INTEGER NOT NULL DEFAULT 1,
  layout_type TEXT NOT NULL DEFAULT 'grid',
  description TEXT,
  icon TEXT DEFAULT '✨',
  points INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(spread_name, deck_name)
);

-- Add new columns to card_pulls
ALTER TABLE public.card_pulls ADD COLUMN IF NOT EXISTS spread_name TEXT;
ALTER TABLE public.card_pulls ADD COLUMN IF NOT EXISTS deck_used TEXT;
ALTER TABLE public.card_pulls ADD COLUMN IF NOT EXISTS action_items_completed JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.card_pulls ADD COLUMN IF NOT EXISTS revisited_count INTEGER DEFAULT 0;

-- Add unique constraint to oracle_cards
ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_deck_card_unique UNIQUE (deck_name, card_number);

-- RLS for spread_templates (public read)
ALTER TABLE public.spread_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view spread templates" ON public.spread_templates FOR SELECT USING (true);
