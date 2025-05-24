import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, Video, Phone, Calendar, History, Link as LinkIcon } from 'lucide-react';
import VisioIcon from '../components/VisioIcon';
import PhoneIcon from '../components/PhoneIcon';
import Header from '../components/Header';
import EmailIcon from '../components/EmailIcon';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import LocationIcon from '../components/LocationIcon';
import CompanyIcon from '../components/CompanyIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import IndeedIcon from '../components/canal/IndeedIcon';
import HelloWorkIcon from '../components/canal/HelloWorkIcon';
import GlassdoorIcon from '../components/canal/GlassdoorIcon';
import WelcomeToTheJungleIcon from '../components/canal/WelcomeToTheJungleIcon';
import MeteojobIcon from '../components/canal/MeteojobIcon';
import TalentIcon from '../components/canal/TalentIcon';
import StudentJobIcon from '../components/canal/StudentJobIcon';
import SiteEntrepriseIcon from '../components/canal/SiteEntrepriseIcon';
import JobDatingIcon from '../components/canal/JobDatingIcon';
import RemotiveIcon from '../components/canal/RemotiveIcon';
import ReseauxIcon from '../components/canal/ReseauxIcon';
import QapaIcon from '../components/canal/QapaIcon';
import ProfilCultureIcon from '../components/canal/ProfilCultureIcon';
import IntranetIcon from '../components/canal/IntranetIcon';
import MonsterIcon from '../components/canal/MonsterIcon';
import JobijobaIcon from '../components/canal/JobijobaIcon';
import JobteaserIcon from '../components/canal/JobteaserIcon';
import InterimIcon from '../components/canal/InterimIcon';
import ApecIcon from '../components/canal/ApecIcon';
import WellfoundIcon from '../components/canal/WellfoundIcon';
import CabinetRecrutementIcon from '../components/canal/CabinetRecrutementIcon';
import CadreemploiIcon from '../components/canal/CadreemploiIcon';
import ChooseMyCompanyIcon from '../components/canal/ChooseMyCompanyIcon';
import FacebookIcon from '../components/canal/FacebookIcon';
import FranceTravailIcon from '../components/canal/FranceTravailIcon';
import KeljobIcon from '../components/canal/KeljobIcon';
import LaBonneBoiteIcon from '../components/canal/LaBonneBoiteIcon';
import LeBonCoinIcon from '../components/canal/LeBonCoinIcon';
import LEtudiantIcon from '../components/canal/LEtudiantIcon';
import LinkedInIcon from '../components/canal/LinkedInIcon';
import AdminIcon from '../components/secteur/AdminIcon';
import ImmobilierIcon from '../components/secteur/ImmobilierIcon';
import MaintenanceIcon from '../components/secteur/MaintenanceIcon';
import TelecomIcon from '../components/secteur/TelecomIcon';
import SupplyChainIcon from '../components/secteur/SupplyChainIcon';
import TechIcon from '../components/secteur/TechIcon';
import LoisirIcon from '../components/secteur/LoisirIcon';
import AideADomicileIcon from '../components/secteur/AideADomicileIcon';
import AuditIcon from '../components/secteur/AuditIcon';
import BtpIcon from '../components/secteur/BtpIcon';
import ArmeIcon from '../components/secteur/ArmeIcon';
import MedicoSocialIcon from '../components/secteur/MedicoSocialIcon';
import RHIcon from '../components/secteur/RHIcon';
import RechercheIcon from '../components/secteur/RechercheIcon';
import ArtisanatIcon from '../components/secteur/ArtisanatIcon';
import ModeIcon from '../components/secteur/ModeIcon';
import EditionIcon from '../components/secteur/EditionIcon';
import DistributionIcon from '../components/secteur/DistributionIcon';
import JuridiqueIcon from '../components/secteur/JuridiqueIcon';
import FormationIcon from '../components/secteur/FormationIcon';
import EnvironnementIcon from '../components/secteur/EnvironnementIcon';
import RestaurationIcon from '../components/secteur/RestaurationIcon';
import PubIcon from '../components/secteur/PubIcon';
import AgroalimentaireIcon from '../components/secteur/AgroalimentaireIcon';
import CultureIcon from '../components/secteur/CultureIcon';
import AutreIcon from '../components/secteur/AutreIcon';
import FinanceIcon from '../components/secteur/FinanceIcon';
import StrategieIcon from '../components/secteur/StrategieIcon';


