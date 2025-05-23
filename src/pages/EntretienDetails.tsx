import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, Video, Phone as PhoneIconLucide, History } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import CompanyIcon from '../components/CompanyIcon';
import LocationIcon from '../components/LocationIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import VisioIcon from '../components/VisioIcon';
import PhoneIcon from '../components/PhoneIcon';
import EmailIcon from '../components/EmailIcon';

// Canal de candidature icons
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

// Secteur d'activité icons
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
  candidatureId?: string;
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

export default function EntretienDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entretien, setEntretien] = useState<Entretien | null>(null);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [linkedCandidature, setLinkedCandidature] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState('');

  useEffect(() => {
    const fetchEntretien = async () => {
      if (!auth.currentUser || !id) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const entretienDoc = await getDoc(doc(db, 'entretiens', id));
        if (!entretienDoc.exists()) {
          setError('Entretien non trouvé');
          return;
        }
        const entretienData = { id: entretienDoc.id, ...entretienDoc.data() } as Entretien;
        setEntretien(entretienData);

        // Fetch linked candidature
        if (entretienData.candidatureId) {
          const candDoc = await getDoc(doc(db, 'candidatures', entretienData.candidatureId));
          if (candDoc.exists()) {
            setLinkedCandidature({ id: candDoc.id, ...candDoc.data() });
          }
          // Fetch linked procedures
          const procQuery = query(
            collection(db, 'procedures'),
            where('candidatureId', '==', entretienData.candidatureId)
          );
          const procSnap = await getDocs(procQuery);
          setProcedures(procSnap.docs.map(d => ({ id: d.id, ...d.data() } as Procedure)));
        }

        // Fetch interview history
        const { data: historyData, error: historyError } = await supabase
          .from('interview_history')
          .select('*')
          .eq('interview_id', id)
          .order('created_at', { ascending: false });
        if (historyError) {
          console.error('Error fetching history:', historyError);
        } else {
          setHistory(historyData || []);
        }
      } catch (err) {
        console.error('Error fetching entretien:', err);
        setError('Une erreur est survenue lors du chargement de l\'entretien');
      } finally {
        setLoading(false);
      }
    };
    fetchEntretien();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus: string) => {
    if (!entretien || !auth.currentUser) return;
    try {
      const entretienRef = doc(db, 'entretiens', entretien.id);
      const now = new Date();

      // Navigate to new procedure if needed
      if (newStatus === 'Procédure de recrutement 1' || newStatus === 'Procédure de recrutement 2') {
        navigate('/candidatures/procedure/new', {
          state: {
            candidatureId: entretien.candidatureId,
            companyName: entretien.companyName,
            jobTitle: entretien.jobTitle,
            procedureType: newStatus
          }
        });
        return;
      }

      // Update entretien status
      await updateDoc(entretienRef, { status: newStatus, updatedAt: now });

      // Update related candidature and procedures
      if (entretien.candidatureId) {
        // Update candidature status
        const candRef = doc(db, 'candidatures', entretien.candidatureId);
        await updateDoc(candRef, { status: newStatus, updatedAt: now });
        // Record in Supabase
        await supabase.from('candidature_history').insert({
          user_id: auth.currentUser.uid,
          candidature_id: entretien.candidatureId,
          status: newStatus,
          created_at: now.toISOString()
        });
        // Update procedures if relevant
        const statusesToTrack = ['refusé', 'Procédure de recrutement 1', 'Procédure de recrutement 2', 'validé'];
        if (statusesToTrack.includes(newStatus) && newStatus !== 'en attente') {
          const procQuery = query(
            collection(db, 'procedures'),
            where('candidatureId', '==', entretien.candidatureId)
          );
          const procSnap = await getDocs(procQuery);
          await Promise.all(procSnap.docs.map(async d => {
            await updateDoc(d.ref, { status: newStatus, updatedAt: now });
            await supabase.from('procedure_history').insert({
              user_id: auth.currentUser.uid,
              candidature_id: entretien.candidatureId!,
              procedure_id: d.id,
              type: d.data().procedureType,
              status: newStatus,
              created_at: now.toISOString()
            });
          }));
        }
      }

      // Record interview history
      await supabase.from('interview_history').insert({
        user_id: auth.currentUser.uid,
        candidature_id: entretien.candidatureId || '',
        interview_id: entretien.id,
        status: newStatus,
        created_at: now.toISOString()
      });

      setEntretien({ ...entretien, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleConfirmDelete = async () => {
    if (!entretien || !auth.currentUser || !id) return;
    try {
      setIsDeleting(true);
      
      // Remove entretienId from linked candidature
      if (entretien.candidatureId) {
        const candidatureRef = doc(db, 'candidatures', entretien.candidatureId);
        await updateDoc(candidatureRef, {
          entretienId: null
        });
      }
      
      setDeleteProgress('Suppression de l\'historique...');
      const { error: historyError } = await supabase
        .from('interview_history')
        .delete()
        .eq('interview_id', id);
      if (historyError) throw historyError;

      setDeleteProgress('Suppression de l\'entretien...');
      await deleteDoc(doc(db, 'entretiens', id));
      navigate('/entretiens');
    } catch (err) {
      console.error('Error deleting entretien:', err);
      setError('Une erreur est survenue lors de la suppression de l\'entretien');
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

  if (error || !entretien) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error || 'Entretien non trouvé'}</p>
        </main>
        <Footer />
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
      {/* Header & Back */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          onClick={() => navigate('/entretiens')}
          className="hover:opacity-80 transition-opacity"
          aria-label="Retour"
        >
          <BackButton />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Détails de l'entretien</h1>
      </div>

      {/* Wrapper entier en pleine largeur */}
      <div className="w-full">
        {/* Actions */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/entretiens/modif/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors duration-200"
            aria-label="Modifier l'entretien"
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
            aria-label="Supprimer l'entretien"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        </div>

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
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
                  Êtes-vous sûr de vouloir supprimer cet entretien ? Cette action est irréversible.
                </p>
              )}
              <div className="flex justify-end flex-wrap gap-3">
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

        {/* Carte Détails Entretien */}
        <div className="bg-white shadow rounded-lg p-6 w-full">
          <div className="mb-6">
            <select
              value={entretien.status}
              onChange={e => handleStatusChange(e.target.value)}
              className={`
                w-40 px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer appearance-none mb-4
                ${entretien.status === 'en attente' ? 'bg-[#f2bd64] text-black' : ''}
                ${entretien.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                ${entretien.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                ${entretien.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                ${entretien.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                focus:ring-1 focus:ring-[#4e8d60] focus:ring-offset-0
                bg-no-repeat bg-[length:16px] bg-[center_right_8px]
                bg-[url('data:image/svg+xml;base64,PHN2Zy...')]
              `}
            >
              <option value="en attente">En attente</option>
              <option value="refusé">Refusé</option>
              <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
              <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
              <option value="validé">Validé</option>
            </select>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{entretien.jobTitle}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5"><CompanyIcon /></div>
              <span>{entretien.companyName}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date et heure</h3>
              <div className="mt-1 flex items-center gap-2 text-gray-900">
                <div className="w-5 h-5"><BriefcaseIcon /></div>
                <span>{new Date(entretien.date).toLocaleDateString()} à {entretien.time}</span>
              </div>
            </div>

            {entretien.type === 'presentiel' && entretien.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Lieu</h3>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <div className="w-5 h-5"><LocationIcon /></div>
                  <span>{entretien.location}</span>
                </div>
              </div>
            )}

            {entretien.type === 'visio' && entretien.meetingLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Lien de la visioconférence</h3>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-5 h-5"><VisioIcon /></div>
                  <a href={entretien.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#4e8d60] hover:underline">
                    Rejoindre la réunion
                  </a>
                </div>
              </div>
            )}

            {entretien.type === 'telephone' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Type d'entretien</h3>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <div className="w-5 h-5"><PhoneIcon /></div>
                  <span>Entretien téléphonique</span>
                </div>
              </div>
            )}

            {(entretien.contactName || entretien.contactRole) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Contact</h3>
                <div className="mt-1 space-y-1">
                  {entretien.contactName && <p className="text-gray-900">{entretien.contactName}</p>}
                  {entretien.contactRole && <p className="text-gray-600">{entretien.contactRole}</p>}
                </div>
              </div>
            )}

            {entretien.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{entretien.notes}</p>
              </div>
            )}

            {linkedCandidature && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Canal de candidature */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Canal de candidature</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-5 h-5">
                        {linkedCandidature.applicationMethod === "Glassdoor" && <GlassdoorIcon />}
                        {linkedCandidature.applicationMethod === "Indeed" && <IndeedIcon />}
                        {linkedCandidature.applicationMethod === "HelloWork" && <HelloWorkIcon />}
                        {linkedCandidature.applicationMethod === "Welcome to the Jungle" && <WelcomeToTheJungleIcon />}
                        {linkedCandidature.applicationMethod === "Meteojob" && <MeteojobIcon />}
                        {linkedCandidature.applicationMethod === "Talent.com" && <TalentIcon />}
                        {linkedCandidature.applicationMethod === "StudentJob" && <StudentJobIcon />}
                        {linkedCandidature.applicationMethod === "Site de l'entreprise directement" && <SiteEntrepriseIcon />}
                        {linkedCandidature.applicationMethod === "JobDating" && <JobDatingIcon />}
                        {linkedCandidature.applicationMethod === "Remotive (remote jobs)" && <RemotiveIcon />}
                        {linkedCandidature.applicationMethod === "Recommandation / Réseau" && <ReseauxIcon />}
                        {linkedCandidature.applicationMethod === "QAPA" && <QapaIcon />}
                        {linkedCandidature.applicationMethod === "ProfilCulture" && <ProfilCultureIcon />}
                        {linkedCandidature.applicationMethod === "Portail intranet (si offre interne)" && <IntranetIcon />}
                        {linkedCandidature.applicationMethod === "Keljob" && <KeljobIcon />}
                        {linkedCandidature.applicationMethod === "La bonne boîte (Pôle Emploi)" && <LaBonneBoiteIcon />}
                        {linkedCandidature.applicationMethod === "Le Bon Coin (Emploi)" && <LeBonCoinIcon />}
                        {linkedCandidature.applicationMethod === "L'Étudiant" && <LEtudiantIcon />}
                        {linkedCandidature.applicationMethod === "LinkedIn" && <LinkedInIcon />}
                        {linkedCandidature.applicationMethod === "Agence d'intérim" && <InterimIcon />}
                        {linkedCandidature.applicationMethod === "AngelList / Wellfound (startups)" && <WellfoundIcon />}
                        {linkedCandidature.applicationMethod === "APEC" && <ApecIcon />}
                        {linkedCandidature.applicationMethod === "Autre" && <AutreIcon />}
                        {linkedCandidature.applicationMethod === "Cabinet de recrutement" && <CabinetRecrutementIcon />}
                        {linkedCandidature.applicationMethod === "Cadremploi" && <CadreemploiIcon />}
                        {linkedCandidature.applicationMethod === "ChooseMyCompany" && <ChooseMyCompanyIcon />}
                        {linkedCandidature.applicationMethod === "Facebook Jobs" && <FacebookIcon />}
                        {linkedCandidature.applicationMethod === "France travail" && <FranceTravailIcon />}
                        {linkedCandidature.applicationMethod === "Keljob" && <KeljobIcon />}
                      </div>
                      <span className="text-gray-900">{linkedCandidature.applicationMethod}</span>
                    </div>
                  </div>
                  {/* Secteur d'activité */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Secteur d'activité</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-6 h-6">
                        {linkedCandidature.businessSector === "Agriculture / Agroalimentaire" && <AgroalimentaireIcon />}
                        {linkedCandidature.businessSector === "Art / Culture / Patrimoine" && <CultureIcon />}
                        {linkedCandidature.businessSector === "Autres secteurs / Divers" && <AutreIcon />}
                        {linkedCandidature.businessSector === "Banque / Assurance / Finance" && <FinanceIcon />}
                        {linkedCandidature.businessSector === "Bâtiment / Travaux publics" && <BtpIcon />}
                        {linkedCandidature.businessSector === "Administration / Fonction publique" && <AdminIcon />}
                        {linkedCandidature.businessSector === "Commerce / Distribution" && <DistributionIcon />}
                        {linkedCandidature.businessSector === "Communication / Marketing / Publicité" && <PubIcon />}
                        {linkedCandidature.businessSector === "Comptabilité / Gestion / Audit" && <AuditIcon />}
                        {linkedCandidature.businessSector === "Conseil / Stratégie" && <StrategieIcon />}
                        {linkedCandidature.businessSector === "Droit / Justice / Juridique" && <JuridiqueIcon />}
                        {linkedCandidature.businessSector === "Éducation / Formation" && <FormationIcon />}
                        {linkedCandidature.businessSector === "Énergie / Environnement" && <EnvironnementIcon />}
                        {linkedCandidature.businessSector === "Hôtellerie / Restauration / Tourisme" && <RestaurationIcon />}
                        {linkedCandidature.businessSector === "Immobilier" && <ImmobilierIcon />}
                        {linkedCandidature.businessSector === "Industrie / Production / Maintenance" && <MaintenanceIcon />}
                        {linkedCandidature.businessSector === "Informatique / Télécoms" && <TelecomIcon />}
                        {linkedCandidature.businessSector === "Logistique / Transport / Supply Chain" && <SupplyChainIcon />}
                        {linkedCandidature.businessSector === "Luxe / Mode / Beauté" && <ModeIcon />}
                        {linkedCandidature.businessSector === "Médias / Journalisme / Édition" && <EditionIcon />}
                        {linkedCandidature.businessSector === "Métiers de l'artisanat" && <ArtisanatIcon />}
                        {linkedCandidature.businessSector === "Recherche / Sciences" && <RechercheIcon />}
                        {linkedCandidature.businessSector === "Ressources humaines / Recrutement" && <RHIcon />}
                        {linkedCandidature.businessSector === "Santé / Social / Médico-social" && <MedicoSocialIcon />}
                        {linkedCandidature.businessSector === "Sécurité / Défense / Armée" && <ArmeIcon />}
                        {linkedCandidature.businessSector === "Services à la personne / Aide à domicile" && <AideADomicileIcon />}
                        {linkedCandidature.businessSector === "Sport / Animation / Loisirs" && <LoisirIcon />}
                        {linkedCandidature.businessSector === "Startups / Innovation / Tech" && <TechIcon />}
                      </div>
                      <span className="text-gray-900">{linkedCandidature.businessSector}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

    {/* Candidature liée */}
    <div className="px-4 sm:px-6 lg:px-8 mt-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidature</h2>
      {linkedCandidature ? (
        <div
          className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => navigate(`/candidatures/${linkedCandidature.id}`)}
        >
          <div className="p-6 w-full">
            <div className="mb-4">
              <div
                className={`
                  inline-block px-3 py-1 rounded-lg text-sm font-medium mb-4
                  ${linkedCandidature.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                  ${linkedCandidature.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                  ${linkedCandidature.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                  ${linkedCandidature.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                  ${linkedCandidature.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                  ${linkedCandidature.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                `}
              >
                {linkedCandidature.status}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {linkedCandidature.jobTitle}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5"><CompanyIcon /></div>
                <span>{linkedCandidature.companyName}</span>
              </div>
            </div>

            <div className="space-y-4">
              {linkedCandidature.companyAddress && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5"><LocationIcon /></div>
                  <span>{linkedCandidature.companyAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4"><BriefcaseIcon /></div>
                <span>{new Date(linkedCandidature.applicationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Aucune candidature liée</p>
      )}
    </div>

    {/* Procédures */}
    <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Procédures</h2>
      {procedures.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 w-full">
          {procedures.map(procedure => (
            <div
              key={procedure.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer w-full"
              onClick={() => navigate(`/procedures/${procedure.id}`)}
            >
              <div className="p-6 w-full">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      px-2 py-1 rounded-lg text-xs font-medium mb-4
                      ${procedure.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                      ${procedure.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                      ${procedure.status.startsWith('Procédure') ? 'bg-black text-[#f2bd64]' : ''}
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
                      <PhoneIconLucide className="w-5 h-5 mr-2" />
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
                      {procedure.contactName && <p className="text-sm text-gray-600">Contact : {procedure.contactName}</p>}
                      {procedure.contactRole && <p className="text-sm text-gray-500">{procedure.contactRole}</p>}
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
        <p className="text-gray-500">pas de procédure de recrutement liée</p>
      )}
    </div>

    {/* Historique de l'entretien */}
    <div className="px-4 sm:px-6 lg:px-8 mt-8 mb-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique de l'entretien</h2>
      {history.length > 0 ? (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200 w-full">
          {history.map(entry => {
            const date = new Date(entry.created_at);
            const parisDate = new Intl.DateTimeFormat('fr-FR', {
              timeZone: 'Europe/Paris',
              dateStyle: 'long',
              timeStyle: 'short'
            }).format(date);
            return (
              <div key={entry.id} className="p-6 flex flex-wrap sm:flex-nowrap items-start space-x-4 w-full">
                <div className="flex-shrink-0"><History className="w-6 h-6 text-gray-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div
                      className={`
                        px-2 py-1 rounded-lg text-xs font-medium
                        ${entry.status === 'en attente' ? 'bg-[#f2bd64] text-black' : ''}
                        ${entry.status === 'refusé' ? 'bg-red-500 text-black' : ''}
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
        <p className="text-gray-500">Aucun historique disponible</p>
      )}
    </div>

    <Footer />
  </div>
);
}