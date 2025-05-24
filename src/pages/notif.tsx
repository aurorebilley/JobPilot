import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Bell, Check } from 'lucide-react';
import EntretiensIcon from '../components/EntretiensIcon';
import MinimalistLogo from '../components/MinimalistLogo';
import BackButton from '../components/BackButton';
import { format, isToday, addDays, isSameDay, differenceInDays, subDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReadNotification {
  reference_id: string;
  message: string;
}

interface Candidature {
  id: string;
  applicationDate: string;
  status: string;
  companyName: string;
  jobTitle: string;
}

interface Procedure {
  id: string;
  date: string;
  time: string;
  companyName: string;
  candidatureId: string;
  jobTitle?: string;
}

interface Interview {
  id: string;
  date: string;
  time: string;
  companyName: string;
  candidatureId: string;
  jobTitle?: string;
}

interface Notification {
  message: string;
  date: Date;
  type: 'entretien' | 'procedure' | 'candidature';
  referenceId: string;
}

export default function Notif() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string[]>([]);

  const handleMarkAsRead = async (notification: Notification) => {
    if (!auth.currentUser) return;
    
    try {
      setMarkingAsRead(prev => [...prev, notification.referenceId]);
      
      const { error } = await supabase.from('notifications').insert({
        user_id: auth.currentUser.uid,
        type: notification.type,
        reference_id: notification.referenceId,
        message: notification.message,
        read: true,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      // Remove the notification from the list
      setNotifications(prev => 
        prev.filter(n => n.referenceId !== notification.referenceId)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setMarkingAsRead(prev => prev.filter(id => id !== notification.referenceId));
    }
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const today = new Date();
        
        // Fetch read notifications from Supabase
        const { data: readNotifications, error: readNotificationsError } = await supabase
          .from('notifications')
          .select('reference_id, message')
          .eq('user_id', auth.currentUser.uid)
          .eq('read', true);

        if (readNotificationsError) {
          console.error('Error fetching read notifications:', readNotificationsError);
          return;
        }

        const readNotificationsMap = new Map<string, string[]>();
        readNotifications?.forEach(notification => {
          if (!readNotificationsMap.has(notification.reference_id)) {
            readNotificationsMap.set(notification.reference_id, []);
          }
          readNotificationsMap.get(notification.reference_id)?.push(notification.message);
        });

        today.setHours(0, 0, 0, 0);
        const threeDaysFromNow = addDays(today, 3);
        const oneMonthAgo = subDays(today, 30); 
        const threeWeeksAgo = subDays(today, 21);
        const twoWeeksAgo = subDays(today, 14);
        const oneWeekAgo = subDays(today, 7);
        const notifs: Notification[] = [];
        const oneDayAgo = subDays(today, 1);
        
        // Query candidatures with status 'postulé'
        const candidaturesRef = collection(db, 'candidatures');
        const candidaturesQuery = query(
          candidaturesRef,
          where('userId', '==', auth.currentUser.uid)
        );
        
        const candidaturesSnapshot = await getDocs(candidaturesQuery);
        const candidatures: Candidature[] = candidaturesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Candidature));
        
        // Check for old candidatures
        candidatures.forEach(candidature => {
          const applicationDate = parseISO(candidature.applicationDate);
          
          if (candidature.status === 'refusé') {
            const message = `La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été refusée, n'hésitez pas à remercier l'entreprise pour son retour (si retour il y a eu)`;
            
            // Check if this notification has already been read
            const readMessages = readNotificationsMap.get(candidature.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: candidature.id
              });
            }
          } else if (candidature.status === 'validé') {
            const message = `Félicitations ! La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été validée, n'hésitez pas à remercier l'entreprise pour son retour. Nous vous conseillons de continuer vos recherches d'emploi jusqu'à expiration de la période d'essai`;
            
            // Check if this notification has already been read
            const readMessages = readNotificationsMap.get(candidature.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: candidature.id
              });
            }
          } else if (candidature.status === 'postulé' && applicationDate <= oneMonthAgo) {
            const message = `La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été effectuée il y a plus de 1 mois, vérifiez si l'offre est toujours actuelle, si vous n'avez pas de retour vous pouvez certainement la passer en statut refusé`;
            
            // Check if this notification has already been read
            const readMessages = readNotificationsMap.get(candidature.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: candidature.id
              });
            }
          } else if (candidature.status === 'postulé' && applicationDate <= twoWeeksAgo) {
            const message = `La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été effectuée il y a plus de 2 semaines, vérifiez si l'offre est toujours actuelle pour éventuellement changer son statut`;
            
            // Check if this notification has already been read
            const readMessages = readNotificationsMap.get(candidature.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: candidature.id
              });
            }
          } else if (candidature.status === 'postulé' && applicationDate <= oneWeekAgo) {
            const message = `La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été effectuée il y a plus de 1 semaine sans retour, n'hésitez pas à relancer l'entreprise si possible`;
            
            // Check if this notification has already been read
            const readMessages = readNotificationsMap.get(candidature.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: candidature.id
              });
            }
          }
        });

        // Query interviews in the next 3 days
        const interviewsRef = collection(db, 'entretiens');
        const interviewsQuery = query(
          interviewsRef,
          where('userId', '==', auth.currentUser.uid),
          where('date', '>=', threeWeeksAgo.toISOString().split('T')[0]),
          where('date', '<=', threeDaysFromNow.toISOString().split('T')[0])
        );

        const interviewsSnapshot = await getDocs(interviewsQuery);
        const interviews: Interview[] = [];

        // Get interview data and linked candidature details
        for (const docSnapshot of interviewsSnapshot.docs) {
          const interviewData = docSnapshot.data();
          if (interviewData.candidatureId) {
            const candidatureRef = doc(db, 'candidatures', interviewData.candidatureId);
            const candidatureSnapshot = await getDoc(candidatureRef);
            
            if (candidatureSnapshot.exists()) {
              const candidatureData = candidatureSnapshot.data();
              interviews.push({
                id: docSnapshot.id,
                date: interviewData.date,
                time: interviewData.time,
                companyName: interviewData.companyName,
                candidatureId: interviewData.candidatureId,
                jobTitle: candidatureData.jobTitle
              });
            }
          }
        }

        // Query procedures in the next 3 days
        const proceduresRef = collection(db, 'procedures');
        const proceduresQuery = query(
          proceduresRef,
          where('userId', '==', auth.currentUser.uid),
          where('date', '>=', threeWeeksAgo.toISOString().split('T')[0]),
          where('date', '<=', threeDaysFromNow.toISOString().split('T')[0])
        );

        const proceduresSnapshot = await getDocs(proceduresQuery);
        const procedures: Procedure[] = [];

        // Get procedure data and linked candidature details
        for (const docSnapshot of proceduresSnapshot.docs) {
          const procedureData = docSnapshot.data();
          if (procedureData.candidatureId) {
            const candidatureRef = doc(db, 'candidatures', procedureData.candidatureId);
            const candidatureSnapshot = await getDoc(candidatureRef);
            
            if (candidatureSnapshot.exists()) {
              const candidatureData = candidatureSnapshot.data();
              procedures.push({
                id: docSnapshot.id,
                date: procedureData.date,
                time: procedureData.time,
                companyName: procedureData.companyName,
                candidatureId: procedureData.candidatureId,
                jobTitle: candidatureData.jobTitle
              });
            }
          }
        }

        // Add interview notifications
        interviews.forEach(interview => {
          const interviewDate = new Date(interview.date + 'T' + interview.time);
          const formattedDate = format(interviewDate, 'dd/MM', { locale: fr });
          const daysUntil = differenceInDays(interviewDate, today);
          const daysAgo = differenceInDays(today, interviewDate);
          const interviewData = interviewsSnapshot.docs.find(d => d.id === interview.id)?.data();
          const status = interviewData?.status;
          let message = '';

          if (isToday(interviewDate)) {
            message = `Vous avez un entretien aujourd'hui à ${interview.time} chez ${interview.companyName} pour le poste de ${interview.jobTitle}`;
          } else if (daysUntil === 1) {
            message = `Vous avez un entretien dans 1 jour le ${formattedDate} à ${interview.time} chez ${interview.companyName} pour le poste de ${interview.jobTitle}`;
          } else if (daysUntil === 2) {
            message = `Vous avez un entretien dans 2 jours le ${formattedDate} à ${interview.time} chez ${interview.companyName} pour le poste de ${interview.jobTitle}`;
          } else if (daysAgo === 1) {
            message = `Pensez à remercier l'entreprise ${interview.companyName} pour l'entretien et confirmer votre intéressement pour le poste de ${interview.jobTitle}`;
          } else if (status === 'en attente' && interviewDate <= oneWeekAgo) {
            message = `L'entretien pour le poste de ${interview.jobTitle} chez ${interview.companyName} a été effectué il y a plus de 1 semaine sans retour, pensez à relancer l'entreprise`;
          } else if (status === 'en attente' && interviewDate <= twoWeeksAgo) {
            message = `L'entretien pour le poste de ${interview.jobTitle} chez ${interview.companyName} a été effectué il y a plus de 2 semaines sans retour, regarder si l'offre est toujours d'actualité pour éventuellement changer son statut`;
          } else if (status === 'en attente' && interviewDate <= threeWeeksAgo) {
            message = `L'entretien pour le poste de ${interview.jobTitle} chez ${interview.companyName} a été effectué il y a plus de 3 semaines sans retour, vous pouvez certainement le passer en statut refusé`;
          }

          // Check if this notification has already been read
          const readMessages = readNotificationsMap.get(interview.id) || [];
          if (message && !readMessages.includes(message)) {
            notifs.push({
              message,
              date: interviewDate,
              type: 'entretien' as const,
              referenceId: interview.id
            });
          }
        });

        // Add procedure notifications
        procedures.forEach(procedure => {
          const procedureDate = new Date(procedure.date + 'T' + procedure.time);
          const formattedDate = format(procedureDate, 'dd/MM', { locale: fr });
          const daysUntil = differenceInDays(procedureDate, today);
          const daysAgo = differenceInDays(today, procedureDate); 
          const procedureData = proceduresSnapshot.docs.find(d => d.id === procedure.id)?.data();
          const status = procedureData?.status;
          let message = '';

          if (isToday(procedureDate)) {
            message = `Vous avez une procédure de recrutement aujourd'hui à ${procedure.time} chez ${procedure.companyName} pour le poste de ${procedure.jobTitle}`;
          } else if (daysUntil === 1) {
            message = `Vous avez une procédure de recrutement dans 1 jour le ${formattedDate} à ${procedure.time} chez ${procedure.companyName} pour le poste de ${procedure.jobTitle}`;
          } else if (daysUntil === 2) {
            message = `Vous avez une procédure de recrutement dans 2 jours le ${formattedDate} à ${procedure.time} chez ${procedure.companyName} pour le poste de ${procedure.jobTitle}`;
          } else if (daysAgo === 1) {
            message = `Pensez à remercier l'entreprise ${procedure.companyName} pour la procédure de recrutement et confirmer votre intéressement pour le poste de ${procedure.jobTitle}`;
          } else if ((status === 'Procédure de recrutement 1' || status === 'Procédure de recrutement 2') && procedureDate <= oneWeekAgo) {
            message = `La procédure de recrutement pour le poste de ${procedure.jobTitle} chez ${procedure.companyName} a été effectuée il y a plus de 1 semaine sans retour, pensez à relancer l'entreprise`;
          } else if ((status === 'Procédure de recrutement 1' || status === 'Procédure de recrutement 2') && procedureDate <= twoWeeksAgo) {
            message = `La procédure de recrutement pour le poste de ${procedure.jobTitle} chez ${procedure.companyName} a été effectuée il y a plus de 2 semaines sans retour, regarder si l'offre est toujours d'actualité pour éventuellement changer son statut`;
          } else if ((status === 'Procédure de recrutement 1' || status === 'Procédure de recrutement 2') && procedureDate <= threeWeeksAgo) {
            message = `La procédure de recrutement pour le poste de ${procedure.jobTitle} chez ${procedure.companyName} a été effectuée il y a plus de 3 semaines sans retour, vous pouvez certainement la passer en statut refusé`;
          }

          // Check if this notification has already been read
          const readMessages = readNotificationsMap.get(procedure.id) || [];
          if (message && !readMessages.includes(message)) {
            notifs.push({
              message,
              date: procedureDate,
              type: 'procedure' as const,
              referenceId: procedure.id
            });
          }
        });

        // Sort notifications by date
        notifs.sort((a, b) => a.date.getTime() - b.date.getTime());
        setNotifications(notifs);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:opacity-80 transition-opacity"
              aria-label="Retour"
            >
              <BackButton />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">Chargement des notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div 
                  key={index} 
                  className="bg-white shadow rounded-lg p-6 w-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={(e) => {
                    // Prevent click if target is the mark as read button
                    if ((e.target as HTMLElement).closest('button')) return;
                    
                    if (notif.type === 'entretien') {
                      navigate(`/entretiens/${notif.referenceId}`);
                    } else if (notif.type === 'procedure') {
                      navigate(`/procedures/${notif.referenceId}`);
                    } else if (notif.type === 'candidature') {
                      navigate(`/candidatures/${notif.referenceId}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {notif.type === 'entretien' ? (
                        <div className="w-6 h-6 flex-shrink-0">
                          <EntretiensIcon />
                        </div>
                      ) : notif.type === 'procedure' ? (
                        <Bell className="h-6 w-6 text-[#f2bd64] flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 flex-shrink-0">
                          <MinimalistLogo />
                        </div>
                      )}
                      <p className="text-gray-900">{notif.message}</p>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notif)}
                      disabled={markingAsRead.includes(notif.referenceId)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-black bg-[#f2bd64] hover:bg-[#e5aa4d] rounded-lg transition-colors sm:px-4 sm:py-2 z-10"
                    >
                      <Check className="h-4 w-4 sm:h-5 sm:h-5" />
                      <span className="hidden sm:inline">Marquer comme lu</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">Aucune notification</p>
            </div>
          )}
          
          <div className="mt-8 mb-8 flex justify-end">
            <button
              onClick={() => navigate('/notifhistorique')}
              className="px-4 py-2 bg-[#4e8d60] hover:bg-[#3d6f4b] text-white font-medium rounded-lg transition-colors duration-200"
            >
              Historique des notifications
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}