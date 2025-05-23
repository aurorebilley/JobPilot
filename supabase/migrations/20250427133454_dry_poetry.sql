/*
  # Create candidature history table

  1. New Tables
    - `candidature_history`
      - `id` (uuid, primary key)
      - `user_id` (text, not null)
      - `candidature_id` (text, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz)
*/

-- Create the candidature history table
CREATE TABLE IF NOT EXISTS candidature_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  candidature_id text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX candidature_history_user_id_idx ON candidature_history(user_id);
CREATE INDEX candidature_history_candidature_id_idx ON candidature_history(candidature_id);