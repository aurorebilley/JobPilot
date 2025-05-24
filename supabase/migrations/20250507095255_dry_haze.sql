/*
  # Clean up functions and related objects

  1. Drop Functions
    - Drop the set_edge_function_vars function
  2. Drop Extensions
    - Drop the http extension if no longer needed
*/

-- Drop the function for setting edge function vars
DROP FUNCTION IF EXISTS set_edge_function_vars();

-- Drop the http extension if it's not used elsewhere
DROP EXTENSION IF EXISTS http;

-- Drop the cron job for notifications check
SELECT cron.unschedule('check-notifications');