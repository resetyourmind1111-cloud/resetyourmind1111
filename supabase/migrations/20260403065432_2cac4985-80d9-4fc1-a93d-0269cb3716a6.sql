-- Create recognition_deficit_items table
CREATE TABLE public.recognition_deficit_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  item_text text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_text)
);

ALTER TABLE public.recognition_deficit_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own items"
  ON public.recognition_deficit_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON public.recognition_deficit_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.recognition_deficit_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.recognition_deficit_items FOR DELETE
  USING (auth.uid() = user_id);

-- Add workbook columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS recognition_deficit_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS worth_score_before integer,
  ADD COLUMN IF NOT EXISTS worth_score_after integer;