interface Candidature {
  id: string;
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  jobUrl: string;
  status: string;
  applicationDate: string;
  description: string;
  notes: string;
  entretienId?: string;
  applicationMethod: string;
  businessSector: string;
}

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

interface Procedure {
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
  testTechnique: boolean;
  testPersonnalite: boolean;
  miseEnSituation: boolean;
  notes?: string;
  procedureType: string;
  status: string;
}

interface HistoryEntry {
  id: string;
  status: string;
  created_at: string;
}

export default function CandidatureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState('');

  useEffect(() => {
    const fetchCandidature = async () => {
      if (!auth.currentUser || !id) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const candidatureDoc = await getDoc(doc(db, 'candidatures', id));
        
        if (!candidatureDoc.exists()) {
          setError('Candidature non trouvée');
          return;
        }

        // Fetch linked interviews if entretienId exists
        if (candidatureDoc.data().entretienId) {
          const entretienDoc = await getDoc(doc(db, 'entretiens', candidatureDoc.data().entretienId));
          if (entretienDoc.exists()) {
            setEntretiens([{
              id: entretienDoc.id,
              ...entretienDoc.data()
            } as Entretien]);
          }
        }

        // Fetch linked procedures
        const proceduresQuery = query(
          collection(db, 'procedures'),
          where('candidatureId', '==', id)
        );
        const proceduresSnapshot = await getDocs(proceduresQuery);
        setProcedures(proceduresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Procedure)));

        // Fetch candidature history
        const { data: historyData, error: historyError } = await supabase
          .from('candidature_history')
          .select('*')
          .eq('candidature_id', id)
          .order('created_at', { ascending: false });

        if (historyError) {
          console.error('Error fetching history:', historyError);
        } else {
          setHistory(historyData || []);
        }

        setCandidature({
          id: candidatureDoc.id,
          ...candidatureDoc.data()
        } as Candidature);
      } catch (err) {
        console.error('Error fetching candidature:', err);
        setError('Une erreur est survenue lors du chargement de la candidature');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidature();
  }, [id, navigate]);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!candidature || !auth.currentUser) return;
    
    try {
      const candidatureRef = doc(db, 'candidatures', candidature.id);
      const now = new Date();
      
      // Get any linked procedures
      const proceduresQuery = query(
        collection(db, 'procedures'),
        where('candidatureId', '==', candidature.id)
      );
      const proceduresSnapshot = await getDocs(proceduresQuery);
      
      // Update procedure status if needed
      const statusesToTrack = ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'];
      if (statusesToTrack.includes(newStatus)) {
        const procedurePromises = proceduresSnapshot.docs.map(async (procedureDoc) => {
          await updateDoc(procedureDoc.ref, {
            status: newStatus,
            updatedAt: now
          });
          
          // Save to Supabase procedure_history
          if (auth.currentUser) {
            const { error: procedureHistoryError } = await supabase
              .from('procedure_history')
              .insert({
                user_id: auth.currentUser.uid,
                candidature_id: candidature.id,
                procedure_id: procedureDoc.id,
                type: procedureDoc.data().procedureType,
                status: newStatus,
                created_at: now.toISOString()
              });
              
            if (procedureHistoryError) {
              console.error('Error saving to procedure_history:', procedureHistoryError);
            }
          }
        });
        
        await Promise.all(procedurePromises);
      }
      
      await updateDoc(candidatureRef, {
        status: newStatus,
        updatedAt: now
      });
      
      // Save to Supabase interview_history if status is not "postulé" and entretienId exists
      if (candidature.entretienId && newStatus !== 'postulé') {
        await supabase
          .from('interview_history')
          .insert({
            user_id: auth.currentUser.uid,
            candidature_id: candidature.id,
            interview_id: candidature.entretienId,
            status: newStatus,
            created_at: now.toISOString()
          });
      }
      
      // Update linked interview status if it exists and status is not "postulé"
      if (candidature.entretienId && newStatus !== 'postulé') {
        const entretienRef = doc(db, 'entretiens', candidature.entretienId);
        await updateDoc(entretienRef, {
          status: newStatus,
          updatedAt: now
        });

        // Save to Supabase interview_history
        if (auth.currentUser) {
          await supabase
            .from('interview_history')
            .insert({
              user_id: auth.currentUser.uid,
              candidature_id: candidature.id,
              interview_id: candidature.entretienId,
              status: newStatus,
              created_at: now.toISOString()
            });
        }
      }
      
      // Save to Supabase candidature_history
      if (auth.currentUser) {
        const { error: candidatureHistoryError } = await supabase
          .from('candidature_history')
          .insert({
            user_id: auth.currentUser.uid,
            candidature_id: candidature.id,
            status: newStatus,
            created_at: now.toISOString()
          });
          
        if (candidatureHistoryError) {
          console.error('Error saving to candidature_history:', candidatureHistoryError);
        }
      }
      
      if (newStatus === 'entretien') {
        navigate('/candidatures/entretien/new', {
          state: {
            candidatureId: candidature.id,
            companyName: candidature.companyName,
            jobTitle: candidature.jobTitle
          }
        });
        return;
      } else if (newStatus === 'Procédure de recrutement 1' || newStatus === 'Procédure de recrutement 2') {
        navigate('/candidatures/procedure/new', {
          state: {
            candidatureId: candidature.id,
            companyName: candidature.companyName,
            jobTitle: candidature.jobTitle,
            procedureType: newStatus
          }
        });
        return;
      }
      
      // Update local state
      setCandidature({
        ...candidature,
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!candidature || !auth.currentUser || !id) return;
    
    try {
      setIsDeleting(true);
      
      setDeleteProgress('Suppression des entretiens liés...');
      // 1. Delete linked interviews
      if (candidature.entretienId) {
        try {
          await deleteDoc(doc(db, 'entretiens', candidature.entretienId));
          console.log(`Deleted linked interview: ${candidature.entretienId}`);
        } catch (err) {
          console.error(`Error deleting interview ${candidature.entretienId}:`, err);
        }
      }
      
      setDeleteProgress('Suppression des procédures liées...');
      // 2. Delete linked procedures
      if (candidature.procedureIds && candidature.procedureIds.length > 0) {
        const procedurePromises = candidature.procedureIds.map(async (procedureId) => {
          try {
            await deleteDoc(doc(db, 'procedures', procedureId));
            console.log(`Deleted linked procedure: ${procedureId}`);
          } catch (err) {
            console.error(`Error deleting procedure ${procedureId}:`, err);
          }
        });
        
        await Promise.all(procedurePromises);
      } else {
        // If procedureIds is not in the candidature object, query for procedures
        const proceduresQuery = query(
          collection(db, 'procedures'),
          where('candidatureId', '==', candidature.id)
        );
        
        const proceduresSnapshot = await getDocs(proceduresQuery);
        
        const procedurePromises = proceduresSnapshot.docs.map(async (procedureDoc) => {
          try {
            await deleteDoc(procedureDoc.ref);
            console.log(`Deleted linked procedure: ${procedureDoc.id}`);
          } catch (err) {
            console.error(`Error deleting procedure ${procedureDoc.id}:`, err);
          }
        });
        
        await Promise.all(procedurePromises);
      }
      
      setDeleteProgress('Suppression de l\'historique...');
      // 3. Delete history records from Supabase
      try {
        // Delete candidature history
        const { error: candidatureHistoryError } = await supabase
          .from('candidature_history')
          .delete()
          .eq('candidature_id', candidature.id);
          
        if (candidatureHistoryError) {
          console.error('Error deleting candidature history:', candidatureHistoryError);
        } else {
          console.log(`Deleted candidature history for: ${candidature.id}`);
        }
        
        // Delete interview history for this candidature
        if (candidature.entretienId) {
          const { error: interviewHistoryError } = await supabase
            .from('interview_history')
            .delete()
            .eq('interview_id', candidature.entretienId);
            
          if (interviewHistoryError) {
            console.error('Error deleting interview history:', interviewHistoryError);
          } else {
            console.log(`Deleted interview history for interview: ${candidature.entretienId}`);
          }
        }
        
        // Delete all interview history for this candidature regardless of interview ID
        const { error: allInterviewHistoryError } = await supabase
          .from('interview_history')
          .delete()
          .eq('candidature_id', candidature.id);
          
        if (allInterviewHistoryError) {
          console.error('Error deleting all interview history for candidature:', allInterviewHistoryError);
        } else {
          console.log(`Deleted all interview history for candidature: ${candidature.id}`);
        }
        
        // Delete procedure history for this candidature
        const { error: procedureHistoryError2 } = await supabase
          .from('procedure_history')
          .delete()
          .eq('candidature_id', candidature.id);
          
        if (procedureHistoryError2) {
          console.error('Error deleting procedure history:', procedureHistoryError2);
        } else {
          console.log(`Deleted procedure history for candidature: ${candidature.id}`);
        }
      } catch (err) {
        console.error('Error deleting history records:', err);
      }
      
      setDeleteProgress('Suppression de la candidature...');
      // 3. Finally delete the candidature
      await deleteDoc(doc(db, 'candidatures', id));
      
      navigate('/candidatures');
    } catch (err) {
      console.error('Error deleting candidature:', err);
      setError('Une erreur est survenue lors de la suppression de la candidature');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
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

  if (error || !candidature) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error || 'Candidature non trouvée'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/candidatures')}
          className="hover:opacity-80 transition-opacity"
          aria-label="Retour"
        >
          <BackButton />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Détails de la candidature</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/candidatures/modif/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors duration-200"
          aria-label="Modifier la candidature"
        >
          <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Modifier</span>
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
          aria-label="Supprimer la candidature"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Supprimer</span>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isDeleting ? 'Suppression en cours...' : 'Confirmer la suppression'}
            </h3>
            {isDeleting ? (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#4e8d60] h-2.5 rounded-full animate-pulse w-full"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{deleteProgress}</p>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible et supprimera également :
                <ul className="list-disc ml-5 mt-2">
                  <li>Tous les entretiens liés</li>
                  <li>Toutes les procédures de recrutement liées</li>
                  <li>Tout l'historique de cette candidature</li>
                </ul>
              </p>
            )}
            <div className="flex justify-end space-x-3">
              {!isDeleting && (
                <>
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full mb-8">
        <div className="w-full bg-white shadow rounded-lg p-6 relative">
          <div className="sm:hidden mb-4">
            <select
              value={candidature.status}
              onChange={e => handleStatusChange(e.target.value)}
              className={`
                w-full px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer appearance-none
                ${candidature.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                ${candidature.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                ${candidature.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                ${candidature.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                ${candidature.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                ${candidature.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                bg-no-repeat bg-[length:16px] bg-[center_right_8px]
                bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
              `}
            >
              <option value="postulé">Postulé</option>
              <option value="refusé">Refusé</option>
              <option value="entretien">Entretien</option>
              <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
              <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
              <option value="validé">Validé</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-full sm:w-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {candidature.jobTitle}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5"><CompanyIcon /></div>
                  <span>{candidature.companyName}</span>
                </div>
              </div>
              <div className="hidden sm:block w-full sm:w-auto">
                <select
                  value={candidature.status}
                  onChange={e => handleStatusChange(e.target.value)}
                  className={`
                    w-full sm:w-40 px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer appearance-none
                    ${candidature.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                    ${candidature.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                    ${candidature.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                    ${candidature.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                    ${candidature.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                    ${candidature.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                    focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                    bg-no-repeat bg-[length:16px] bg-[center_right_8px]
                    bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
                  `}
                >
                  <option value="postulé">Postulé</option>
                  <option value="refusé">Refusé</option>
                  <option value="entretien">Entretien</option>
                  <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
                  <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
                  <option value="validé">Validé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {candidature.companyAddress && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <div className="w-5 h-5"><LocationIcon /></div>
                  <span>{candidature.companyAddress}</span>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date de candidature</h3>
              <div className="mt-1 flex items-center gap-2 text-gray-900">
                <div className="w-4 h-4"><BriefcaseIcon /></div>
                <span>{new Date(candidature.applicationDate).toLocaleDateString()}</span>
              </div>
            </div>
            {candidature.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Description du poste</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{candidature.description}</p>
              </div>
            )}
            {candidature.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{candidature.notes}</p>
              </div>
            )}
            {candidature.jobUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Lien de l'offre</h3>
                <a
                  href={candidature.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-2 text-[#4e8d60] hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Voir l'offre</span>
                </a>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Canal de candidature</h3>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-5 h-5">
                    {candidature.applicationMethod === "Glassdoor" && <GlassdoorIcon />}
                    {candidature.applicationMethod === "Indeed" && <IndeedIcon />}
                    {candidature.applicationMethod === "HelloWork" && <HelloWorkIcon />}
                    {candidature.applicationMethod === "Welcome to the Jungle" && <WelcomeToTheJungleIcon />}
                    {candidature.applicationMethod === "Jobijoba" && <JobijobaIcon />}
                    {candidature.applicationMethod === "Jobteaser" && <JobteaserIcon />}
                    {candidature.applicationMethod === "Meteojob" && <MeteojobIcon />}
                    {candidature.applicationMethod === "Monster" && <MonsterIcon />}
                    {candidature.applicationMethod === "QAPA" && <QapaIcon />}
                    {candidature.applicationMethod === "Recommandation / Réseau" && <ReseauxIcon />}
                    {candidature.applicationMethod === "Remotive (remote jobs)" && <RemotiveIcon />}
                    {candidature.applicationMethod === "Salon de l'emploi / Job Dating" && <JobDatingIcon />}
                    {candidature.applicationMethod === "Site de l'entreprise directement" && <SiteEntrepriseIcon />}
                    {candidature.applicationMethod === "StudentJob" && <StudentJobIcon />}
                    {candidature.applicationMethod === "Talent.com" && <TalentIcon />}
                    {candidature.applicationMethod === "ProfilCulture" && <ProfilCultureIcon />}
                    {candidature.applicationMethod === "Portail intranet (si offre interne)" && <IntranetIcon />}
                    {candidature.applicationMethod === "Keljob" && <KeljobIcon />}
                    {candidature.applicationMethod === "La bonne boîte (Pôle Emploi)" && <LaBonneBoiteIcon />}
                    {candidature.applicationMethod === "Le Bon Coin (Emploi)" && <LeBonCoinIcon />}
                    {candidature.applicationMethod === "L'Étudiant" && <LEtudiantIcon />}
                    {candidature.applicationMethod === "LinkedIn" && <LinkedInIcon />}
                    {candidature.applicationMethod === "Agence d'intérim" && <InterimIcon />}
                    {candidature.applicationMethod === "AngelList / Wellfound (startups)" && <WellfoundIcon />}
                    {candidature.applicationMethod === "APEC" && <ApecIcon />}
                    {candidature.applicationMethod === "Autre" && <AutreIcon />}
                    {candidature.applicationMethod === "Cabinet de recrutement" && <CabinetRecrutementIcon />}
                    {candidature.applicationMethod === "Cadremploi" && <CadreemploiIcon />}
                    {candidature.applicationMethod === "Candidature spontanée par email" && <EmailIcon />}
                    {candidature.applicationMethod === "ChooseMyCompany" && <ChooseMyCompanyIcon />}
                    {candidature.applicationMethod === "Facebook Jobs" && <FacebookIcon />}
                    {candidature.applicationMethod === "France travail" && <FranceTravailIcon />}
                  </div>
                  <span className="text-gray-900">{candidature.applicationMethod}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Secteur d'activité</h3>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-6 h-6">
                    {candidature.businessSector === "Agriculture / Agroalimentaire" && <AgroalimentaireIcon />}
                    {candidature.businessSector === "Art / Culture / Patrimoine" && <CultureIcon />}
                    {candidature.businessSector === "Autres secteurs / Divers" && <AutreIcon />}
                    {candidature.businessSector === "Banque / Assurance / Finance" && <FinanceIcon />}
                    {candidature.businessSector === "Bâtiment / Travaux publics" && <BtpIcon />}
                    {candidature.businessSector === "Administration / Fonction publique" && <AdminIcon />}
                    {candidature.businessSector === "Commerce / Distribution" && <DistributionIcon />}
                    {candidature.businessSector === "Communication / Marketing / Publicité" && <PubIcon />}
                    {candidature.businessSector === "Comptabilité / Gestion / Audit" && <AuditIcon />}
                    {candidature.businessSector === "Conseil / Stratégie" && <StrategieIcon />}
                    {candidature.businessSector === "Droit / Justice / Juridique" && <JuridiqueIcon />}
                    {candidature.businessSector === "Éducation / Formation" && <FormationIcon />}
                    {candidature.businessSector === "Énergie / Environnement" && <EnvironnementIcon />}
                    {candidature.businessSector === "Hôtellerie / Restauration / Tourisme" && <RestaurationIcon />}
                    {candidature.businessSector === "Immobilier" && <ImmobilierIcon />}
                    {candidature.businessSector === "Industrie / Production / Maintenance" && <MaintenanceIcon />}
                    {candidature.businessSector === "Informatique / Télécoms" && <TelecomIcon />}
                    {candidature.businessSector === "Logistique / Transport / Supply Chain" && <SupplyChainIcon />}
                    {candidature.businessSector === "Luxe / Mode / Beauté" && <ModeIcon />}
                    {candidature.businessSector === "Médias / Journalisme / Édition" && <EditionIcon />}
                    {candidature.businessSector === "Métiers de l'artisanat" && <ArtisanatIcon />}
                    {candidature.businessSector === "Recherche / Sciences" && <RechercheIcon />}
                    {candidature.businessSector === "Ressources humaines / Recrutement" && <RHIcon />}
                    {candidature.businessSector === "Santé / Social / Médico-social" && <MedicoSocialIcon />}
                    {candidature.businessSector === "Sécurité / Défense / Armée" && <ArmeIcon />}
                    {candidature.businessSector === "Services à la personne / Aide à domicile" && <AideADomicileIcon />}
                    {candidature.businessSector === "Sport / Animation / Loisirs" && <LoisirIcon />}
                    {candidature.businessSector === "Startups / Innovation / Tech" && <TechIcon />}
                  </div>
                  <span className="text-gray-900">{candidature.businessSector}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Entretiens</h2>
      {entretiens.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {entretiens.map(entretien => (
            <div
              key={entretien.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/entretiens/${entretien.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      px-2 py-1 rounded-lg text-xs font-medium mb-4
                      ${entretien.status === 'en attente' ? 'bg-[#f2bd64] text-black' : ''}
                      ${entretien.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                      ${entretien.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                      ${entretien.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                      ${entretien.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                    `}
                  >
                    {entretien.status === 'en attente' && 'En attente'}
                    {entretien.status === 'refusé' && 'Refusé'}
                    {entretien.status === 'Procédure de recrutement 1' && 'Procédure de recrutement 1'}
                    {entretien.status === 'Procédure de recrutement 2' && 'Procédure de recrutement 2'}
                    {entretien.status === 'validé' && 'Validé'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <div className="w-5 h-5 mr-2"><BriefcaseIcon /></div>
                    <span>{new Date(entretien.date).toLocaleDateString()} à {entretien.time}</span>
                  </div>

                  {entretien.type === 'presentiel' && entretien.location && (
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2"><LocationIcon /></div>
                      <span>{entretien.location}</span>
                    </div>
                  )}

                  {entretien.type === 'visio' && entretien.meetingLink && (
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2">
                        <VisioIcon />
                      </div>
                      <a
                        href={entretien.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4e8d60] hover:underline"
                      >
                        Lien de la visioconférence
                      </a>
                    </div>
                  )}

                  {entretien.type === 'telephone' && (
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2">
                        <PhoneIcon />
                      </div>
                      <span>Entretien téléphonique</span>
                    </div>
                  )}

                  {(entretien.contactName || entretien.contactRole) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {entretien.contactName && (
                        <p className="text-sm text-gray-600">Contact : {entretien.contactName}</p>
                      )}
                      {entretien.contactRole && (
                        <p className="text-sm text-gray-500">{entretien.contactRole}</p>
                      )}
                    </div>
                  )}

                  {entretien.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 whitespace-pre-line">{entretien.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">pas d'entretiens lié</p>
      )}
    </div>

    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Procédures</h2>
      {procedures.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {procedures.map(procedure => (
            <div
              key={procedure.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/procedures/${procedure.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      px-2 py-1 rounded-lg text-xs font-medium mb-4
                      ${procedure.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                      ${procedure.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                      ${procedure.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                      ${procedure.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                      ${procedure.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                    `}
                  >
                    {procedure.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <div className="w-5 h-5 mr-2"><BriefcaseIcon /></div>
                    <span>{new Date(procedure.date).toLocaleDateString()} à {procedure.time}</span>
                  </div>

                  {procedure.type === 'presentiel' && procedure.location && (
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2"><LocationIcon /></div>
                      <span>{procedure.location}</span>
                    </div>
                  )}

                  {procedure.type === 'visio' && procedure.meetingLink && (
                    <div className="flex items-center text-gray-600">
                      <Video className="w-5 h-5 mr-2" />
                      <a
                        href={procedure.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4e8d60] hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        Lien de la visioconférence
                      </a>
                    </div>
                  )}

                  {procedure.type === 'telephone' && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>Entretien téléphonique</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Type d'évaluation</h4>
                    <ul className="space-y-1">
                      {procedure.testTechnique && <li className="text-sm text-gray-600">• Test technique</li>}
                      {procedure.testPersonnalite && <li className="text-sm text-gray-600">• Test de personnalité</li>}
                      {procedure.miseEnSituation && <li className="text-sm text-gray-600">• Mise en situation</li>}
                    </ul>
                  </div>

                  {(procedure.contactName || procedure.contactRole) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {procedure.contactName && (
                        <p className="text-sm text-gray-600">Contact : {procedure.contactName}</p>
                      )}
                      {procedure.contactRole && (
                        <p className="text-sm text-gray-500">{procedure.contactRole}</p>
                      )}
                    </div>
                  )}

                  {procedure.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 whitespace-pre-line">{procedure.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">pas de procédure de recrutement lié</p>
      )}
    </div>

    <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique de la candidature</h2>
      {history.length > 0 ? (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {history.map(entry => {
            const date = new Date(entry.created_at);
            const parisDate = new Intl.DateTimeFormat('fr-FR', {
              timeZone: 'Europe/Paris',
              dateStyle: 'long',
              timeStyle: 'short'
            }).format(date);
            return (
              <div key={entry.id} className="p-6 flex items-start space-x-4">
                <div className="flex-shrink-0"><History className="w-6 h-6 text-gray-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div
                      className={`
                        px-2 py-1 rounded-lg text-xs font-medium
                        ${entry.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                        ${entry.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                        ${entry.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                        ${entry.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                        ${entry.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                        ${entry.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                      `}
                    >
                      {entry.status}
                    </div>
                    <span className="text-sm text-gray-500">{parisDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">pas d'historique</p>
      )}
    </div>

    <Footer />
  </div>
);
}