import React from 'react';
import { X, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Homme from './Homme';
import BlancHomme from './BlancHomme';
import BlancMinimalistLogo from './BlancMinimalistLogo';
import ProcedureIcon from './ProcedureIcon';
import BlancProcedureIcon from './BlancProcedureIcon';
import TableauIcon from './TableauIcon';
import EntretiensIcon from './EntretiensIcon';
import BlancEntretiensIcon from './BlancEntretiensIcon';
import BlancTableauIcon from './BlancTableauIcon';
import MinimalistLogo from './MinimalistLogo';
import Statistics from './Statistics';
import BlancStatistics from './BlancStatistics';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Menu</h2>
            <nav className="space-y-4">
              <Link
                to="/dashboard"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-[#4e8d60] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {location.pathname === '/dashboard' ? <BlancTableauIcon /> : <TableauIcon />}
                <span>Tableau de bord</span>
              </Link>

              <Link
                to="/candidatures"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/candidatures'
                    ? 'bg-[#4e8d60] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {location.pathname === '/candidatures' ? <BlancMinimalistLogo /> : <MinimalistLogo />}
                </div>
                <span>Candidatures</span>
              </Link>

              <Link
                to="/entretiens"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/entretiens'
                    ? 'bg-[#4e8d60] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {location.pathname === '/entretiens' ? <BlancEntretiensIcon /> : <EntretiensIcon />}
                </div>
                <span>Entretiens</span>
              </Link>

              <Link
                to="/procedures"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors mb-2 ${
                  location.pathname === '/procedures'
                    ? 'bg-[#4e8d60] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {location.pathname === '/procedures' ? <BlancProcedureIcon /> : <ProcedureIcon />}
                </div>
                <span className="leading-none">Procédure de recrutement</span>
              </Link>
              
              <Link
                to="/statistics"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/statistics'
                    ? 'bg-[#4e8d60] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {location.pathname === '/statistics' ? <BlancStatistics /> : <Statistics />}
                </div>
                <span className="leading-none">Statistiques</span>
              </Link>

              <Link
                to="/account"
                onClick={onClose}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/account'
                    ? 'bg-[#4e8d60] text-white [&_svg]:text-white [&_path]:!fill-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {location.pathname === '/account' ? <BlancHomme /> : <Homme />}
                <span>Mon compte</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}