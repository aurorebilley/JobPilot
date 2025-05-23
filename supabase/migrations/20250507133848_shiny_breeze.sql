/*
  # Create advice table

  1. New Tables
    - `advice`
      - `id` (uuid, primary key)
      - `content` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `advice` table
    - Add policy for authenticated users to read advice
*/

-- Create the advice table
CREATE TABLE IF NOT EXISTS advice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE advice ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read advice
CREATE POLICY "Anyone can read advice" ON advice
  FOR SELECT
  TO public
  USING (true);

-- Insert advice data
INSERT INTO advice (content) VALUES
  ('Pour ne pas perdre le fil de ta recherche d''emploi, prends l''habitude de noter chaque candidature dès que tu l''envoies, en précisant le poste, l''entreprise, le lien de l''offre et le statut.'),
  ('Consulte régulièrement tes statistiques pour identifier les canaux de candidature ou les secteurs qui te donnent le plus de réponses ou d''entretiens.'),
  ('Prévois un moment chaque semaine pour faire le point sur tes candidatures et voir celles qui nécessitent une action.'),
  ('N''oublie pas de noter aussi tes ressentis après un entretien ou un échange, cela t''aidera à mieux préparer les suivants.'),
  ('Pour maximiser tes chances, adapte toujours ton CV et ta lettre de motivation à chaque offre d''emploi à laquelle tu postules.'),
  ('Dans ton CV ou ta lettre de motivation, mets en avant des résultats concrets que tu as obtenus, comme par exemple "+20% de ventes" ou "3 projets menés à bien".'),
  ('Pense à reprendre dans ton CV les mots-clés utilisés dans l''offre d''emploi, cela t''aidera à passer les filtres automatiques utilisés par certains recruteurs.'),
  ('Ton CV doit être clair, lisible et tenir sur une seule page, surtout si tu as moins de 10 ans d''expérience.'),
  ('Pour chaque expérience, concentre-toi sur ce que tu as accompli et ce que tu as appris, pas seulement sur les tâches que tu faisais.'),
  ('Évite les fautes d''orthographe en faisant relire ta lettre de motivation par une autre personne ou en utilisant un correcteur en ligne.'),
  ('Avant un entretien, prépare trois exemples de réussites professionnelles ou personnelles, en utilisant la méthode STAR (Situation, Tâche, Action, Résultat) pour structurer ton discours.'),
  ('À la fin d''un entretien, pense toujours à poser une ou deux questions pertinentes à ton interlocuteur, cela montre que tu es impliqué et intéressé par le poste.'),
  ('Si tu as tendance à stresser avant un entretien, entraîne-toi à voix haute, enregistre-toi ou fais une simulation avec un proche pour te sentir plus à l''aise.'),
  ('Pour un entretien, prépare aussi des réponses aux questions classiques comme "Parlez-moi de vous", "Quels sont vos défauts ?" ou "Pourquoi voulez-vous ce poste ?".'),
  ('Habille-toi de manière adaptée au poste et à l''entreprise, même si l''entretien est en visio.'),
  ('Après l''entretien, envoie un message de remerciement au recruteur pour réaffirmer ta motivation et marquer des points.'),
  ('Quand tu échanges avec un recruteur ou que tu postules, pense à l''ajouter sur LinkedIn avec un petit message personnalisé pour marquer ton intérêt.'),
  ('N''hésite pas à participer à des salons, forums emploi ou événements métiers pour rencontrer des personnes dans ton secteur et élargir ton réseau professionnel.'),
  ('Pour améliorer ta visibilité, interagis sur LinkedIn en commentant ou partageant des publications en lien avec ton domaine professionnel.'),
  ('Mets à jour ton profil LinkedIn avec un titre clair, une photo pro et une description qui résume tes compétences et tes objectifs.'),
  ('Rejoins des groupes LinkedIn en lien avec ton métier pour suivre l''actualité du secteur et interagir avec d''autres professionnels.'),
  ('Si tu es à l''aise, propose un appel rapide à des personnes qui occupent un poste qui t''intéresse pour obtenir des conseils ou mieux comprendre leur quotidien.'),
  ('Ne prends pas les refus de candidature personnellement : un refus ne veut pas dire que tu es incompétent, il peut y avoir mille raisons externes.'),
  ('Pour garder le cap dans ta recherche d''emploi, fixe-toi chaque semaine des objectifs simples et atteignables, comme envoyer cinq candidatures ou faire une relance.'),
  ('Pense à te récompenser quand tu atteins tes objectifs de la semaine, cela t''aide à rester motivé et à valoriser tes efforts.'),
  ('Si tu traverses une période de découragement, fais une pause d''une journée ou deux pour souffler et revenir plus motivé.'),
  ('Garde une routine de travail : lève-toi à la même heure, installe-toi dans un endroit calme et organise ta journée comme si tu étais déjà en poste.'),
  ('N''oublie pas que chercher un emploi est un travail à part entière, sois indulgent avec toi-même si tu avances lentement.'),
  ('Mets régulièrement à jour ton CV, ton profil LinkedIn et ton portfolio pour qu''ils soient toujours prêts à être envoyés si une opportunité se présente.'),
  ('Crée un fichier ou un dossier en ligne dans lequel tu rassembles toutes tes lettres types, CV, documents scannés, certificats, etc.'),
  ('Si tu maîtrises le numérique, crée-toi un petit site ou portfolio en ligne pour te présenter et montrer tes projets ou expériences.'),
  ('Installe une extension comme Grammarly ou LanguageTool pour éviter les fautes dans tes mails et lettres.');