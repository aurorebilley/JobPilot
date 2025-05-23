JobPilot – Gestionnaire de candidatures

📋 Table des matières

À propos
Technologies
Prérequis
Installation
Fonctionnalités
Structure du projet
Scripts npm
Déploiement
Contribution
Licence
Contact
🎯 À propos

JobPilot est une application web et mobile qui simplifie et centralise votre recherche d’emploi. Elle vous permet de :

Centraliser et suivre toutes vos candidatures (statut, entreprise, offre…)
Planifier et recevoir des rappels de relance et d’entretien
Visualiser vos progrès grâce à des tableaux de bord et graphiques
Vous authentifier en toute sécurité (Firebase Auth & RLS Supabase)
Bénéficier d’une expérience fluide et responsive (React, Tailwind)
🚀 Technologies

Frontend

React 18 + TypeScript
Tailwind CSS
Chart.js pour les graphiques
Lucide React pour les icônes
Backend

Supabase (PostgreSQL + Row-Level Security + migrations SQL)
Firebase Authentication & Firestore
Edge Functions (notifications)
Outils & déploiement

Vite (bundler)
Netlify (CI/CD & hébergement)
Docker & Docker Compose (environnements local et tests)
⚙️ Prérequis

Node.js v20+
npm v10+ (ou yarn)
Un compte Firebase (Auth & Firestore)
Un compte Supabase (PostgreSQL + API key)
🛠️ Installation

Cloner le dépôt
git clone https://github.com/votre-username/jobpilot.git
cd jobpilot
Installer les dépendances
npm install
Configurer les variables d’environnement
Dupliquer .env.example en .env
Renseigner vos clés :
VITE_FIREBASE_API_KEY=…
VITE_FIREBASE_AUTH_DOMAIN=…
VITE_FIREBASE_PROJECT_ID=…
VITE_FIREBASE_STORAGE_BUCKET=…
VITE_FIREBASE_MESSAGING_SENDER_ID=…
VITE_FIREBASE_APP_ID=…
VITE_SUPABASE_URL=…
VITE_SUPABASE_ANON_KEY=…
Lancer en développement
npm run dev
Compiler pour la production
npm run build
npm run preview
✨ Fonctionnalités

Gestion des candidatures

CRUD complet (création, lecture, mise à jour, suppression)
Statuts personnalisés et historique
Gestion des entretiens

Planification (présentiel, visio, téléphone)
Rappels automatiques et historique
Suivi des procédures

Création et modification des étapes de recrutement
Notifications & rappels

Vue historique des notifications
Envoi programmé via Edge Functions
Tableaux de bord & statistiques

Graphiques de répartition par canal et par secteur
Évolution temporelle des candidatures
Authentification & sécurité

Flux Firebase Auth (email/mot de passe)
Contrôles d’accès et RLS sur Supabase
📁 Structure du projet

jobpilot/
├── public/
│ ├── _redirects configuration Netlify
│ └── vite.svg logo de démarrage
├── src/
│ ├── components/ composants React (icônes, UI)
│ ├── lib/ configuration Firebase & Supabase
│ ├── pages/ écrans de l’application
│ ├── App.tsx routes et layout principal
│ └── main.tsx point d’entrée
├── supabase/
│ └── migrations/ scripts SQL de la base de données
├── .env variables d’environnement (non committé)
├── Dockerfile
├── docker-compose.yml
├── netlify.toml configuration de déploiement
├── package.json
└── tailwind.config.js

📜 Scripts npm

npm run dev Démarre le serveur de développement
npm run build Construit l’application pour la production
npm run preview Prévisualise la version buildée
npm run lint Analyse le code avec ESLint
npm run format Formate le code avec Prettier

🚀 Déploiement

Créez un site sur Netlify et reliez votre repo GitHub
Configurez les variables d’environnement dans les Settings Netlify
Déploiement automatique à chaque push sur main
Optionnel : CLI Netlify
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
🤝 Contribution

Fork le dépôt
Crée une branche :
git checkout -b feature/ma-fonctionnalite
Commit tes changements :
git commit -m "feat: description de la fonctionnalité"
Push ta branche :
git push origin feature/ma-fonctionnalite
Ouvre une Pull Request
Respecte la convention Conventional Commits et passe les checks CI avant de merger.

Développé avec cœur par Aurore Billey
