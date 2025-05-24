import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Top from '../components/Top';

// Import all application method icons
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

// Import all sector icons
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

Chart.register(ArcElement, Tooltip, Legend);

interface TopStats {
  topBusinessSector: string;
  topApplicationMethod: string;
}

type Period = 'inception' | '6months' | '1month';

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
    case "Agence d'intérim": return <InterimIcon />;
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

export default function StatisticsValide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validatedCount, setValidatedCount] = useState(0);
  const [sectorData, setSectorData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });
  const [methodData, setMethodData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });
  const [topStats, setTopStats] = useState<TopStats | null>(null);
  const [period, setPeriod] = useState<Period>('inception');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periodLabels = {
    inception: 'Depuis création',
    '6months': '6 derniers mois',
    '1month': 'Dernier mois'
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      
      try {
        setLoading(true);
        
        // Calculate date range based on period
        const now = new Date();
        const monthsAgo = period === '6months' ? 6 : period === '1month' ? 1 : 0;
        const startDate = period === 'inception'
          ? null
          : new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate()).toISOString();
        
        // Get all validated candidatures
        const candQuery = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid),
          where('status', '==', 'validé'),
          ...(startDate ? [where('applicationDate', '>=', startDate)] : [])
        );
        const candSnap = await getDocs(candQuery);
        
        // Count total validated
        setValidatedCount(candSnap.size);
        
        // Count methods and sectors
        const methodMap = new Map<string, number>();
        const sectorMap = new Map<string, number>();
        
        candSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.applicationMethod) {
            methodMap.set(data.applicationMethod, (methodMap.get(data.applicationMethod) || 0) + 1);
          }
          if (data.businessSector) {
            sectorMap.set(data.businessSector, (sectorMap.get(data.businessSector) || 0) + 1);
          }
        });
        
        // Get top method and sector
        let topMethod = '';
        let maxMethod = 0;
        methodMap.forEach((count, method) => {
          if (count > maxMethod) {
            maxMethod = count;
            topMethod = method;
          }
        });
        
        let topSector = '';
        let maxSector = 0;
        sectorMap.forEach((count, sector) => {
          if (count > maxSector) {
            maxSector = count;
            topSector = sector;
          }
        });
        
        // Set chart data
        setMethodData({
          labels: Array.from(methodMap.keys()),
          values: Array.from(methodMap.values())
        });
        
        setSectorData({
          labels: Array.from(sectorMap.keys()),
          values: Array.from(sectorMap.values())
        });
        
        setTopStats({
          topBusinessSector: topSector,
          topApplicationMethod: topMethod
        });
        
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Une erreur est survenue lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [period]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/statistics')}
              className="hover:opacity-80 transition-opacity"
            >
              <BackButton />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques des candidatures validées</h1>
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
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1">
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
            <div className="bg-white shadow-lg rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-[#4e8d60]">{validatedCount}</h2>
                  <p className="text-lg text-gray-600">candidatures validées</p>
                </div>
              </div>
              
              {topStats && (
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8">
                        <Top />
                      </div>
                      <div className="w-12 h-12">
                        {renderSectorIcon(topStats.topBusinessSector)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{topStats.topBusinessSector}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8">
                        <Top />
                      </div>
                      <div className="w-12 h-12">
                        {renderMethodIcon(topStats.topApplicationMethod)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{topStats.topApplicationMethod}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Application Method Pie chart */}
            <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Distribution par canal de candidature</h3>
              <div className="w-full max-w-2xl mx-auto" style={{ height: '400px' }}>
                <Pie
                  data={{
                    labels: methodData.labels,
                    datasets: [
                      {
                        data: methodData.values,
                        backgroundColor: [
                          '#4e8d60',
                          '#f2bd64',
                          '#FF6B6B',
                          '#4ECDC4',
                          '#45B7D1',
                          '#96CEB4',
                          '#FFEEAD',
                          '#D4A5A5',
                          '#9FA8DA',
                          '#FFE0B2',
                          '#A5D6A7',
                          '#E1BEE7',
                          '#B2EBF2',
                          '#FFCCBC',
                          '#C5CAE9',
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            size: 12
                          },
                          padding: 20
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw as number;
                            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Sector Pie chart */}
            <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Distribution par secteur d'activité</h3>
              <div className="w-full max-w-2xl mx-auto" style={{ height: '400px' }}>
                <Pie
                  data={{
                    labels: sectorData.labels,
                    datasets: [
                      {
                        data: sectorData.values,
                        backgroundColor: [
                          '#4e8d60',
                          '#f2bd64',
                          '#FF6B6B',
                          '#4ECDC4',
                          '#45B7D1',
                          '#96CEB4',
                          '#FFEEAD',
                          '#D4A5A5',
                          '#9FA8DA',
                          '#FFE0B2',
                          '#A5D6A7',
                          '#E1BEE7',
                          '#B2EBF2',
                          '#FFCCBC',
                          '#C5CAE9',
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            size: 12
                          },
                          padding: 20
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw as number;
                            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}