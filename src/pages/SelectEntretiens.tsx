import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface Candidature {
  id: string;
  jobTitle: string;
  companyName: string;
  applicationDate: string;
  status: string;
}

export default function SelectEntretiens() {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidatures = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const startOfMonth = new Date(selectedYear, selectedMonth, 1).toISOString();
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0).toISOString();

        const q = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid),
          where('applicationDate', '>=', startOfMonth),
          where('applicationDate', '<=', endOfMonth),
          orderBy('applicationDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const candidaturesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Candidature[];

        setCandidatures(candidaturesData);
      } catch (err) {
        console.error('Error fetching candidatures:', err);
        setError('Une erreur est survenue lors du chargement des candidatures');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [selectedMonth, selectedYear, navigate]);

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSelectCandidature = (candidature: Candidature) => {
    navigate('/candidatures/entretien/new', {
      state: {
        candidatureId: candidature.id,
        companyName: candidature.companyName,
        jobTitle: candidature.jobTitle
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/entretiens')}
            className="hover:opacity-80 transition-opacity"
          >
            <BackButton />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Sélectionner une candidature</h1>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-lg font-medium text-gray-900">
              {months[selectedMonth]} {selectedYear}
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Chargement des candidatures...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : candidatures.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Aucune candidature pour {months[selectedMonth].toLowerCase()} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatures.map((candidature) => (
                <div
                  key={candidature.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleSelectCandidature(candidature)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {candidature.jobTitle}
                    </h3>
                    <p className="text-gray-600 mb-4">{candidature.companyName}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(candidature.applicationDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}