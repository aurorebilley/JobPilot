/*
  # Create interview history table

  1. New Tables
    - `interview_history`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (text, not null)
      - `candidature_id` (text, not null)
      - `interview_id` (text, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Indexes
    - Create indexes on user_id, candidature_id, and interview_id for better query performance
*/

-- Create the interview history table
CREATE TABLE IF NOT EXISTS interview_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  candidature_id text NOT NULL,
  interview_id text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX interview_history_user_id_idx ON interview_history(user_id);
CREATE INDEX interview_history_candidature_id_idx ON interview_history(candidature_id);
CREATE INDEX interview_history_interview_id_idx ON interview_history(interview_id);