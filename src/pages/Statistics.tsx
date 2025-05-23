import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Statistics from '../components/Statistics';
import MinimalistLogo from '../components/MinimalistLogo';
import EntretiensIcon from '../components/EntretiensIcon';
import ProcedureIcon from '../components/ProcedureIcon';
import Top from '../components/Top';

// canaux
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

// secteurs
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

interface StatsData {
  candidatures: number;
  entretiens: number;
  procedures: number;
  candidaturesRefusees: number;
  candidaturesValidees: number;
}

interface TopStats {
  topBusinessSector: string;
  topApplicationMethod: string;
}

type Period = 'inception' | '6months' | '1month';

// Helpers pour mapper string → composant icône
const renderMethodIcon = (method?: string) => {
  switch (method) {
    case 'Glassdoor': return <GlassdoorIcon />;
    case 'Indeed': return <IndeedIcon />;
    case 'HelloWork': return <HelloWorkIcon />;
    case 'Welcome to the Jungle': return <WelcomeToTheJungleIcon />;
    case 'Meteojob': return <MeteojobIcon />;
    case 'Talent.com': return <TalentIcon />;
    case 'StudentJob': return <StudentJobIcon />;
    case 'Site de l\'entreprise directement': return <SiteEntrepriseIcon />;
    case 'Salon de l\'emploi / Job Dating': return <JobDatingIcon />;
    case 'Remotive (remote jobs)': return <RemotiveIcon />;
    case 'Recommandation / Réseau': return <ReseauxIcon />;
    case 'QAPA': return <QapaIcon />;
    case 'ProfilCulture': return <ProfilCultureIcon />;
    case 'Portail intranet (si offre interne)': return <IntranetIcon />;
    case 'Monster': return <MonsterIcon />;
    case 'Jobijoba': return <JobijobaIcon />;
    case 'Jobteaser': return <JobteaserIcon />;
    case 'Agence d’intérim': return <InterimIcon />;
    case 'Keljob': return <KeljobIcon />;
    case 'La bonne boîte (Pôle Emploi)': return <LaBonneBoiteIcon />;
    case 'Le Bon Coin (Emploi)': return <LeBonCoinIcon />;
    case 'L\'Étudiant': return <LEtudiantIcon />;
    case 'LinkedIn': return <LinkedInIcon />;
    case 'APEC': return <ApecIcon />;
    case 'AngelList / Wellfound (startups)': return <WellfoundIcon />;
    case 'Cabinet de recrutement': return <CabinetRecrutementIcon />;
    case 'Cadremploi': return <CadreemploiIcon />;
    case 'ChooseMyCompany': return <ChooseMyCompanyIcon />;
    case 'Facebook Jobs': return <FacebookIcon />;
    case 'France travail': return <FranceTravailIcon />;
    default: return null;
  }
};

const renderSectorIcon = (sector?: string) => {
  switch (sector) {
    case 'Agriculture / Agroalimentaire': return <AgroalimentaireIcon />;
    case 'Art / Culture / Patrimoine': return <CultureIcon />;
    case 'Autres secteurs / Divers': return <AutreIcon />;
    case 'Banque / Assurance / Finance': return <FinanceIcon />;
    case 'Bâtiment / Travaux publics': return <BtpIcon />;
    case 'Administration / Fonction publique': return <AdminIcon />;
    case 'Commerce / Distribution': return <DistributionIcon />;
    case 'Communication / Marketing / Publicité': return <PubIcon />;
    case 'Comptabilité / Gestion / Audit': return <AuditIcon />;
    case 'Conseil / Stratégie': return <StrategieIcon />;
    case 'Droit / Justice / Juridique': return <JuridiqueIcon />;
    case 'Éducation / Formation': return <FormationIcon />;
    case 'Énergie / Environnement': return <EnvironnementIcon />;
    case 'Hôtellerie / Restauration / Tourisme': return <RestaurationIcon />;
    case 'Immobilier': return <ImmobilierIcon />;
    case 'Industrie / Production / Maintenance': return <MaintenanceIcon />;
    case 'Informatique / Télécoms': return <TelecomIcon />;
    case 'Logistique / Transport / Supply Chain': return <SupplyChainIcon />;
    case 'Sport / Animation / Loisirs': return <LoisirIcon />;
    case 'Startups / Innovation / Tech': return <TechIcon />;
    case 'Services à la personne / Aide à domicile': return <AideADomicileIcon />;
    case 'Sécurité / Défense / Armée': return <ArmeIcon />;
    case 'Métiers de l\'artisanat': return <ArtisanatIcon />;
    case 'Luxe / Mode / Beauté': return <ModeIcon />;
    case 'Médias / Journalisme / Édition': return <EditionIcon />;
    default: return null;
  }
};

