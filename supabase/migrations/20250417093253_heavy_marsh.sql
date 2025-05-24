/*
  # Create application methods table

  1. New Tables
    - `application_methods`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `application_methods` table
    - Add policy for authenticated users to read methods
*/

-- Create the application methods table
CREATE TABLE IF NOT EXISTS application_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE application_methods ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read methods
CREATE POLICY "Anyone can read application methods" ON application_methods
  FOR SELECT
  TO public
  USING (true);

-- Insert all application methods
INSERT INTO application_methods (name) VALUES
  ('Pôle Emploi'),
  ('Indeed'),
  ('LinkedIn'),
  ('Welcome to the Jungle'),
  ('APEC'),
  ('Monster'),
  ('Jobteaser'),
  ('HelloWork'),
  ('Keljob'),
  ('Meteojob'),
  ('Cadremploi'),
  ('L''Étudiant'),
  ('StudentJob'),
  ('ProfilCulture'),
  ('Jobijoba'),
  ('La bonne boîte (Pôle Emploi)'),
  ('Glassdoor'),
  ('ChooseMyCompany'),
  ('Le Bon Coin (Emploi)'),
  ('Facebook Jobs'),
  ('QAPA'),
  ('Talent.com'),
  ('Work In Tech / Dev'),
  ('Remotive (remote jobs)'),
  ('AngelList / Wellfound (startups)'),
  ('Candidature spontanée par email'),
  ('Recommandation / Réseau'),
  ('Cabinet de recrutement'),
  ('Salon de l''emploi / Job Dating'),
  ('Agence d''intérim'),
  ('Site de l''entreprise directement'),
  ('Portail intranet (si offre interne)'),
  ('Autre')
ON CONFLICT (name) DO NOTHING;