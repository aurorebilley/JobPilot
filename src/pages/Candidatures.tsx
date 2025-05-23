import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MinimalistLogo from '../components/MinimalistLogo';
import CompanyIcon from '../components/CompanyIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import InfoIcon from '../components/InfoIcon';
import EmailIcon from '../components/EmailIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface Candidature {
  id: string;
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  jobUrl: string;
  status: string;
  applicationDate: string;
  description: string;
  businessSector: string;
  applicationMethod: string;
  entretienId?: string;
}

export default function Candidatures() {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleStatusChange = async (candidatureId: string, newStatus: string) => {
    try {
      const candidatureRef = doc(db, 'candidatures', candidatureId);
      const candidature = candidatures.find(c => c.id === candidatureId);
      const now = new Date();

      const proceduresQuery = query(
        collection(db, 'procedures'),
        where('candidatureId', '==', candidatureId)
      );
      const proceduresSnapshot = await getDocs(proceduresQuery);
      const statusesToTrack = ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'];

      if (statusesToTrack.includes(newStatus)) {
        await Promise.all(proceduresSnapshot.docs.map(async (procedureDoc) => {
          await updateDoc(procedureDoc.ref, { status: newStatus, updatedAt: now });
          if (auth.currentUser) {
            const { error: procedureHistoryError } = await supabase
              .from('procedure_history')
              .insert({
                user_id: auth.currentUser.uid,
                candidature_id: candidatureId,
                procedure_id: procedureDoc.id,
                type: procedureDoc.data().procedureType,
                status: newStatus,
                created_at: now.toISOString()
              });
            if (procedureHistoryError) console.error('Error saving to procedure_history:', procedureHistoryError);
          }
        }));
      }

      await updateDoc(candidatureRef, { status: newStatus, updatedAt: now });

      if (candidature?.entretienId && newStatus !== 'postulé') {
        await supabase.from('interview_history').insert({
          user_id: auth.currentUser?.uid,
          candidature_id: candidatureId,
          interview_id: candidature.entretienId,
          status: newStatus,
          created_at: now.toISOString()
        });
        const entretienRef = doc(db, 'entretiens', candidature.entretienId);
        await updateDoc(entretienRef, { status: newStatus, updatedAt: now });
      }

      if (auth.currentUser) {
        const { error: candidatureHistoryError } = await supabase
          .from('candidature_history')
          .insert({
            user_id: auth.currentUser.uid,
            candidature_id: candidatureId,
            status: newStatus,
            created_at: now.toISOString()
          });
        if (candidatureHistoryError) console.error('Error saving to candidature_history:', candidatureHistoryError);
      }

      if (newStatus === 'entretien' && candidature) {
        navigate('/candidatures/entretien/new', {
          state: { candidatureId, companyName: candidature.companyName, jobTitle: candidature.jobTitle }
        });
        return;
      } else if ((newStatus === 'Procédure de recrutement 1' || newStatus === 'Procédure de recrutement 2') && candidature) {
        navigate('/candidatures/procedure/new', {
          state: {
            candidatureId,
            companyName: candidature.companyName,
            jobTitle: candidature.jobTitle,
            procedureType: newStatus
          }
        });
        return;
      }

      setCandidatures(prev =>
        prev.map(c => c.id === candidatureId ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

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
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Candidature, 'id'>) }));
        setCandidatures(data);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="w-10 h-10 flex items-center justify-center">
              <MinimalistLogo />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Candidatures</h1>
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/candidatures/new'}
            className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Nouvelle candidature</span>
            <span className="sm:hidden">+</span>
          </button>
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
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Chargement des candidatures...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : candidatures.length === 0 ? (
            <div className="h-96 border-4 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Aucune candidature pour {months[selectedMonth].toLowerCase()} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatures.map(candidature => {
                const date = new Date(candidature.applicationDate);
                const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                return (
                  <div
                    key={candidature.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between">
                          <select
                            value={candidature.status}
                            onChange={e => { e.stopPropagation(); handleStatusChange(candidature.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            className={`
                              w-32 px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer appearance-none mb-4
                              ${candidature.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                              ${candidature.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                              ${candidature.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                              ${candidature.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                              ${candidature.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                              ${candidature.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                              focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                              bg-no-repeat bg-[length:16px] bg-[center_right_4px]
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

                        <h3
                          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer"
                          onClick={() => navigate(`/candidatures/${candidature.id}`)}
                        >
                          {candidature.jobTitle}
                        </h3>
                        <div
                          className="flex items-center gap-2 text-gray-600 mb-2 cursor-pointer"
                          onClick={() => navigate(`/candidatures/${candidature.id}`)}
                        >
                          <div className="w-5 h-5"><CompanyIcon /></div>
                          <span className="text-black">{candidature.companyName}</span>
                        </div>

                        {/* Icônes méthode d'application */}
                        {candidature.applicationMethod === "Glassdoor" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><GlassdoorIcon /></div>
                            <span>Glassdoor</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Indeed" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><IndeedIcon /></div>
                            <span>Indeed</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "HelloWork" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><HelloWorkIcon /></div>
                            <span>HelloWork</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Welcome to the Jungle" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5 [&_path]:!fill-[inherit] [&_circle]:!fill-[inherit]"><WelcomeToTheJungleIcon /></div>
                            <span>WTTJ</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Jobijoba" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><JobijobaIcon /></div>
                            <span>Jobijoba</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Jobteaser" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><JobteaserIcon /></div>
                            <span>Jobteaser</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Meteojob" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><MeteojobIcon /></div>
                            <span>Meteojob</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Monster" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><MonsterIcon /></div>
                            <span>Monster</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "QAPA" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><QapaIcon /></div>
                            <span>QAPA</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Recommandation / Réseau" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><ReseauxIcon /></div>
                            <span>Réseau</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Remotive (remote jobs)" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><RemotiveIcon /></div>
                            <span>Remotive</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Salon de l'emploi / Job Dating" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><JobDatingIcon /></div>
                            <span>Job Dating</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Site de l'entreprise directement" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><SiteEntrepriseIcon /></div>
                            <span>Site entreprise</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "StudentJob" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><StudentJobIcon /></div>
                            <span>StudentJob</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Talent.com" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><TalentIcon /></div>
                            <span>Talent.com</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "ProfilCulture" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><ProfilCultureIcon /></div>
                            <span>ProfilCulture</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Portail intranet (si offre interne)" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><IntranetIcon /></div>
                            <span>Portail intranet</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Keljob" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><KeljobIcon /></div>
                            <span>Keljob</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "La bonne boîte (Pôle Emploi)" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><LaBonneBoiteIcon /></div>
                            <span>La bonne boîte</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Le Bon Coin (Emploi)" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><LeBonCoinIcon /></div>
                            <span>Le Bon Coin</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "L'Étudiant" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><LEtudiantIcon /></div>
                            <span>L'Étudiant</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "LinkedIn" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><LinkedInIcon /></div>
                            <span>LinkedIn</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Agence d'intérim" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><InterimIcon /></div>
                            <span>Agence d'intérim</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "AngelList / Wellfound (startups)" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><WellfoundIcon /></div>
                            <span>Wellfound</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "APEC" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><ApecIcon /></div>
                            <span>APEC</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Autre" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><AutreIcon /></div>
                            <span>Divers</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Cabinet de recrutement" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><CabinetRecrutementIcon /></div>
                            <span>Cabinet de recrutement</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Cadremploi" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><CadreemploiIcon /></div>
                            <span>Cadremploi</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Candidature spontanée par email" && (
  <div className="flex items-center gap-2 text-gray-600 mb-2">
    <div className="w-5 h-5">
      <EmailIcon />
    </div>
    <span>Candidature spontanée par email</span>
  </div>
)}
                        {candidature.applicationMethod === "ChooseMyCompany" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><ChooseMyCompanyIcon /></div>
                            <span>ChooseMyCompany</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "Facebook Jobs" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><FacebookIcon /></div>
                            <span>Facebook</span>
                          </div>
                        )}
                        {candidature.applicationMethod === "France travail" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-5 h-5"><FranceTravailIcon /></div>
                            <span>France travail</span>
                          </div>
                        )}

                        {/* Icônes secteur d’activité */}
                        {candidature.businessSector === "Agriculture / Agroalimentaire" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><AgroalimentaireIcon /></div>
                            <span>Agroalimentaire</span>
                          </div>
                        )}
                        {candidature.businessSector === "Art / Culture / Patrimoine" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><CultureIcon /></div>
                            <span>Culture</span>
                          </div>
                        )}
                        {candidature.businessSector === "Autres secteurs / Divers" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><AutreIcon /></div>
                            <span>Divers</span>
                          </div>
                        )}
                        {candidature.businessSector === "Banque / Assurance / Finance" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><FinanceIcon /></div>
                            <span>Banque</span>
                          </div>
                        )}
                        {candidature.businessSector === "Bâtiment / Travaux publics" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><BtpIcon /></div>
                            <span>BTP</span>
                          </div>
                        )}
                        {candidature.businessSector === "Administration / Fonction publique" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><AdminIcon /></div>
                            <span>Administration</span>
                          </div>
                        )}
                        {candidature.businessSector === "Commerce / Distribution" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><DistributionIcon /></div>
                            <span>Commerce</span>
                          </div>
                        )}
                        {candidature.businessSector === "Communication / Marketing / Publicité" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><PubIcon /></div>
                            <span>Communication</span>
                          </div>
                        )}
                        {candidature.businessSector === "Comptabilité / Gestion / Audit" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><AuditIcon /></div>
                            <span>Comptabilité</span>
                          </div>
                        )}
                        {candidature.businessSector === "Conseil / Stratégie" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><StrategieIcon /></div>
                            <span>Conseil</span>
                          </div>
                        )}
                        {candidature.businessSector === "Droit / Justice / Juridique" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><JuridiqueIcon /></div>
                            <span>Droit</span>
                          </div>
                        )}
                        {candidature.businessSector === "Éducation / Formation" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><FormationIcon /></div>
                            <span>Formation</span>
                          </div>
                        )}
                        {candidature.businessSector === "Énergie / Environnement" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><EnvironnementIcon /></div>
                            <span>Énergie</span>
                          </div>
                        )}
                        {candidature.businessSector === "Hôtellerie / Restauration / Tourisme" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><RestaurationIcon /></div>
                            <span>Restauration</span>
                          </div>
                        )}
                        {candidature.businessSector === "Immobilier" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><ImmobilierIcon /></div>
                            <span>Immobilier</span>
                          </div>
                        )}
                        {candidature.businessSector === "Industrie / Production / Maintenance" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><MaintenanceIcon /></div>
                            <span>Maintenance</span>
                          </div>
                        )}
                        {candidature.businessSector === "Informatique / Télécoms" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><TelecomIcon /></div>
                            <span>Télécoms</span>
                          </div>
                        )}
                        {candidature.businessSector === "Logistique / Transport / Supply Chain" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><SupplyChainIcon /></div>
                            <span>Transport</span>
                          </div>
                        )}
                        {candidature.businessSector === "Luxe / Mode / Beauté" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><ModeIcon /></div>
                            <span>Mode</span>
                          </div>
                        )}
                        {candidature.businessSector === "Médias / Journalisme / Édition" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><EditionIcon /></div>
                            <span>Médias</span>
                          </div>
                        )}
                        {candidature.businessSector === "Métiers de l'artisanat" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><ArtisanatIcon /></div>
                            <span>Artisanat</span>
                          </div>
                        )}
                        {candidature.businessSector === "Recherche / Sciences" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><RechercheIcon /></div>
                            <span>Recherche</span>
                          </div>
                        )}
                        {candidature.businessSector === "Ressources humaines / Recrutement" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><RHIcon /></div>
                            <span>RH</span>
                          </div>
                        )}
                        {candidature.businessSector === "Santé / Social / Médico-social" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><MedicoSocialIcon /></div>
                            <span>Médico-social</span>
                          </div>
                        )}
                        {candidature.businessSector === "Sécurité / Défense / Armée" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><ArmeIcon /></div>
                            <span>Sécurité</span>
                          </div>
                        )}
                        {candidature.businessSector === "Services à la personne / Aide à domicile" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><AideADomicileIcon /></div>
                            <span>Aide à domicile</span>
                          </div>
                        )}
                        {candidature.businessSector === "Sport / Animation / Loisirs" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><LoisirIcon /></div>
                            <span>Loisirs</span>
                          </div>
                        )}
                        {candidature.businessSector === "Startups / Innovation / Tech" && (
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <div className="w-6 h-6"><TechIcon /></div>
                            <span>Tech</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mt-4">
                        <div className="w-5 h-5"><BriefcaseIcon /></div>
                        <span className="text-sm">{formattedDate}</span>
                      </div>

                      <div
                        className="mt-4 pt-4 border-t border-gray-100 flex justify-start"
                        onClick={e => { e.stopPropagation(); navigate(`/candidatures/${candidature.id}`); }}
                      >
                        <div className="w-6 h-6 cursor-pointer"><InfoIcon /></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
