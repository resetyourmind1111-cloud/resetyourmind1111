-- Create oracle_cards table
CREATE TABLE public.oracle_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_name TEXT NOT NULL CHECK (deck_name IN ('Permission Granted', 'Abundance')),
  card_number INTEGER NOT NULL CHECK (card_number >= 1 AND card_number <= 52),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  guidebook_text TEXT NOT NULL,
  deep_love_question TEXT NOT NULL,
  affirmation TEXT NOT NULL,
  integration_prompt TEXT NOT NULL,
  related_meditation_id UUID,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deck_name, card_number)
);

-- Create card_pulls table for saving readings
CREATE TABLE public.card_pulls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_type TEXT NOT NULL CHECK (reading_type IN ('single', 'three-card', 'relationship', 'career-money', 'weekly', 'yes-no', 'monthly', 'decision', 'life-areas')),
  cards_pulled JSONB NOT NULL,
  question_asked TEXT,
  journal_entry TEXT,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oracle_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_pulls ENABLE ROW LEVEL SECURITY;

-- Oracle cards are viewable by all authenticated users
CREATE POLICY "Anyone can view oracle cards"
ON public.oracle_cards
FOR SELECT
TO authenticated
USING (true);

-- Users can view their own card pulls
CREATE POLICY "Users can view their own card pulls"
ON public.card_pulls
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own card pulls
CREATE POLICY "Users can create their own card pulls"
ON public.card_pulls
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own card pulls (for journal entries)
CREATE POLICY "Users can update their own card pulls"
ON public.card_pulls
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_card_pulls_user_id ON public.card_pulls(user_id);
CREATE INDEX idx_card_pulls_created_at ON public.card_pulls(created_at DESC);
CREATE INDEX idx_oracle_cards_deck ON public.oracle_cards(deck_name);