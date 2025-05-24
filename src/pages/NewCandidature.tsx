import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

interface BusinessSector {
  id: string;
  name: string;
}

interface ApplicationMethod {
  id: string;
  name: string;
}

export default function NewCandidature() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessSectors, setBusinessSectors] = useState<BusinessSector[]>([]);
  const [applicationMethods, setApplicationMethods] = useState<ApplicationMethod[]>([]);

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    companyAddress: '',
    jobUrl: '',
    applicationMethod: '',
    businessSector: '',
    status: 'postulé',
    description: '',
    notes: '',
    applicationDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch business sectors
        const { data: sectorsData, error: sectorsError } = await supabase
          .from('business_sectors')
          .select('id, name')
          .order('name');

        if (sectorsError) throw sectorsError;
        setBusinessSectors(sectorsData || []);

        // Fetch application methods
        const { data: methodsData, error: methodsError } = await supabase
          .from('application_methods')
          .select('id, name')
          .order('name');

        if (methodsError) throw methodsError;
        setApplicationMethods(methodsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      }
    };

    fetchData();
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
      // Get the names instead of IDs for business sector and application method
      const selectedSector = businessSectors.find(sector => sector.id === formData.businessSector);
      const selectedMethod = applicationMethods.find(method => method.id === formData.applicationMethod);

      const candidatureData = {
        ...formData,
        businessSector: selectedSector?.name || '',
        applicationMethod: selectedMethod?.name || '',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'candidatures'), candidatureData);
      navigate('/candidatures');
    } catch (err) {
      console.error('Error creating candidature:', err);
      setError('Une erreur est survenue lors de la création de la candidature');
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
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle candidature</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-bold text-black">
                  Intitulé du poste
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-bold text-black">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-sm font-bold text-black">
                  Adresse de l'entreprise
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="jobUrl" className="block text-sm font-bold text-black">
                  Lien vers l'offre
                </label>
                <input
                  type="url"
                  id="jobUrl"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="applicationMethod" className="block text-sm font-bold text-black">
                  Canal de candidature
                </label>
                <select
                  id="applicationMethod"
                  name="applicationMethod"
                  required
                  value={formData.applicationMethod}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                >
                  <option value="">Sélectionner un canal</option>
                  {applicationMethods.map(method => (
                    <option key={method.id} value={method.id}> 
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="businessSector" className="block text-sm font-bold text-black">
                  Secteur d'activité
                </label>
                <select
                  id="businessSector"
                  name="businessSector"
                  required
                  value={formData.businessSector}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                >
                  <option value="">Sélectionner un secteur</option>
                  {businessSectors.map(sector => (
                    <option key={sector.id} value={sector.id}> 
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-bold text-black">
                  Statut de la candidature
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                >
                  <option value="postulé">Postulé</option>
                  <option value="refusé">Refusé</option>
                  <option value="entretient">Entretien</option>
                  <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
                  <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
                  <option value="validé">Validé</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-black">
                  Description du poste
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-bold text-black">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
                />
              </div>

              <div>
                <label htmlFor="applicationDate" className="block text-sm font-bold text-black">
                  Date de candidature
                </label>
                <input
                  type="date"
                  id="applicationDate"
                  name="applicationDate"
                  required
                  value={formData.applicationDate}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4e8d60] focus:ring-[#4e8d60] sm:text-sm py-3 px-4"
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
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4e8d60]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#f2bd64] hover:bg-[#e5aa4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f2bd64] disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer la candidature'}
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