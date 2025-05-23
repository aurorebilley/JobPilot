import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

interface LocationState {
  candidatureId: string;
  companyName: string;
  jobTitle: string;
}

export default function NewEntretien() {
  const navigate = useNavigate();
  const location = useLocation();
  const { candidatureId, companyName, jobTitle } = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    status: 'en attente', 
    type: 'presentiel',
    location: '',
    meetingLink: '',
    contactName: '',
    contactRole: '',
    notes: ''
  });

  React.useEffect(() => {
    // Launch confetti when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const entretienData = {
        ...formData,
        candidatureId,
        companyName,
        jobTitle,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Create the interview document and get its ID
      const entretienRef = await addDoc(collection(db, 'entretiens'), entretienData);
      
      // Update the candidature with the interview ID
      const candidatureRef = doc(db, 'candidatures', candidatureId);
      await updateDoc(candidatureRef, {
        entretienId: entretienRef.id,
        updatedAt: serverTimestamp()
      });

      navigate('/candidatures');
    } catch (err) {
      console.error('Error creating entretien:', err);
      setError('Une erreur est survenue lors de la création de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/candidatures')}
            className="hover:opacity-80 transition-opacity"
          >
            <BackButton />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nouvel entretien</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">{jobTitle}</h2>
              <p className="text-sm text-gray-500">{companyName}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Heure
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                >
                  <option value="en attente">En attente</option>
                  <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
                  <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
                  <option value="refusé">Refusé</option>
                  <option value="validé">Validé</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type d'entretien
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                >
                  <option value="presentiel">Présentiel</option>
                  <option value="visio">Visioconférence</option>
                  <option value="telephone">Téléphone</option>
                </select>
              </div>

              {formData.type === 'presentiel' && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>
              )}

              {formData.type === 'visio' && (
                <div>
                  <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">
                    Lien de la visioconférence
                  </label>
                  <input
                    type="url"
                    id="meetingLink"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>

                <div>
                  <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700">
                    Fonction du contact
                  </label>
                  <input
                    type="text"
                    id="contactRole"
                    name="contactRole"
                    value={formData.contactRole}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm px-4 py-3"
                  placeholder="Points à préparer, questions à poser..."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/candidatures')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4e8d60]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#f2bd64] hover:bg-[#e5aa4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2bd64] disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer l\'entretien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}