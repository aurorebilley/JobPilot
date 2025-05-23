/*
  # Create business sectors table

  1. New Tables
    - `business_sectors`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `business_sectors` table
    - Add policy for authenticated users to read sectors
*/

-- Create the business sectors table
CREATE TABLE IF NOT EXISTS business_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_sectors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read sectors
CREATE POLICY "Anyone can read business sectors" ON business_sectors
  FOR SELECT
  TO public
  USING (true);

-- Insert all business sectors
INSERT INTO business_sectors (name) VALUES
  ('Administration / Fonction publique'),
  ('Agriculture / Agroalimentaire'),
  ('Art / Culture / Patrimoine'),
  ('Banque / Assurance / Finance'),
  ('Bâtiment / Travaux publics'),
  ('Commerce / Distribution'),
  ('Communication / Marketing / Publicité'),
  ('Comptabilité / Gestion / Audit'),
  ('Conseil / Stratégie'),
  ('Droit / Justice / Juridique'),
  ('Éducation / Formation'),
  ('Énergie / Environnement'),
  ('Hôtellerie / Restauration / Tourisme'),
  ('Immobilier'),
  ('Industrie / Production / Maintenance'),
  ('Informatique / Télécoms'),
  ('Logistique / Transport / Supply Chain'),
  ('Luxe / Mode / Beauté'),
  ('Médias / Journalisme / Édition'),
  ('Métiers de l''artisanat'),
  ('Recherche / Sciences'),
  ('Ressources humaines / Recrutement'),
  ('Santé / Social / Médico-social'),
  ('Sécurité / Défense / Armée'),
  ('Services à la personne / Aide à domicile'),
  ('Sport / Animation / Loisirs'),
  ('Startups / Innovation / Tech'),
  ('Autres secteurs / Divers')
ON CONFLICT (name) DO NOTHING;