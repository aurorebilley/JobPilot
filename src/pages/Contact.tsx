import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';
import PhoneIcon from '../components/PhoneIcon';
import EmailIcon from '../components/EmailIcon';
import LocationIcon from '../components/LocationIcon';

export default function Contact() {
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-black">
              Une question ? N'hésitez pas à nous contacter, notre équipe sera ravie de vous aider.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-8">
                <PhoneIcon />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Téléphone</h3>
                <p className="text-black">+33 (0)1 23 45 67 89</p>
                <p className="text-black mt-1">Lun-Ven 9:00 à 18:00</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-8">
                <EmailIcon />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Email</h3>
                <p className="text-black">support@jobpilot.fr</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-8">
                <LocationIcon />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Adresse</h3>
                <p className="text-black">123 Avenue des Champs-Élysées</p>
                <p className="text-black">75008 Paris, France</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}