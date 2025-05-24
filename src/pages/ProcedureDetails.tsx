import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, History } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import LocationIcon from '../components/LocationIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import CompanyIcon from '../components/CompanyIcon';
import PhoneIcon from '../components/PhoneIcon';
import VisioIcon from '../components/VisioIcon';
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
  candidatureId?: string;
}

interface HistoryEntry {
  id: string;
  status: string;
  created_at: string;
}

export default function ProcedureDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState('');
  const [linkedCandidature, setLinkedCandidature] = useState<any>(null);
  const [entretiens, setEntretiens] = useState<any[]>([]);

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleConfirmDelete = async () => {
    if (!procedure || !auth.currentUser || !id) return;
    try {
      setIsDeleting(true);
      if (procedure.candidatureId) {
        const candRef = doc(db, 'candidatures', procedure.candidatureId);
        const candSnap = await getDoc(candRef);
        if (candSnap.exists()) {
          const ids = candSnap.data().procedureIds || [];
          await updateDoc(candRef, { procedureIds: ids.filter((pid: string) => pid !== id) });
        }
      }
      setDeleteProgress("Suppression de l'historique...");
      let { error: histErr } = await supabase.from('procedure_history').delete().eq('procedure_id', id);
      if (histErr) throw histErr;
      setDeleteProgress("Suppression de la procédure...");
      await deleteDoc(doc(db, 'procedures', id));
      navigate('/procedures');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!procedure || !auth.currentUser) return;
    try {
      const procRef = doc(db, 'procedures', procedure.id);
      const now = new Date();
      if (newStatus === 'entretien') {
        navigate('/candidatures/entretien/new', {
          state: { candidatureId: procedure.candidatureId, companyName: procedure.companyName, jobTitle: procedure.jobTitle }
        });
        return;
      }
      await updateDoc(procRef, { status: newStatus, updatedAt: now });
      const toTrack = ['refusé','Procédure de recrutement 1','Procédure de recrutement 2','validé'];
      if (toTrack.includes(newStatus) && procedure.candidatureId) {
        const entQ = query(collection(db,'entretiens'), where('candidatureId','==',procedure.candidatureId));
        const entDocs = await getDocs(entQ);
        await Promise.all(entDocs.docs.map(async d => {
          await updateDoc(d.ref, { status: newStatus, updatedAt: now });
          await supabase.from('interview_history').insert({
            user_id: auth.currentUser!.uid,
            candidature_id: procedure.candidatureId!,
            interview_id: d.id,
            status: newStatus,
            created_at: now.toISOString()
          });
        }));
        const candRef = doc(db,'candidatures',procedure.candidatureId);
        await updateDoc(candRef, { status: newStatus, updatedAt: now });
        await supabase.from('candidature_history').insert({
          user_id: auth.currentUser!.uid,
          candidature_id: procedure.candidatureId!,
          status: newStatus,
          created_at: now.toISOString()
        });
      }
      await supabase.from('procedure_history').insert({
        user_id: auth.currentUser!.uid,
        candidature_id: procedure.candidatureId,
        procedure_id: procedure.id,
        type: procedure.procedureType,
        status: newStatus,
        created_at: new Date().toISOString()
      });
      setProcedure({ ...procedure, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      if (!auth.currentUser || !id) { navigate('/login'); return; }
      try {
        setLoading(true);
        const snap = await getDoc(doc(db,'procedures',id));
        if (!snap.exists()) { setError('Procédure introuvable'); return; }
        const proc = { id: snap.id, ...(snap.data() as any) } as Procedure;
        setProcedure(proc);

        if (proc.candidatureId) {
          const cSnap = await getDoc(doc(db,'candidatures',proc.candidatureId));
          if (cSnap.exists()) setLinkedCandidature({ id: cSnap.id, ...(cSnap.data() as any) });
          const entSnap = await getDocs(query(collection(db,'entretiens'), where('candidatureId','==',proc.candidatureId)));
          setEntretiens(entSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        const { data: hData, error: hErr } = await supabase
          .from('procedure_history')
          .select('*')
          .eq('procedure_id', id)
          .order('created_at',{ascending:false});
        if (!hErr) setHistory(hData||[]);
      } catch (e) {
        console.error(e);
        setError('Erreur chargement');
      } finally { setLoading(false); }
    })();
  },[id,navigate]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header/>
      <main className="flex-grow flex items-center justify-center"><p>Chargement...</p></main>
      <Footer/>
    </div>
  );
  if (error || !procedure) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header/>
      <main className="flex-grow flex items-center justify-center"><p className="text-red-500">{error}</p></main>
      <Footer/>
    </div>
  );

 return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="hover:opacity-80 transition-opacity"
          aria-label="Retour"
        >
          <BackButton />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Détails de la procédure</h1>
      </div>

      <div className="w-full">
        {/* Actions */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/procedureModif/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f2bd64] hover:bg-[#e5aa4d] text-black font-medium rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        </div>

        {/* Delete Confirmation */}
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
                  Êtes-vous sûr de vouloir supprimer cette procédure ? Cette action est irréversible.
                </p>
              )}
              <div className="flex justify-end space-x-3">
                {!isDeleting && (
                  <>
                    <button
                      onClick={handleCancelDelete}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Procedure Details Card */}
        <div className="w-full bg-white shadow rounded-lg p-6">
          {/* Status & Title */}
          <div className="mb-6">
            <select
              value={procedure.status}
              onChange={e => handleStatusChange(e.target.value)}
              className={`
                w-40 px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer mb-4
                ${procedure.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                ${procedure.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                ${procedure.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                ${procedure.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                ${procedure.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                focus:ring-1 focus:ring-[#4e8d60]
              `}
            >
              <option value="Procédure de recrutement 1">Procédure de recrutement 1</option>
              <option value="Procédure de recrutement 2">Procédure de recrutement 2</option>
              <option value="entretien">Entretien</option>
              <option value="validé">Validé</option>
              <option value="refusé">Refusé</option>
            </select>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{procedure.jobTitle}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5"><CompanyIcon /></div>
              <span>{procedure.companyName}</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Date & Time */}
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date et heure</h3>
              <div className="mt-1 flex items-center gap-2 text-gray-900">
                <div className="w-5 h-5"><BriefcaseIcon /></div>
                <span>{new Date(procedure.date).toLocaleDateString()} à {procedure.time}</span>
              </div>
            </div>

            {/* Location */}
            {procedure.type === 'presentiel' && procedure.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Lieu</h3>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <div className="w-5 h-5"><LocationIcon /></div>
                  <span>{procedure.location}</span>
                </div>
              </div>
            )}

            {/* Visio Link */}
            {procedure.type === 'visio' && procedure.meetingLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Lien de la visioconférence</h3>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-5 h-5"><VisioIcon /></div>
                  <a
                    href={procedure.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4e8d60] hover:underline"
                  >
                    Rejoindre la réunion
                  </a>
                </div>
              </div>
            )}

            {/* Telephone */}
            {procedure.type === 'telephone' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Type de procédure</h3>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <div className="w-5 h-5"><PhoneIcon /></div>
                  <span>Entretien téléphonique</span>
                </div>
              </div>
            )}

            {/* Evaluation Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700">Type d'évaluation</h3>
              <ul className="mt-2 space-y-1">
                {procedure.testTechnique && <li className="text-gray-900">• Test technique</li>}
                {procedure.testPersonnalite && <li className="text-gray-900">• Test de personnalité</li>}
                {procedure.miseEnSituation && <li className="text-gray-900">• Mise en situation</li>}
              </ul>
            </div>

            {/* Contact */}
            {(procedure.contactName || procedure.contactRole) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Contact</h3>
                <div className="mt-1 space-y-1">
                  {procedure.contactName && <p className="text-gray-900">{procedure.contactName}</p>}
                  {procedure.contactRole && <p className="text-gray-600">{procedure.contactRole}</p>}
                </div>
              </div>
            )}

            {/* Notes */}
            {procedure.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{procedure.notes}</p>
              </div>
            )}

            {/* Canal & Secteur with Icons */}
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
                        {linkedCandidature.applicationMethod === "JobDating" && <JobDatingIcon />}
                        {linkedCandidature.applicationMethod === "Meteojob" && <MeteojobIcon />}
                        {linkedCandidature.applicationMethod === "Talent.com" && <TalentIcon />}
                        {linkedCandidature.applicationMethod === "StudentJob" && <StudentJobIcon />}
                        {linkedCandidature.applicationMethod === "Site de l'entreprise directement" && <SiteEntrepriseIcon />}
                        {linkedCandidature.applicationMethod === "Jobijoba" && <JobijobaIcon />}
                        {linkedCandidature.applicationMethod === "Jobteaser" && <JobteaserIcon />}
                        {linkedCandidature.applicationMethod === "Remotive (remote jobs)" && <RemotiveIcon />}
                        {linkedCandidature.applicationMethod === "Recommandation / Réseau" && <ReseauxIcon />}
                        {linkedCandidature.applicationMethod === "QAPA" && <QapaIcon />}
                        {linkedCandidature.applicationMethod === "Monster" && <MonsterIcon />}
                        {linkedCandidature.applicationMethod === "Cabinet de recrutement" && <CabinetRecrutementIcon />}
                        {linkedCandidature.applicationMethod === "Cadremploi" && <CadreemploiIcon />}
                        {linkedCandidature.applicationMethod === "APEC" && <ApecIcon />}
                        {linkedCandidature.applicationMethod === "AngelList / Wellfound (startups)" && <WellfoundIcon />}
                        {linkedCandidature.applicationMethod === "Agence d'intérim" && <InterimIcon />}
                        {linkedCandidature.applicationMethod === "LinkedIn" && <LinkedInIcon />}
                        {linkedCandidature.applicationMethod === "Facebook Jobs" && <FacebookIcon />}
                        {linkedCandidature.applicationMethod === "France travail" && <FranceTravailIcon />}
                        {linkedCandidature.applicationMethod === "La bonne boîte (Pôle Emploi)" && <LaBonneBoiteIcon />}
                        {linkedCandidature.applicationMethod === "Le Bon Coin (Emploi)" && <LeBonCoinIcon />}
                        {linkedCandidature.applicationMethod === "L'Étudiant" && <LEtudiantIcon />}
                        {linkedCandidature.applicationMethod === "ProfilCulture" && <ProfilCultureIcon />}
                        {linkedCandidature.applicationMethod === "Portail intranet (si offre interne)" && <IntranetIcon />}
                        {linkedCandidature.applicationMethod === "Candidature spontanée par email" && <EmailIcon />}
                        {linkedCandidature.applicationMethod === "ChooseMyCompany" && <ChooseMyCompanyIcon />}
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

        {/* Linked Candidature Card */}
        <div className="mt-8 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidature</h2>
          {linkedCandidature ? (
            <div
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/candidatures/${linkedCandidature.id}`)}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div className={`
                    inline-block px-3 py-1 rounded-lg text-sm font-medium mb-4
                    ${linkedCandidature.status === 'postulé' ? 'bg-[#f2bd64] text-black' : ''}
                    ${linkedCandidature.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                    ${linkedCandidature.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                    ${linkedCandidature.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                    ${linkedCandidature.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                    ${linkedCandidature.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                  `}>
                    {linkedCandidature.status}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{linkedCandidature.jobTitle}</h3>
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

        {/* Entretiens */}
        <div className="mt-8 mb-8 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Entretiens</h2>
          {entretiens.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {entretiens.map(ent => (
                <div
                  key={ent.id}
                  className="w-full bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/entretiens/${ent.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`
                        px-2 py-1 rounded-lg text-xs font-medium mb-4
                        ${ent.status === 'en attente' ? 'bg-[#f2bd64] text-black' : ''}
                        ${ent.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                        ${ent.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                        ${ent.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                        ${ent.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                      `}>
                        {ent.status}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <div className="w-5 h-5 mr-2"><BriefcaseIcon /></div>
                        <span>{new Date(ent.date).toLocaleDateString()} à {ent.time}</span>
                      </div>
                      {ent.type === 'presentiel' && ent.location && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-2"><LocationIcon /></div>
                          <span>{ent.location}</span>
                        </div>
                      )}
                      {ent.type === 'visio' && ent.meetingLink && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-2"><VisioIcon /></div>
                          <a
                            href={ent.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4e8d60] hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            Lien de la visioconférence
                          </a>
                        </div>
                      )}
                      {ent.type === 'telephone' && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 mr-2"><PhoneIcon /></div>
                          <span>Entretien téléphonique</span>
                        </div>
                      )}
                      {(ent.contactName || ent.contactRole) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {ent.contactName && <p className="text-sm text-gray-600">Contact : {ent.contactName}</p>}
                          {ent.contactRole && <p className="text-sm text-gray-500">{ent.contactRole}</p>}
                        </div>
                      )}
                      {ent.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 whitespace-pre-line">{ent.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun entretien lié</p>
          )}
        </div>

        {/* Historique de la procédure */}
        <div className="mt-8 mb-8 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique de la procédure</h2>
          {history.length > 0 ? (
            <div className="w-full bg-white shadow rounded-lg divide-y divide-gray-200">
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
                        <div className={`
                          px-2 py-1 rounded-lg text-xs font-medium
                          ${entry.status === 'refusé' ? 'bg-red-500 text-black' : ''}
                          ${entry.status === 'validé' ? 'bg-[#4e8d60] text-white' : ''}
                          ${entry.status === 'Procédure de recrutement 1' ? 'bg-black text-[#f2bd64]' : ''}
                          ${entry.status === 'Procédure de recrutement 2' ? 'bg-black text-[#4e8d60]' : ''}
                          ${entry.status === 'entretien' ? 'bg-green-200 text-black' : ''}
                        `}>
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
      </div>
    </main>
    <Footer />
  </div>
);
}
