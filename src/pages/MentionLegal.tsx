import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function MentionLegal() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow">
        <header className="w-full pt-24 pb-12">
          <div className="absolute top-8 left-8">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <BackButton />
            </Link>
          </div>
          <div className="container mx-auto px-4">
            <Link to="/" className="flex justify-center scale-[3]">
              <Logo />
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">Mentions Légales</h1>
            <p className="text-xl text-gray-600">Informations légales et conditions d'utilisation de JobPilot</p>
          </div>
          
          <div className="space-y-16 text-black">
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">📄 Informations générales</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nom du site :</span>
                  <span className="text-gray-700">JobPilot</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">URL :</span>
                  <a href="https://jobpilot.netlify.app" className="text-[#4e8d60] hover:underline flex items-center">
                    jobpilot.netlify.app
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">👤 Éditeur</h2>
              <div className="space-y-3">
                <p>L'application est éditée par :</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">Jean Dupont</p>
                  <p className="text-gray-600">12 rue de la Candidature, 44000 Nantes, France</p>
                  <p className="text-gray-600">Contact : contact@jobpilot.app</p>
                </div>
                <div className="mt-6">
                  <p><span className="font-medium">Directeur de la publication :</span> Jean Dupont</p>
                  <p className="mt-2"><span className="font-medium">Statut de l'éditeur :</span> Projet personnel dans le cadre d'un cursus de formation — Titre professionnel Développeur Web et Web Mobile.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">📍 Hébergement</h2>
              <div className="space-y-3">
                <p>Le site est hébergé par :</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">Netlify, Inc.</p>
                  <p className="text-gray-600">2325 3rd Street, Suite 215</p>
                  <p className="text-gray-600">San Francisco, California 94107</p>
                  <a href="https://www.netlify.com" className="text-[#4e8d60] hover:underline flex items-center mt-2">
                    www.netlify.com
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">🔐 Protection des données personnelles</h2>
              <div className="space-y-4">
                <p className="text-gray-700">Les données personnelles collectées (email, prénom...) sont uniquement utilisées pour permettre à l'utilisateur de suivre ses candidatures. Elles ne sont ni revendues ni transmises à des tiers.</p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="font-medium">Vos droits RGPD :</p>
                  <p className="text-gray-600 mt-2">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
                  <p className="text-gray-600 mt-2">Pour exercer ce droit, contactez-nous à : <a href="mailto:contact@jobpilot.app" className="text-[#4e8d60] hover:underline">contact@jobpilot.app</a></p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">⚖️ Propriété intellectuelle</h2>
              <div className="space-y-4">
                <p className="text-gray-700">L'ensemble des éléments du site (textes, logo, interface, icônes, code, etc.) sont protégés par le droit de la propriété intellectuelle.</p>
                <p className="text-gray-700">Toute reproduction totale ou partielle sans autorisation est interdite.</p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">🛠 Technologies utilisées</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">Framework</p>
                    <p className="text-gray-600">React, TypeScript</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">Back-end</p>
                    <p className="text-gray-600">Firebase Auth, Firestore, Supabase</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">Hébergement</p>
                    <p className="text-gray-600">Netlify</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">Design et UI</p>
                    <p className="text-gray-600">Tailwind CSS</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}