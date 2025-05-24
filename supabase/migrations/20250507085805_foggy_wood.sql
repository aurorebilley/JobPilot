/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null)
      - `type` (text, not null)
      - `reference_id` (text, not null)
      - `message` (text, not null)
      - `read` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `scheduled_for` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to read and update their own notifications
    - Create indexes for better query performance
*/

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  reference_id text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  scheduled_for timestamptz
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::uuid = user_id);

-- Create policy for users to update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);

-- Create indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_type_idx ON notifications(type);
CREATE INDEX notifications_reference_id_idx ON notifications(reference_id);
CREATE INDEX notifications_read_idx ON notifications(read);
CREATE INDEX notifications_scheduled_for_idx ON notifications(scheduled_for);