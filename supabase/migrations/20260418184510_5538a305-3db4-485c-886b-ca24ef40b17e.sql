UPDATE storage.objects
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{mimetype}',
  '"audio/mpeg"'
)
WHERE bucket_id = 'audio'
  AND name LIKE '%.mp3';