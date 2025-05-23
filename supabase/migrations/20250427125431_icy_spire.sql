/*
  # Create candidature history table

  1. New Tables
    - `candidature_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null)
      - `candidature_id` (uuid, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `candidature_history` table
    - Add policy for authenticated users to read their own history
    - Add policy for authenticated users to insert their own history
*/

-- Create the candidature history table
CREATE TABLE IF NOT EXISTS candidature_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  candidature_id uuid NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE candidature_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own history
CREATE POLICY "Users can read own history" ON candidature_history
  FOR SELECT
  TO authenticated
  USING (auth.uid()::uuid = user_id);

-- Create policy to allow users to insert their own history
CREATE POLICY "Users can insert own history" ON candidature_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::uuid = user_id);

-- Create index on user_id and candidature_id for faster lookups
CREATE INDEX candidature_history_user_id_idx ON candidature_history(user_id);
CREATE INDEX candidature_history_candidature_id_idx ON candidature_history(candidature_id);