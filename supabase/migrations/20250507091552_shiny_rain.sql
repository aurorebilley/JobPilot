/*
  # Fix notifications user_id policies

  1. Changes
    - Drop existing policies
    - Add proper type casting for UUID comparison
    - Recreate policies with correct type handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Change column type
ALTER TABLE notifications 
  ALTER COLUMN user_id TYPE text;

-- Recreate policies with proper type casting
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);