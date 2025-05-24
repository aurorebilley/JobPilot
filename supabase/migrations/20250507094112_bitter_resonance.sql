/*
  # Set environment variables for check-notifications function

  This migration:
  1. Creates a secure function to set environment variables
  2. Executes the function to configure Firebase credentials
*/

-- Create the http extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create a function to set the environment variables
CREATE OR REPLACE FUNCTION set_edge_function_vars() RETURNS void AS $$
BEGIN
  -- Make HTTP request to set environment variables
  PERFORM http((
    'POST',
    'https://jmrzsjqupjubldwxvlec.functions.supabase.co/config',
    ARRAY[
      ('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcnpzanF1cGp1Ymxkd3h2bGVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2MDM4MzYwM30.2aHqNHjllYF1jGSpVP6WTQz2UXa4ahqdsxQzW6cV2eQ')::http_header,
      ('Content-Type', 'application/json')::http_header
    ],
    'application/json',
    json_build_object(
      'name', 'check-notifications',
      'value', json_build_object(
        'SUPABASE_URL', 'https://jmrzsjqupjubldwxvlec.supabase.co',
        'SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcnpzanF1cGp1Ymxkd3h2bGVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2MDM4MzYwM30.2aHqNHjllYF1jGSpVP6WTQz2UXa4ahqdsxQzW6cV2eQ',
        'FIREBASE_CLIENT_EMAIL', 'firebase-adminsdk-fbsvc@jobpilot-1a04a.iam.gserviceaccount.com',
        'FIREBASE_PRIVATE_KEY', '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0UwVzXcHhvmYT\nSmJnQW359y4iGbvnwyZY2L/Re9/u19p3c7rkgik3FMWOQKwPF2HavptbIUo5ld6U\noWcbYiq531tZ5RtzI9sJgMrBOZc8oXIuZfGBN3oAYdGbdRt73Q2i4Zu6KMSs4wIQ\nT9mBOJzrUybfm245j4Z6pKVAPw6dkiW7CUisqDjlkuO0svWiyjTnYq7uwd2P3KkF\n4ThRNPzG4aItRbOzrn6+oHLRiJ2kt5dgNblXf7WA8OC2PvjN/tAJX0zG9JmDw0Xm\nkbd7nOMh39LCGGsyT7zky7ZuGmhZ7o6glRz7JT8Vk+Bga1NQHPy6ozZllC6DzmTQ\nW20zq0U1AgMBAAECggEAAkJL/i79f8t30eQLqYl7TDdZf5nc7cFXGKPWe1RW8NIJ\nbZeojrZGt+bttqN+xE2hrzDWF2UqXeBPwoLnHMO1D1EJ/u1M07tuQgc4AwWqrFrF\naGlkhh7gy2JuUsk7x+h0BEdZQRLDq/rICtZFPkYsSRJomUKENfpjT+QCIfToRPcL\nUCiyShkEbYxp+LytuuW3hx8CdeDKmwy+UahOpjLpZUeHoBeKRqwkWEe9YXq5Uar+\nIBlWHm95f565a3gb5VrJloQ8OooryykFFb7X2qkxmDw0s4WZIiQ0yMwCOvtfhqfl\nEiU6+cwtyAhjBgfNYW65wpEYLpX/Sb+YyUb75XqJAQKBgQDx6EYDw/e1MQfcSOdi\nRMzYOAQ09HQ1LxrEoQjzWUbZ9V7fxp6u+/EzWt+OevgxkptGhkaA8eTrDOvvVezg\nC9OE30LDIk0CZ9aDgMWRP5tT/p6VCFj1K2DWVMJRUBWjbek1dYHM/1v5Iwf5Eg5+\nwD7B24m4zbpA9drd5CFaKxQV9QKBgQC+1FGg9WDWeLlTxMWBagLXlzEU/Bh/lGjo\n8janWBsp7jiTvyf+uhqFkUCHqSmWCydLNcadztAhu1r9ydxtvUdf9hfwnLwQ7OYi\ngoHAHR8aEsp1oBXw9pzqnYJe4kYXizohV0Jb0uPophlzLkzMsYLO5HIf1iiLaYE8\ncDI5jemqQQKBgQCZ9FZi3RxP33V+N5Oy0dCApx3eSdmPY3woucgFf8L8whFwX2rs\nOIGoSmROvGoquoBB4QEL3WbwRNf/CPNpH32taZ2GrNTP/B/kr1aNeyqyyTBJ7vcW\niVXm8ih9MXej/DZYhIFoYvg41ZekZ158QoNuQvcieyPXZeC2KRMk3Je65QKBgG0R\nyX4oAatT4QlCBGkNgIZcwg7ub8ortzK9jgNj1lLG98tqjJ+JGzOQa8OeKki6I0FX\ngSgdVtSQ01cPE1AdyTfN3q0FyHAcFwVOdn6ppmcuqk1ErIXHTrTCRguZZNp8F0OL\nLkBxbxZAKXet1POB2fQKmjgcHZxhNx6mOe6vcAiBAoGAS7eezsQOjD98GizaJDq8\nnW4i1NF5DNYsDI+WZ4kec6SLns+mQNWRGL2wVGIwAJ/pMw0XFKzVaBhSM8BsfI0C\nQolF6a7Gp4rSxirzg8qKwlkj8ibEOct+3aqoF1VmpRfOo5KjogdznGMTozHCGtaj\nslEg0AYdBVNQz2e0CMNl3FQ=\n-----END PRIVATE KEY-----\n'
      )
    )::text
  ));
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT set_edge_function_vars();