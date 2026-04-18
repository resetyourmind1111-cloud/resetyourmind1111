-- Create public 'audio' bucket for hosting Lorie's welcome message and other onboarding audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for audio bucket
CREATE POLICY "Public can read audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');