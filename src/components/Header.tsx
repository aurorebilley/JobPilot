import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Search, Bell } from 'lucide-react';
import MinimalistLogo from './MinimalistLogo';
import TextLogo from './TextLogo';
import BellSimple from './BellSimple';
import Trait from './Trait';
import Sidebar from './Sidebar';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    type: 'candidature' | 'entretien' | 'procedure';
    title: string;
    company: string;
  }>>([]);
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    
    if (!auth.currentUser || value.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const searchTermLower = value.toLowerCase();
      
      // Query all collections in parallel
      const [candidaturesSnap, entretiensSnap, proceduresSnap] = await Promise.all([
        getDocs(query(collection(db, 'candidatures'), where('userId', '==', auth.currentUser.uid))),
        getDocs(query(collection(db, 'entretiens'), where('userId', '==', auth.currentUser.uid))),
        getDocs(query(collection(db, 'procedures'), where('userId', '==', auth.currentUser.uid)))
      ]);

      const results: Array<{
        id: string;
        type: 'candidature' | 'entretien' | 'procedure';
        title: string;
        company: string;
      }> = [];

      // Search in candidatures
      candidaturesSnap.docs.forEach(doc => {
        const data = doc.data();
        if (
          data.jobTitle.toLowerCase().includes(searchTermLower) ||
          data.companyName.toLowerCase().includes(searchTermLower)
        ) {
          results.push({
            id: doc.id,
            type: 'candidature',
            title: data.jobTitle,
            company: data.companyName
          });
        }
      });

      // Search in entretiens
      entretiensSnap.docs.forEach(doc => {
        const data = doc.data();
        if (
          data.jobTitle.toLowerCase().includes(searchTermLower) ||
          data.companyName.toLowerCase().includes(searchTermLower)
        ) {
          results.push({
            id: doc.id,
            type: 'entretien',
            title: data.jobTitle,
            company: data.companyName
          });
        }
      });

      // Search in procedures
      proceduresSnap.docs.forEach(doc => {
        const data = doc.data();
        if (
          data.jobTitle.toLowerCase().includes(searchTermLower) ||
          data.companyName.toLowerCase().includes(searchTermLower)
        ) {
          results.push({
            id: doc.id,
            type: 'procedure',
            title: data.jobTitle,
            company: data.companyName
          });
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: {
    id: string;
    type: 'candidature' | 'entretien' | 'procedure';
  }) => {
    setSearchTerm('');
    setSearchResults([]);
    
    switch (result.type) {
      case 'candidature':
        navigate(`/candidatures/${result.id}`);
        break;
      case 'entretien':
        navigate(`/entretiens/${result.id}`);
        break;
      case 'procedure':
        navigate(`/procedures/${result.id}`);
        break;
    }
  };

  useEffect(() => {
    const checkNotifications = async () => {
      if (!auth.currentUser) return;

      try {
        const today = new Date();
        
        // Fetch read notifications from Supabase
        const { data: readNotifications } = await supabase
          .from('notifications')
          .select('reference_id, message')
          .eq('user_id', auth.currentUser.uid)
          .eq('read', true);

        const readNotificationsMap = new Map<string, string[]>();
        readNotifications?.forEach(notification => {
          if (!readNotificationsMap.has(notification.reference_id)) {
            readNotificationsMap.set(notification.reference_id, []);
          }
          readNotificationsMap.get(notification.reference_id)?.push(notification.message);
        });

        // Query candidatures, entretiens, and procedures
        const [candidaturesSnap, entretiensSnap, proceduresSnap] = await Promise.all([
          getDocs(query(collection(db, 'candidatures'), where('userId', '==', auth.currentUser.uid))),
          getDocs(query(collection(db, 'entretiens'), where('userId', '==', auth.currentUser.uid))),
          getDocs(query(collection(db, 'procedures'), where('userId', '==', auth.currentUser.uid)))
        ]);

        let hasUnread = false;

        // Check candidatures
        for (const doc of candidaturesSnap.docs) {
          const candidature = doc.data();
          const applicationDate = new Date(candidature.applicationDate);
          const twoWeeksAgo = new Date(today);
          const oneMonthAgo = new Date(today);
          twoWeeksAgo.setDate(today.getDate() - 14);
          oneMonthAgo.setDate(today.getDate() - 30);

          const messages = [];
          if (candidature.status === 'refusé') {
            messages.push(`La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été refusée, n'hésitez pas à remercier l'entreprise pour son retour (si retour il y a eu)`);
          } else if (candidature.status === 'validé') {
            messages.push(`Félicitations ! La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été validée, n'hésitez pas à remercier l'entreprise pour son retour. Nous vous conseillons de continuer vos recherches d'emploi jusqu'à expiration de la période d'essai`);
          } else if (candidature.status === 'postulé') {
            if (applicationDate <= oneMonthAgo) {
              messages.push(`La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été effectuée il y a plus de 1 mois, vérifiez si l'offre est toujours actuelle, si vous n'avez pas de retour vous pouvez certainement la passer en statut refusé`);
            } else if (applicationDate <= twoWeeksAgo) {
              messages.push(`La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été effectuée il y a plus de 2 semaines, vérifiez si l'offre est toujours actuelle pour éventuellement changer son statut`);
            }
          }

          const readMessages = readNotificationsMap.get(doc.id) || [];
          if (messages.some(msg => !readMessages.includes(msg))) {
            hasUnread = true;
            break;
          }
        }

        if (!hasUnread) {
          // Check entretiens
          for (const doc of entretiensSnap.docs) {
            const entretien = doc.data();
            const entretienDate = new Date(entretien.date + 'T' + entretien.time);
            const threeDaysFromNow = new Date(today);
            threeDaysFromNow.setDate(today.getDate() + 3);

            if (entretienDate <= threeDaysFromNow && entretienDate >= today) {
              const readMessages = readNotificationsMap.get(doc.id) || [];
              const message = `Vous avez un entretien ${isToday(entretienDate) ? 'aujourd\'hui' : 'bientôt'} à ${entretien.time} chez ${entretien.companyName}`;
              
              if (!readMessages.includes(message)) {
                hasUnread = true;
                break;
              }
            }
          }
        }

        if (!hasUnread) {
          // Check procedures
          for (const doc of proceduresSnap.docs) {
            const procedure = doc.data();
            const procedureDate = new Date(procedure.date + 'T' + procedure.time);
            const threeDaysFromNow = new Date(today);
            threeDaysFromNow.setDate(today.getDate() + 3);

            if (procedureDate <= threeDaysFromNow && procedureDate >= today) {
              const readMessages = readNotificationsMap.get(doc.id) || [];
              const message = `Vous avez une procédure de recrutement ${isToday(procedureDate) ? 'aujourd\'hui' : 'bientôt'} à ${procedure.time} chez ${procedure.companyName}`;
              
              if (!readMessages.includes(message)) {
                hasUnread = true;
                break;
              }
            }
          }
        }

        setHasUnreadNotifications(hasUnread);
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="w-full max-w-full px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo */}
          <div className="flex-shrink-0 w-6 sm:w-auto ml-2 sm:ml-0">
            <Link to="/dashboard" className="block">
              <div className="hidden lg:block">
                <div className="h-8">
                  <TextLogo />
                </div>
              </div>
              <div className="lg:hidden w-6">
                <div className="h-6">
                  <MinimalistLogo />
                </div>
              </div>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-[160px] xs:max-w-xs sm:max-w-2xl mx-4 sm:mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#4e8d60] focus:border-[#4e8d60]"
              />
              {searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                  <ul className="py-1">
                    {searchResults.map((result) => (
                      <li
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-500">
                          {result.company} • {result.type === 'candidature' ? 'Candidature' : result.type === 'entretien' ? 'Entretien' : 'Procédure'}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right section - Navigation */}
          <div className="flex items-center gap-3 sm:gap-4 mr-2 sm:mr-0">
            <Link
              to="/notif"
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-500 focus:outline-none rounded-full relative"
            >
              <span className="sr-only">Voir les notifications</span>
              <BellSimple />
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#4e8d60] ring-2 ring-white" />
              )}
            </Link>

            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm focus:outline-none rounded-full p-1 sm:p-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <Trait />
              </button>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}