export default function StatisticsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData>({
    candidatures: 0,
    entretiens: 0,
    procedures: 0,
    candidaturesRefusees: 0,
    candidaturesValidees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<Period>('inception');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [topStats, setTopStats] = useState<{
    candidatures?: TopStats;
    entretiens?: TopStats;
    procedures?: TopStats;
    refusees?: TopStats;
    validees?: TopStats;
  }>({});

  const periodLabels = {
    inception: 'Depuis création',
    '6months': '6 derniers mois',
    '1month': 'Dernier mois'
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const now = new Date();
        const monthsAgo = period === '6months' ? 6 : period === '1month' ? 1 : 0;
        const startDate = period === 'inception'
          ? null
          : new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate()).toISOString();

        // Requêtes principales
        const candQuery = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid),
          ...(startDate ? [where('applicationDate', '>=', startDate)] : [])
        );
        const entQuery = query(
          collection(db, 'entretiens'),
          where('userId', '==', auth.currentUser.uid),
          ...(startDate ? [where('date', '>=', startDate)] : [])
        );
        const procQuery = query(
          collection(db, 'procedures'),
          where('userId', '==', auth.currentUser.uid),
          ...(startDate ? [where('date', '>=', startDate)] : [])
        );
        const refuseesQuery = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid),
          where('status', '==', 'refusé'),
          ...(startDate ? [where('applicationDate', '>=', startDate)] : [])
        );
        const valideesQuery = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid),
          where('status', '==', 'validé'),
          ...(startDate ? [where('applicationDate', '>=', startDate)] : [])
        );

        // Exécution parallèle
        const [candSnap, entSnap, procSnap, refuseesSnap, valideesSnap] = await Promise.all([
          getDocs(candQuery),
          getDocs(entQuery),
          getDocs(procQuery),
          getDocs(refuseesQuery),
          getDocs(valideesQuery)
        ]);

        // Fonctions pour compter
        const countMaps = (docs: any[], getSector: (d: any) => string, getMethod: (d: any) => string) => {
          const sectorMap = new Map<string, number>();
          const methodMap = new Map<string, number>();
          docs.forEach(docSnap => {
            const data = docSnap.data();
            const sec = getSector(data);
            const met = getMethod(data);
            if (sec) sectorMap.set(sec, (sectorMap.get(sec) || 0) + 1);
            if (met) methodMap.set(met, (methodMap.get(met) || 0) + 1);
          });
          return { sectorMap, methodMap };
        };

        // Top pour candidatures
        const { sectorMap, methodMap } = countMaps(
          candSnap.docs,
          d => d.businessSector,
          d => d.applicationMethod
        );
        // Top pour refusées
        const { sectorMap: refSec, methodMap: refMet } = countMaps(
          refuseesSnap.docs,
          d => d.businessSector,
          d => d.applicationMethod
        );
        // Top pour validées
        const { sectorMap: valSec, methodMap: valMet } = countMaps(
          valideesSnap.docs,
          d => d.businessSector,
          d => d.applicationMethod
        );
        // Top pour entretiens (on lit la candidature associée)
        const entSectorMap = new Map<string, number>();
        const entMethodMap = new Map<string, number>();
        await Promise.all(entSnap.docs.map(async entDoc => {
          const candRef = doc(db, 'candidatures', entDoc.data().candidatureId);
          const candDoc = await getDoc(candRef);
          if (candDoc.exists()) {
            const d = candDoc.data();
            if (d.businessSector) entSectorMap.set(d.businessSector, (entSectorMap.get(d.businessSector) || 0) + 1);
            if (d.applicationMethod) entMethodMap.set(d.applicationMethod, (entMethodMap.get(d.applicationMethod) || 0) + 1);
          }
        }));
        // Top pour procédures (idem)
        const procSectorMap = new Map<string, number>();
        const procMethodMap = new Map<string, number>();
        await Promise.all(procSnap.docs.map(async procDoc => {
          const candRef = doc(db, 'candidatures', procDoc.data().candidatureId);
          const candDoc = await getDoc(candRef);
          if (candDoc.exists()) {
            const d = candDoc.data();
            if (d.businessSector) procSectorMap.set(d.businessSector, (procSectorMap.get(d.businessSector) || 0) + 1);
            if (d.applicationMethod) procMethodMap.set(d.applicationMethod, (procMethodMap.get(d.applicationMethod) || 0) + 1);
          }
        }));

        // Récupère l’item majeur d’une map
        const getTopItem = (map: Map<string, number>) => {
          let top = '';
          let max = 0;
          map.forEach((count, key) => {
            if (count > max) {
              max = count;
              top = key;
            }
          });
          return top;
        };

        // On met à jour le state
        setTopStats({
          candidatures: {
            topBusinessSector: getTopItem(sectorMap),
            topApplicationMethod: getTopItem(methodMap)
          },
          entretiens: {
            topBusinessSector: getTopItem(entSectorMap),
            topApplicationMethod: getTopItem(entMethodMap)
          },
          procedures: {
            topBusinessSector: getTopItem(procSectorMap),
            topApplicationMethod: getTopItem(procMethodMap)
          },
          refusees: {
            topBusinessSector: getTopItem(refSec),
            topApplicationMethod: getTopItem(refMet)
          },
          validees: {
            topBusinessSector: getTopItem(valSec),
            topApplicationMethod: getTopItem(valMet)
          }
        });

        setStats({
          candidatures: candSnap.size,
          entretiens: entSnap.size,
          procedures: procSnap.size,
          candidaturesRefusees: refuseesSnap.size,
          candidaturesValidees: valideesSnap.size
        });

      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  // Composant de carte
  const Card = ({
    title,
    value,
    Icon,
    topStats,
  }: {
    title: string;
    value: number;
    Icon: React.ComponentType<{ className?: string }>;
    topStats?: TopStats;
  }) => (
    <div
      onClick={() => {
        if (title === "Candidatures") navigate('/statistics/candidature');
        if (title === "Entretiens") navigate('/statistics/entretien');
        if (title === "Procédures") navigate('/statistics/procedure');
      }}
      className="
        relative flex-1 min-w-0 bg-white shadow-lg rounded-xl
        p-3 sm:p-4 transform transition-all duration-300 hover:scale-105
        cursor-pointer
      "
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div>
            <p className="hidden sm:block text-xs sm:text-sm font-medium text-gray-500 mb-1">
              {title}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
              {value}
            </h2>
          </div>
          <div className="w-6 sm:w-5 md:w-6 lg:w-8 h-6 sm:h-5 md:h-6 lg:h-8">
            <Icon className="w-full h-full" />
          </div>
        </div>

        {topStats && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="hidden sm:block w-6 h-6"><Top /></div>
              <div className="w-6 h-6">{renderSectorIcon(topStats.topBusinessSector)}</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="hidden sm:block w-6 h-6"><Top /></div>
              <div className="w-6 h-6">{renderMethodIcon(topStats.topApplicationMethod)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <Statistics />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4e8d60] p-2 sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">{periodLabels[period]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showPeriodDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1">
                  {Object.entries(periodLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setPeriod(key as Period);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm sm:text-base ${
                        period === key ? 'text-[#4e8d60] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Chargement des statistiques...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              <Card
                title="Candidatures"
                value={stats.candidatures}
                Icon={MinimalistLogo}
                topStats={topStats.candidatures}
              />
              <Card
                title="Entretiens"
                value={stats.entretiens}
                Icon={EntretiensIcon}
                topStats={topStats.entretiens}
              />
              <Card
                title="Procédures"
                value={stats.procedures}
                Icon={ProcedureIcon}
                topStats={topStats.procedures}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div
                onClick={() => navigate('/statistics/refuse')}
                className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Refusées</h3>
                <p className="text-4xl font-bold text-red-500">{stats.candidaturesRefusees}</p>
                {topStats.refusees && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="hidden sm:block w-6 h-6"><Top /></div>
                      <div className="w-6 h-6">{renderSectorIcon(topStats.refusees.topBusinessSector)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="hidden sm:block w-6 h-6"><Top /></div>
                      <div className="w-6 h-6">{renderMethodIcon(topStats.refusees.topApplicationMethod)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div
                onClick={() => navigate('/statistics/valide')}
                className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Validées</h3>
                <p className="text-4xl font-bold text-[#4e8d60]">{stats.candidaturesValidees}</p>
                {topStats.validees && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="hidden sm:block w-6 h-6"><Top /></div>
                      <div className="w-6 h-6">{renderSectorIcon(topStats.validees.topBusinessSector)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="hidden sm:block w-6 h-6"><Top /></div>
                      <div className="w-6 h-6">{renderMethodIcon(topStats.validees.topApplicationMethod)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
