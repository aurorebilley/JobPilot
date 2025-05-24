import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

interface LocationState {
  candidatureId: string;
  companyName: string;
  jobTitle: string;
  procedureType: string;
}

export default function NewProcedureRecrutement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { candidatureId, companyName, jobTitle, procedureType } = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    procedureId: '', // Will be set after creation
    date: '',
    time: '',
    status: procedureType, // Set default status based on procedure type
    type: 'presentiel',
    location: '',
    meetingLink: '',
    contactName: '',
    contactRole: '',
    testTechnique: false,
    testPersonnalite: false,
    miseEnSituation: false,
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
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
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
      const procedureData = {
        ...formData,
        procedureId: '', // Will be set after creation
        candidatureId,
        companyName,
        jobTitle,
        procedureType,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Create the procedure document and get its ID
      const procedureRef = await addDoc(collection(db, 'procedures'), procedureData);
      
      // Update the procedure with its own ID
      await updateDoc(doc(db, 'procedures', procedureRef.id), {
        procedureId: procedureRef.id
      });
      
      // Get the candidature document
      const candidatureRef = doc(db, 'candidatures', candidatureId);
      const candidatureDoc = await getDoc(candidatureRef);
      
      if (candidatureDoc.exists()) {
        // Get existing procedure IDs or initialize empty array
        const existingProcedureIds = candidatureDoc.data().procedureIds || [];
        
        // Add new procedure ID to array
        await updateDoc(candidatureRef, {
          procedureIds: [...existingProcedureIds, procedureRef.id]
        });
      }

      navigate('/candidatures');
    } catch (err) {
      console.error('Error creating procedure:', err);
      setError('Une erreur est survenue lors de la création de la procédure');
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
          <h1 className="text-3xl font-bold text-gray-900">
            {procedureType === 'Procédure de recrutement 1' ? 'Première procédure de recrutement' : 'Deuxième procédure de recrutement'}
          </h1>
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
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                >
                  <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
                  <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
                  <option value="refusé">Refusé</option>
                  <option value="validé">Validé</option>
                  <option value="entretien">Entretien</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type de procédure
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                    required
                    value={formData.meetingLink}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Type d'évaluation
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="testTechnique"
                      name="testTechnique"
                      checked={formData.testTechnique}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#4e8d60] focus:ring-[#4e8d60] border-gray-300 rounded"
                    />
                    <label htmlFor="testTechnique" className="ml-2 block text-sm text-gray-700">
                      Test technique
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="testPersonnalite"
                      name="testPersonnalite"
                      checked={formData.testPersonnalite}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#4e8d60] focus:ring-[#4e8d60] border-gray-300 rounded"
                    />
                    <label htmlFor="testPersonnalite" className="ml-2 block text-sm text-gray-700">
                      Test de personnalité
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="miseEnSituation"
                      name="miseEnSituation"
                      checked={formData.miseEnSituation}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#4e8d60] focus:ring-[#4e8d60] border-gray-300 rounded"
                    />
                    <label htmlFor="miseEnSituation" className="ml-2 block text-sm text-gray-700">
                      Mise en situation
                    </label>
                  </div>
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
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                  {loading ? 'Création...' : 'Créer la procédure'}
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