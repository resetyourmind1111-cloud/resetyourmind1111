
CREATE TABLE public.healing_tool_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool_id TEXT NOT NULL,
  entry_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.healing_tool_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own entries" ON public.healing_tool_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries" ON public.healing_tool_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.healing_tool_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.healing_tool_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_healing_tool_entries_user_tool ON public.healing_tool_entries(user_id, tool_id);
CREATE INDEX idx_healing_tool_entries_created ON public.healing_tool_entries(created_at DESC);
