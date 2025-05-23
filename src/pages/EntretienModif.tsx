import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

interface Entretien {
  id: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  meetingLink?: string;
  contactName?: string;
  contactRole?: string;
  notes?: string;
  status: string;
}

export default function EntretienModif() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    location: '',
    meetingLink: '',
    contactName: '',
    contactRole: '',
    notes: ''
  });

  useEffect(() => {
    const fetchEntretien = async () => {
      if (!auth.currentUser || !id) {
        navigate('/login');
        return;
      }

      try {
        const entretienDoc = await getDoc(doc(db, 'entretiens', id));
        
        if (!entretienDoc.exists()) {
          setError('Entretien non trouvé');
          return;
        }

        const data = entretienDoc.data();
        setFormData({
          date: data.date,
          time: data.time,
          type: data.type,
          location: data.location || '',
          meetingLink: data.meetingLink || '',
          contactName: data.contactName || '',
          contactRole: data.contactRole || '',
          notes: data.notes || ''
        });
      } catch (err) {
        console.error('Error fetching entretien:', err);
        setError('Une erreur est survenue lors du chargement de l\'entretien');
      } finally {
        setLoading(false);
      }
    };

    fetchEntretien();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !id) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const entretienRef = doc(db, 'entretiens', id);
      await updateDoc(entretienRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });

      navigate(`/entretiens/${id}`);
    } catch (err) {
      console.error('Error updating entretien:', err);
      setError('Une erreur est survenue lors de la modification de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.date) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Chargement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(`/entretiens/${id}`)}
            className="hover:opacity-80 transition-opacity"
          >
            <BackButton />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'entretien</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
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
                  onClick={() => navigate(`/entretiens/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4e8d60]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#f2bd64] hover:bg-[#e5aa4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2bd64] disabled:opacity-50"
                >
                  {loading ? 'Modification...' : 'Enregistrer les modifications'}
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