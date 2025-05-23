import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import BellNotif from '../components/BellNotif';
import Check from '../components/Check';
import Statistics from '../components/Statistics';
import Centraliser from '../components/Centraliser';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow">
      <header className="w-full pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center scale-[3]">
            <Logo />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              Pilote ta recherche d'emploi comme un pro 🚀
            </h1>
            <p className="text-xl text-black mb-8">
              Centralise, relance, analyse... JobPilot t'aide à garder le cap dans ta recherche d'emploi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="w-full sm:w-[160px] px-8 py-3 bg-[#4e8d60] text-white rounded-lg font-semibold hover:bg-[#3d6f4b] transition-colors duration-200 whitespace-nowrap text-center"
              >
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-[160px] px-8 py-3 bg-[#f2bd64] text-black rounded-lg font-semibold hover:bg-[#e5aa4d] transition-colors duration-200 whitespace-nowrap text-center"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="flex-1 grid grid-cols-2 gap-6 max-w-lg">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-[#4e8d60] mb-4 scale-150 origin-left">
                <Centraliser />
              </div>
              <h3 className="font-semibold mb-2">Centralisation</h3>
              <p className="text-black text-sm">Toutes tes candidatures au même endroit</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-[#f2bd64] mb-4 scale-150 origin-left">
                <BellNotif />
              </div>
              <h3 className="font-semibold mb-2">Rappels</h3>
              <p className="text-black text-sm">Ne rate plus aucune relance importante</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-[#4e8d60] mb-4 scale-150 origin-left">
                <Statistics />
              </div>
              <h3 className="font-semibold mb-2">Statistiques</h3>
              <p className="text-black text-sm">Analyse ta progression en temps réel</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-[#f2bd64] mb-4 scale-150 origin-left">
                <Check />
              </div>
              <h3 className="font-semibold mb-2">Suivi</h3>
              <p className="text-black text-sm">Garde une vue claire sur tes progrès</p>
            </div>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}