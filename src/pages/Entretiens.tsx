import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoIcon from '../components/InfoIcon';
import EntretiensIcon from '../components/EntretiensIcon';
import LocationIcon from '../components/LocationIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import CompanyIcon from '../components/CompanyIcon';

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
import KeljobIcon from '../components/canal/KeljobIcon';
import LaBonneBoiteIcon from '../components/canal/LaBonneBoiteIcon';
import LeBonCoinIcon from '../components/canal/LeBonCoinIcon';
import LEtudiantIcon from '../components/canal/LEtudiantIcon';
import LinkedInIcon from '../components/canal/LinkedInIcon';
import ApecIcon from '../components/canal/ApecIcon';
import WellfoundIcon from '../components/canal/WellfoundIcon';
import CabinetRecrutementIcon from '../components/canal/CabinetRecrutementIcon';
import CadreemploiIcon from '../components/canal/CadreemploiIcon';
import ChooseMyCompanyIcon from '../components/canal/ChooseMyCompanyIcon';
import FacebookIcon from '../components/canal/FacebookIcon';
import FranceTravailIcon from '../components/canal/FranceTravailIcon';

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

import {
  MapPin,
  Video,
  Phone,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface Entretien {
  id: string;
  jobTitle: string;
  companyName: string;
  candidatureId: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  meetingLink?: string;
  contactName?: string;
  contactRole?: string;
  notes?: string;
  status: string;
  applicationMethod?: string;
  businessSector?: string;
}

export default function Entretiens() {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  useEffect(() => {
    const fetchEntretiens = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const startOfMonth = new Date(selectedYear, selectedMonth, 1).toISOString();
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0).toISOString();
        const q = query(
          collection(db, 'entretiens'),
          where('userId', '==', auth.currentUser.uid),
          where('date', '>=', startOfMonth),
          where('date', '<=', endOfMonth),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = await Promise.all(snapshot.docs.map(async docSnap => {
          const ent = { id: docSnap.id, ...(docSnap.data() as Omit<Entretien, 'id'>) };
          if (ent.candidatureId) {
            const cQuery = query(
              collection(db, 'candidatures'),
              where('userId', '==', auth.currentUser.uid),
              where('__name__', '==', ent.candidatureId)
            );
            const cSnap = await getDocs(cQuery);
            if (!cSnap.empty) {
              const c = cSnap.docs[0].data();
              ent.applicationMethod = c.applicationMethod;
              ent.businessSector = c.businessSector;
            }
          }
          return ent;
        }));
        setEntretiens(data as Entretien[]);
      } catch (err) {
        console.error('Error fetching entretiens:', err);
        setError('Une erreur est survenue lors du chargement des entretiens');
      } finally {
        setLoading(false);
      }
    };
    fetchEntretiens();
  }, [selectedMonth, selectedYear, navigate]);

  const handleStatusChange = async (entretienId: string, newStatus: string) => {
    try {
      const entretienRef = doc(db, 'entretiens', entretienId);
      const now = new Date();
      const ent = entretiens.find(e => e.id === entretienId);
      if (newStatus === 'Procédure de recrutement 1' || newStatus === 'Procédure de recrutement 2') {
        navigate('/candidatures/procedure/new', {
          state: {
            candidatureId: ent?.candidatureId ?? '',
            companyName: ent?.companyName ?? '',
            jobTitle: ent?.jobTitle ?? '',
            procedureType: newStatus
          }
        });
        return;
      }
      await updateDoc(entretienRef, { status: newStatus, updatedAt: now });

      if (ent?.candidatureId) {
        const statusesToTrack = ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'];
        if (statusesToTrack.includes(newStatus) && newStatus !== 'en attente') {
          const pQuery = query(
            collection(db, 'procedures'),
            where('candidatureId', '==', ent.candidatureId)
          );
          const pSnap = await getDocs(pQuery);
          await Promise.all(pSnap.docs.map(async pDoc => {
            await updateDoc(pDoc.ref, { status: newStatus, updatedAt: now });
            if (auth.currentUser) {
              await supabase.from('procedure_history').insert({
                user_id: auth.currentUser.uid,
                candidature_id: ent.candidatureId,
                procedure_id: pDoc.id,
                type: pDoc.data().procedureType,
                status: newStatus,
                created_at: now.toISOString()
              });
            }
          }));
        }
        const candRef = doc(db, 'candidatures', ent.candidatureId);
        await updateDoc(candRef, { status: newStatus, updatedAt: now });
        if (auth.currentUser) {
          await supabase.from('candidature_history').insert({
            user_id: auth.currentUser.uid,
            candidature_id: ent.candidatureId,
            status: newStatus,
            created_at: now.toISOString()
          });
        }
      }

      if (auth.currentUser) {
        await supabase.from('interview_history').insert({
          user_id: auth.currentUser.uid,
          candidature_id: ent?.candidatureId ?? '',
          interview_id: entretienId,
          status: newStatus,
          created_at: now.toISOString()
        });
      }

      setEntretiens(es =>
        es.map(e => e.id === entretienId ? { ...e, status: newStatus } : e)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header & nouveau */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="w-10 h-10 flex items-center justify-center">
              <EntretiensIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Entretiens</h1>
          </div>
          <button
            onClick={() => navigate('/entretiens/select')}
            className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Nouvel entretien</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* Sélecteur mois */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button onClick={handlePreviousMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-lg font-medium text-gray-900">
              {months[selectedMonth]} {selectedYear}
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Chargement des entretiens...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : entretiens.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Aucun entretien programmé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entretiens.map(entretien => (
                <div key={entretien.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6 flex flex-col justify-between h-full">
                    {/* Statut */}
                    <div className="flex items-start justify-between">
                      <select
                        value={entretien.status}
                        onChange={e => handleStatusChange(entretien.id, e.target.value)}
                        className={`
                          w-32 px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer appearance-none mb-4
                          ${entretien.status === 'en attente' ? 'bg-[#f2bd64] text-black' : ''}
                          ${entretien.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                          ${entretien.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                          ${entretien.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                          ${entretien.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                          focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                          bg-no-repeat bg-[length:16px] bg-[center_right_4px]
                          bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
                        `}
                      >
                        <option value="en attente">En attente</option>
                        <option value="refusé">Refusé</option>
                        <option value="Procédure de recrutement 1">Procédure 1</option>
                        <option value="Procédure de recrutement 2">Procédure 2</option>
                        <option value="validé">Validé</option>
                      </select>
                    </div>

                    {/* Titre & entreprise */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{entretien.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <div className="w-5 h-5"><CompanyIcon /></div>
                        <span className="text-black">{entretien.companyName}</span>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <div className="w-5 h-5 mr-2"><BriefcaseIcon /></div>
                        <span>
                          {new Date(entretien.date).toLocaleDateString()} à {entretien.time}
                        </span>
                      </div>
                      {entretien.type === 'presentiel' && entretien.location && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-2"><LocationIcon /></div>
                          <span>{entretien.location}</span>
                        </div>
                      )}
                      {entretien.type === 'visio' && (
                        <div className="flex items-center text-gray-600">
                          <LinkIcon className="w-5 h-5 mr-2" />
                          {entretien.meetingLink ? (
                            <a href={entretien.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#4e8d60] hover:underline">
                              Lien visioconf.
                            </a>
                          ) : (
                            <span>Visioconférence</span>
                          )}
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

                    {/* Méthode & secteur */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                      {entretien.applicationMethod && (
                        <div className="w-5 h-5">
                          {entretien.applicationMethod === "Glassdoor" && <GlassdoorIcon />}
                          {entretien.applicationMethod === "Indeed" && <IndeedIcon />}
                          {entretien.applicationMethod === "HelloWork" && <HelloWorkIcon />}
                          {entretien.applicationMethod === "Welcome to the Jungle" && <WelcomeToTheJungleIcon />}
                          {entretien.applicationMethod === "Jobijoba" && <JobijobaIcon />}
                          {entretien.applicationMethod === "Jobteaser" && <JobteaserIcon />}
                          {entretien.applicationMethod === "Meteojob" && <MeteojobIcon />}
                          {entretien.applicationMethod === "Monster" && <MonsterIcon />}
                          {entretien.applicationMethod === "QAPA" && <QapaIcon />}
                          {entretien.applicationMethod === "Recommandation / Réseau" && <ReseauxIcon />}
                          {entretien.applicationMethod === "Remotive (remote jobs)" && <RemotiveIcon />}
                          {entretien.applicationMethod === "Salon de l'emploi / Job Dating" && <JobDatingIcon />}
                          {entretien.applicationMethod === "Site de l'entreprise directement" && <SiteEntrepriseIcon />}
                          {entretien.applicationMethod === "StudentJob" && <StudentJobIcon />}
                          {entretien.applicationMethod === "Talent.com" && <TalentIcon />}
                          {entretien.applicationMethod === "ProfilCulture" && <ProfilCultureIcon />}
                          {entretien.applicationMethod === "Portail intranet (si offre interne)" && <IntranetIcon />}
                          {entretien.applicationMethod === "Keljob" && <KeljobIcon />}
                          {entretien.applicationMethod === "La bonne boîte (Pôle Emploi)" && <LaBonneBoiteIcon />}
                          {entretien.applicationMethod === "Le Bon Coin (Emploi)" && <LeBonCoinIcon />}
                          {entretien.applicationMethod === "L'Étudiant" && <LEtudiantIcon />}
                          {entretien.applicationMethod === "LinkedIn" && <LinkedInIcon />}
                          {entretien.applicationMethod === "Agence d’intérim" && <InterimIcon />}
                          {entretien.applicationMethod === "AngelList / Wellfound (startups)" && <WellfoundIcon />}
                          {entretien.applicationMethod === "APEC" && <ApecIcon />}
                          {entretien.applicationMethod === "Autre" && <AutreIcon />}
                          {entretien.applicationMethod === "Cabinet de recrutement" && <CabinetRecrutementIcon />}
                          {entretien.applicationMethod === "Cadremploi" && <CadreemploiIcon />}
                          {entretien.applicationMethod === "ChooseMyCompany" && <ChooseMyCompanyIcon />}
                          {entretien.applicationMethod === "Facebook Jobs" && <FacebookIcon />}
                          {entretien.applicationMethod === "France travail" && <FranceTravailIcon />}
                        </div>
                      )}
                      {entretien.businessSector && (
                        <div className="w-6 h-6">
                          {entretien.businessSector === "Agriculture / Agroalimentaire" && <AgroalimentaireIcon />}
                          {entretien.businessSector === "Art / Culture / Patrimoine" && <CultureIcon />}
                          {entretien.businessSector === "Autres secteurs / Divers" && <AutreIcon />}
                          {entretien.businessSector === "Banque / Assurance / Finance" && <FinanceIcon />}
                          {entretien.businessSector === "Bâtiment / Travaux publics" && <BtpIcon />}
                          {entretien.businessSector === "Administration / Fonction publique" && <AdminIcon />}
                          {entretien.businessSector === "Commerce / Distribution" && <DistributionIcon />}
                          {entretien.businessSector === "Communication / Marketing / Publicité" && <PubIcon />}
                          {entretien.businessSector === "Comptabilité / Gestion / Audit" && <AuditIcon />}
                          {entretien.businessSector === "Conseil / Stratégie" && <StrategieIcon />}
                          {entretien.businessSector === "Droit / Justice / Juridique" && <JuridiqueIcon />}
                          {entretien.businessSector === "Éducation / Formation" && <FormationIcon />}
                          {entretien.businessSector === "Énergie / Environnement" && <EnvironnementIcon />}
                          {entretien.businessSector === "Hôtellerie / Restauration / Tourisme" && <RestaurationIcon />}
                          {entretien.businessSector === "Immobilier" && <ImmobilierIcon />}
                          {entretien.businessSector === "Industrie / Production / Maintenance" && <MaintenanceIcon />}
                          {entretien.businessSector === "Informatique / Télécoms" && <TelecomIcon />}
                          {entretien.businessSector === "Logistique / Transport / Supply Chain" && <SupplyChainIcon />}
                          {entretien.businessSector === "Sport / Animation / Loisirs" && <LoisirIcon />}
                          {entretien.businessSector === "Startups / Innovation / Tech" && <TechIcon />}
                          {entretien.businessSector === "Services à la personne / Aide à domicile" && <AideADomicileIcon />}
                          {entretien.businessSector === "Sécurité / Défense / Armée" && <ArmeIcon />}
                          {entretien.businessSector === "Métiers de l'artisanat" && <ArtisanatIcon />}
                          {entretien.businessSector === "Luxe / Mode / Beauté" && <ModeIcon />}
                          {entretien.businessSector === "Médias / Journalisme / Édition" && <EditionIcon />}
                        </div>
                      )}
                    </div>

                    {/* Détails */}
                    <div
                      className="mt-4 pt-4 border-t border-gray-100 flex justify-start"
                      onClick={() => navigate(`/entretiens/${entretien.id}`)}
                    >
                      <div className="w-6 h-6 cursor-pointer"><InfoIcon /></div>
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
