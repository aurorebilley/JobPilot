import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import BackButton from '../components/BackButton';
import LightningIcon from '../components/LightningIcon';
import ClockIcon from '../components/ClockIcon';
import LockIcon from '../components/LockIcon';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full">
          <div className="absolute top-8 left-8 z-50">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <BackButton />
            </Link>
          </div>
          <div className="flex justify-center scale-100 sm:scale-[1.75] mb-12">
            <Logo />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 lg:max-w-md mx-auto">
              <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
                Connexion
              </h2>
              <div className="bg-white py-6 sm:py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Adresse email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#4e8d60] focus:border-[#4e8d60] text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#4e8d60] focus:border-[#4e8d60] text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-black bg-[#f2bd64] hover:bg-[#e5aa4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2bd64] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                  </div>

                  <div className="text-sm text-center mt-4">
                    <span className="text-gray-600">Pas encore de compte ?</span>{' '}
                    <Link to="/signup" className="text-[#4e8d60] hover:text-[#3d6f4b] font-medium">
                      S'inscrire
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side - Features */}
            <div className="hidden lg:block w-1/2 pl-8 mt-16">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Vous aimez JobPilot ?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Partagez votre expérience</h4>
                      <p className="text-gray-600 text-sm">
                        Racontez comment JobPilot vous aide dans votre recherche d'emploi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-4">
                  <p className="text-sm text-gray-500 italic">
                    "JobPilot m'a permis de mieux organiser ma recherche d'emploi et d'obtenir mon poste actuel !"
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Marie D. - Développeuse Web
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    "Grâce aux conseils de la communauté, j'ai pu améliorer mes techniques de candidature."
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Thomas R. - Product Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}