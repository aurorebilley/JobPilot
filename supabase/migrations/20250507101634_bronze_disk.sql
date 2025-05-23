/*
  # Fix notifications RLS policies

  1. Security Updates
    - Drop existing RLS policies
    - Create new policies that properly handle user_id as text type
    - Allow users to insert their own notifications
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;

-- Create new policies with correct user_id handling
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);