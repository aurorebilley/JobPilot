/*
  # Create candidature history table

  1. New Tables
    - `candidature_history`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null)
      - `candidature_id` (uuid, not null) 
      - `status` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `candidature_history` table
    - Add policy for authenticated users to read their own history
    - Add policy for authenticated users to insert their own history
*/

-- Create the candidature history table if it doesn't exist
CREATE TABLE IF NOT EXISTS candidature_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  candidature_id uuid NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if not already enabled
ALTER TABLE candidature_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own history" ON candidature_history;
  DROP POLICY IF EXISTS "Users can insert own history" ON candidature_history;
END $$;

-- Create new policies
CREATE POLICY "Users can read own history" ON candidature_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON candidature_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS candidature_history_user_id_idx;
DROP INDEX IF EXISTS candidature_history_candidature_id_idx;

-- Create new indexes
CREATE INDEX candidature_history_user_id_idx ON candidature_history(user_id);
CREATE INDEX candidature_history_candidature_id_idx ON candidature_history(candidature_id);