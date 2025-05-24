/*
  # Create procedure history table

  1. New Tables
    - `procedure_history`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (text, not null)
      - `candidature_id` (text, not null)
      - `procedure_id` (text, not null)
      - `type` (text, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Indexes
    - Create indexes on user_id, candidature_id, and procedure_id for better query performance
*/

-- Create the procedure history table
CREATE TABLE IF NOT EXISTS procedure_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  candidature_id text NOT NULL,
  procedure_id text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX procedure_history_user_id_idx ON procedure_history(user_id);
CREATE INDEX procedure_history_candidature_id_idx ON procedure_history(candidature_id);
CREATE INDEX procedure_history_procedure_id_idx ON procedure_history(procedure_id);