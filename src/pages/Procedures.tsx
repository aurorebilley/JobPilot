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
import BriefcaseIcon from '../components/BriefcaseIcon';
import LocationIcon from '../components/LocationIcon';
import CompanyIcon from '../components/CompanyIcon';
import ProcedureIcon from '../components/ProcedureIcon';

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
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react';

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface Procedure {
  id: string;
  candidatureId: string;
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
  status?: string;
  applicationMethod?: string;
  businessSector?: string;
}

export default function Procedures() {
  const navigate = useNavigate();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [procedures, setProcedures] = useState<Procedure[]>([]);
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
    const fetchProcedures = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, 'procedures'),
          where('userId', '==', auth.currentUser.uid),
          where('date', '>=', startOfMonth.toISOString()),
          where('date', '<=', endOfMonth.toISOString()),
          orderBy('date', 'desc')
        );
        const snap = await getDocs(q);
        const data = await Promise.all(snap.docs.map(async docSnap => {
          const proc = { id: docSnap.id, ...(docSnap.data() as Omit<Procedure, 'id'>) };
          if (proc.candidatureId) {
            const cQ = query(
              collection(db, 'candidatures'),
              where('userId', '==', auth.currentUser.uid),
              where('__name__', '==', proc.candidatureId)
            );
            const cSnap = await getDocs(cQ);
            if (!cSnap.empty) {
              const c = cSnap.docs[0].data();
              proc.applicationMethod = c.applicationMethod;
              proc.businessSector = c.businessSector;
            }
          }
          return proc;
        }));
        setProcedures(data);
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue lors du chargement des procédures');
      } finally {
        setLoading(false);
      }
    };
    fetchProcedures();
  }, [selectedMonth, selectedYear, navigate]);

  const handleStatusChange = async (procedureId: string, newStatus: string) => {
    try {
      const procRef = doc(db, 'procedures', procedureId);
      const proc = procedures.find(p => p.id === procedureId);
      if (!proc) return;
      const now = new Date();

      if (newStatus === 'entretien') {
        navigate('/candidatures/entretien/new', {
          state: {
            candidatureId: proc.candidatureId,
            companyName: proc.companyName,
            jobTitle: proc.jobTitle
          }
        });
        return;
      }

      await updateDoc(procRef, { status: newStatus, updatedAt: now });

      // Met à jour les entretiens si nécessaire
      const toTrack = ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'];
      if (toTrack.includes(newStatus)) {
        const iQ = query(
          collection(db, 'entretiens'),
          where('candidatureId', '==', proc.candidatureId)
        );
        const iSnap = await getDocs(iQ);
        await Promise.all(iSnap.docs.map(async d => {
          await updateDoc(d.ref, { status: newStatus, updatedAt: now });
          if (auth.currentUser) {
            await supabase.from('interview_history').insert({
              user_id: auth.currentUser.uid,
              candidature_id: proc.candidatureId,
              interview_id: d.id,
              status: newStatus,
              created_at: now.toISOString()
            });
          }
        }));
      }

      // Met à jour la candidature
      if (proc.candidatureId && ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'].includes(newStatus)) {
        const cRef = doc(db, 'candidatures', proc.candidatureId);
        await updateDoc(cRef, { status: newStatus, updatedAt: now });
        if (auth.currentUser) {
          await supabase.from('candidature_history').insert({
            user_id: auth.currentUser.uid,
            candidature_id: proc.candidatureId,
            status: newStatus,
            created_at: now.toISOString()
          });
        }
      }

      // Enregistre l'historique procédure
      if (auth.currentUser) {
        await supabase.from('procedure_history').insert({
          user_id: auth.currentUser.uid,
          candidature_id: proc.candidatureId,
          procedure_id: procedureId,
          type: proc.procedureType,
          status: newStatus,
          created_at: now.toISOString()
        });
      }

      setProcedures(ps =>
        ps.map(p => p.id === procedureId ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="w-10 h-10 flex items-center justify-center">
              <ProcedureIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Procédures de recrutement</h1>
          </div>
          <button
            onClick={() => navigate('/procedures/select')}
            className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Nouvelle procédure</span>
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
              <p className="text-gray-500">Chargement des procédures...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : procedures.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Aucune procédure programmée pour {months[selectedMonth].toLowerCase()} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {procedures.map(proc => (
                <div key={proc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6 flex flex-col justify-between h-full">
                    {/* Statut et titre */}
                    <div className="flex items-start justify-between">
                      <select
                        value={proc.status || 'en attente'}
                        onChange={e => handleStatusChange(proc.id, e.target.value)}
                        className={`
                          w-32 px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer appearance-none mb-4
                          ${proc.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                          ${proc.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                          ${proc.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                          ${proc.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                          ${proc.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                          focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                          bg-no-repeat bg-[length:16px] bg-[center_right_4px]
                          bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
                        `}
                      >
                        <option value="Procédure de recrutement 1">Procédure 1</option>
                        <option value="Procédure de recrutement 2">Procédure 2</option>
                        <option value="entretien">Entretien</option>
                        <option value="validé">Validé</option>
                        <option value="refusé">Refusé</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{proc.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <div className="w-5 h-5"><CompanyIcon /></div>
                        <span className="text-black">{proc.companyName}</span>
                      </div>
                    </div>

                    {/* Détails date / lieu */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <div className="w-5 h-5 mr-2"><BriefcaseIcon /></div>
                        <span>{new Date(proc.date).toLocaleDateString()} à {proc.time}</span>
                      </div>
                      {proc.type === 'presentiel' && proc.location && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-2"><LocationIcon /></div>
                          <span>{proc.location}</span>
                        </div>
                      )}
                      {proc.type === 'visio' && proc.meetingLink && (
                        <div className="flex items-center text-gray-600">
                          <LinkIcon className="w-5 h-5 mr-2" />
                          <a href={proc.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#4e8d60] hover:underline">
                            Lien visioconf.
                          </a>
                        </div>
                      )}

                      {/* Évaluations */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">Type d'évaluation</h4>
                        <ul className="space-y-1">
                          {proc.testTechnique && <li className="text-sm text-gray-600">• Test technique</li>}
                          {proc.testPersonnalite && <li className="text-sm text-gray-600">• Test de personnalité</li>}
                          {proc.miseEnSituation && <li className="text-sm text-gray-600">• Mise en situation</li>}
                        </ul>
                      </div>

                      {/* Contact & notes */}
                      {(proc.contactName || proc.contactRole) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {proc.contactName && <p className="text-sm text-gray-600">Contact : {proc.contactName}</p>}
                          {proc.contactRole && <p className="text-sm text-gray-500">{proc.contactRole}</p>}
                        </div>
                      )}
                      {proc.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 whitespace-pre-line">{proc.notes}</p>
                        </div>
                      )}

                      {/* Icônes méthode & secteur */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                        {proc.applicationMethod && (
                          <div className="w-5 h-5">
                            {proc.applicationMethod === "Glassdoor" && <GlassdoorIcon />}
                            {proc.applicationMethod === "Indeed" && <IndeedIcon />}
                            {proc.applicationMethod === "HelloWork" && <HelloWorkIcon />}
                            {proc.applicationMethod === "Welcome to the Jungle" && <WelcomeToTheJungleIcon />}
                            {proc.applicationMethod === "Jobijoba" && <JobijobaIcon />}
                            {proc.applicationMethod === "Jobteaser" && <JobteaserIcon />}
                            {proc.applicationMethod === "Meteojob" && <MeteojobIcon />}
                            {proc.applicationMethod === "Monster" && <MonsterIcon />}
                            {proc.applicationMethod === "QAPA" && <QapaIcon />}
                            {proc.applicationMethod === "Recommandation / Réseau" && <ReseauxIcon />}
                            {proc.applicationMethod === "Remotive (remote jobs)" && <RemotiveIcon />}
                            {proc.applicationMethod === "Salon de l'emploi / Job Dating" && <JobDatingIcon />}
                            {proc.applicationMethod === "Site de l'entreprise directement" && <SiteEntrepriseIcon />}
                            {proc.applicationMethod === "StudentJob" && <StudentJobIcon />}
                            {proc.applicationMethod === "Talent.com" && <TalentIcon />}
                            {proc.applicationMethod === "ProfilCulture" && <ProfilCultureIcon />}
                            {proc.applicationMethod === "Portail intranet (si offre interne)" && <IntranetIcon />}
                            {proc.applicationMethod === "Keljob" && <KeljobIcon />}
                            {proc.applicationMethod === "La bonne boîte (Pôle Emploi)" && <LaBonneBoiteIcon />}
                            {proc.applicationMethod === "Le Bon Coin (Emploi)" && <LeBonCoinIcon />}
                            {proc.applicationMethod === "L'Étudiant" && <LEtudiantIcon />}
                            {proc.applicationMethod === "LinkedIn" && <LinkedInIcon />}
                            {proc.applicationMethod === "Agence d’intérim" && <InterimIcon />}
                            {proc.applicationMethod === "APEC" && <ApecIcon />}
                            {proc.applicationMethod === "AngelList / Wellfound (startups)" && <WellfoundIcon />}
                            {proc.applicationMethod === "Cabinet de recrutement" && <CabinetRecrutementIcon />}
                            {proc.applicationMethod === "Cadremploi" && <CadreemploiIcon />}
                            {proc.applicationMethod === "ChooseMyCompany" && <ChooseMyCompanyIcon />}
                            {proc.applicationMethod === "Facebook Jobs" && <FacebookIcon />}
                            {proc.applicationMethod === "France travail" && <FranceTravailIcon />}
                          </div>
                        )}
                        {proc.businessSector && (
                          <div className="w-6 h-6">
                            {proc.businessSector === "Agriculture / Agroalimentaire" && <AgroalimentaireIcon />}
                            {proc.businessSector === "Art / Culture / Patrimoine" && <CultureIcon />}
                            {proc.businessSector === "Autres secteurs / Divers" && <AutreIcon />}
                            {proc.businessSector === "Banque / Assurance / Finance" && <FinanceIcon />}
                            {proc.businessSector === "Bâtiment / Travaux publics" && <BtpIcon />}
                            {proc.businessSector === "Administration / Fonction publique" && <AdminIcon />}
                            {proc.businessSector === "Commerce / Distribution" && <DistributionIcon />}
                            {proc.businessSector === "Communication / Marketing / Publicité" && <PubIcon />}
                            {proc.businessSector === "Comptabilité / Gestion / Audit" && <AuditIcon />}
                            {proc.businessSector === "Conseil / Stratégie" && <StrategieIcon />}
                            {proc.businessSector === "Droit / Justice / Juridique" && <JuridiqueIcon />}
                            {proc.businessSector === "Éducation / Formation" && <FormationIcon />}
                            {proc.businessSector === "Énergie / Environnement" && <EnvironnementIcon />}
                            {proc.businessSector === "Hôtellerie / Restauration / Tourisme" && <RestaurationIcon />}
                            {proc.businessSector === "Immobilier" && <ImmobilierIcon />}
                            {proc.businessSector === "Industrie / Production / Maintenance" && <MaintenanceIcon />}
                            {proc.businessSector === "Informatique / Télécoms" && <TelecomIcon />}
                            {proc.businessSector === "Logistique / Transport / Supply Chain" && <SupplyChainIcon />}
                            {proc.businessSector === "Sport / Animation / Loisirs" && <LoisirIcon />}
                            {proc.businessSector === "Startups / Innovation / Tech" && <TechIcon />}
                            {proc.businessSector === "Services à la personne / Aide à domicile" && <AideADomicileIcon />}
                            {proc.businessSector === "Sécurité / Défense / Armée" && <ArmeIcon />}
                            {proc.businessSector === "Métiers de l'artisanat" && <ArtisanatIcon />}
                            {proc.businessSector === "Luxe / Mode / Beauté" && <ModeIcon />}
                            {proc.businessSector === "Médias / Journalisme / Édition" && <EditionIcon />}
                          </div>
                        )}
                      </div>

                      {/* Détails */}
                      <div
                        className="mt-4 pt-4 border-t border-gray-100 flex justify-start"
                        onClick={() => navigate(`/procedures/${proc.id}`)}
                      >
                        <div className="w-6 h-6 cursor-pointer"><InfoIcon /></div>
                      </div>
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
