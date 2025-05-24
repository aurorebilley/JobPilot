/*
  # Add cron job for notifications check

  1. Enable pg_cron extension if not enabled
  2. Create cron job to check notifications every day at midnight
*/

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job
SELECT cron.schedule(
  'check-notifications',  -- unique job name
  '0 0 * * *',          -- run at midnight every day
  $$
  SELECT http_post(
    'https://' || current_setting('supabase.project_id') || '.functions.supabase.co/check-notifications',
    '{}',
    'application/json',
    ARRAY[
      ('Authorization', 'Bearer ' || current_setting('supabase.anon_key'))::http_header
    ]
  );
  $$
);