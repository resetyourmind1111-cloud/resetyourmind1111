ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mirror_card_shown boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mirror_card_dismissed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loss_frame_shown boolean DEFAULT false;