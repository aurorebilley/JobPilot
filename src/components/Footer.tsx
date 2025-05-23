import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black w-full">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
              Contact
            </Link>
            <Link to="/mentionlegal" className="text-gray-300 hover:text-white text-sm">
              Mentions légales
            </Link>
          </div>
          <div className="text-gray-300 text-sm">
            © {new Date().getFullYear()} JobPilot. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}