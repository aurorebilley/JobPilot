import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Check, Bell } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EntretiensIcon from '../components/EntretiensIcon';
import ProcedureIcon from '../components/ProcedureIcon';
import MinimalistLogo from '../components/MinimalistLogo';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Notification {
  message: string;
  date: Date;
  type: 'entretien' | 'procedure' | 'candidature';
  referenceId: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [candidatureCount, setCandidatureCount] = useState(0);
  const [entretienCount, setEntretienCount] = useState(0);
  const [procedureCount, setProcedureCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [weekLabels, setWeekLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStats, setCurrentWeekStats] = useState({
    candidatures: 0,
    entretiens: 0,
    procedures: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [markingAsRead, setMarkingAsRead] = useState<string[]>([]);
  const [randomAdvice, setRandomAdvice] = useState<string>('');

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
    const fetchData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // Get current date and date 30 days ago
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        // Initialize weekly counts
        const weeklyCounts = Array(4).fill(0);
        const weekLabelsList = [];

        // Generate week labels
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date(thirtyDaysAgo);
          weekStart.setDate(weekStart.getDate() + (i * 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekLabelsList.push(`Semaine ${i + 1}`);
        }

        // Get user's first name
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('email', '==', auth.currentUser.email)
        ));

        if (!userDoc.empty) {
          setUserName(userDoc.docs[0].data().firstName);
        }

        // Get current week start and end
        const currentWeekStart = new Date();
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
        currentWeekStart.setHours(0, 0, 0, 0);
        
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        currentWeekEnd.setHours(23, 59, 59, 999);

        // Get candidatures count and current week stats
        const candidaturesQuery = query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid)
        );
        const candidaturesSnapshot = await getDocs(candidaturesQuery);
        setCandidatureCount(candidaturesSnapshot.size);

        let currentWeekCandidatures = 0;

        // Calculate weekly counts
        candidaturesSnapshot.docs.forEach(doc => {
          const candidature = doc.data();
          const candidatureDate = new Date(candidature.applicationDate);
          
          // Check if candidature is from current week
          if (candidatureDate >= currentWeekStart && candidatureDate <= currentWeekEnd) {
            currentWeekCandidatures++;
          }
          
          if (candidatureDate >= thirtyDaysAgo && candidatureDate <= now) {
            const weekIndex = Math.floor((candidatureDate.getTime() - thirtyDaysAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
            if (weekIndex >= 0 && weekIndex < 4) {
              weeklyCounts[weekIndex]++;
            }
          }
        });

        // Get entretiens count and current week stats
        const entretiensQuery = query(
          collection(db, 'entretiens'),
          where('userId', '==', auth.currentUser.uid)
        );
        const entretiensSnapshot = await getDocs(entretiensQuery);
        setEntretienCount(entretiensSnapshot.size);

        let currentWeekEntretiens = 0;
        entretiensSnapshot.docs.forEach(doc => {
          const entretien = doc.data();
          const entretienDate = new Date(entretien.date);
          if (entretienDate >= currentWeekStart && entretienDate <= currentWeekEnd) {
            currentWeekEntretiens++;
          }
        });

        // Get procedures count and current week stats
        const proceduresQuery = query(
          collection(db, 'procedures'),
          where('userId', '==', auth.currentUser.uid)
        );
        const proceduresSnapshot = await getDocs(proceduresQuery);
        setProcedureCount(proceduresSnapshot.size);

        let currentWeekProcedures = 0;
        proceduresSnapshot.docs.forEach(doc => {
          const procedure = doc.data();
          const procedureDate = new Date(procedure.createdAt);
          if (procedureDate >= currentWeekStart && procedureDate <= currentWeekEnd) {
            currentWeekProcedures++;
          }
        });

        setCurrentWeekStats({
          candidatures: currentWeekCandidatures,
          entretiens: currentWeekEntretiens,
          procedures: currentWeekProcedures
        });

        setWeeklyData(weeklyCounts);
        setWeekLabels(weekLabelsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }

      // Fetch notifications
      try {
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

        const notifs: Notification[] = [];

        // Process candidatures
        const candidaturesSnapshot = await getDocs(query(
          collection(db, 'candidatures'),
          where('userId', '==', auth.currentUser.uid)
        ));

        candidaturesSnapshot.docs.forEach(doc => {
          const candidature = doc.data();
          const applicationDate = new Date(candidature.applicationDate);
          const twoWeeksAgo = new Date(today);
          const oneMonthAgo = new Date(today);
          twoWeeksAgo.setDate(today.getDate() - 14);
          oneMonthAgo.setDate(today.getDate() - 30);

          if (candidature.status === 'refusé') {
            const message = `La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été refusée`;
            const readMessages = readNotificationsMap.get(doc.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: doc.id
              });
            }
          } else if (candidature.status === 'validé') {
            const message = `Félicitations ! La candidature pour le poste de ${candidature.jobTitle} chez ${candidature.companyName} a été validée`;
            const readMessages = readNotificationsMap.get(doc.id) || [];
            if (!readMessages.includes(message)) {
              notifs.push({
                message,
                date: applicationDate,
                type: 'candidature',
                referenceId: doc.id
              });
            }
          }
        });

        // Sort notifications by date
        notifs.sort((a, b) => b.date.getTime() - a.date.getTime());
        setNotifications(notifs);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchRandomAdvice = async () => {
      try {
        const { data: allAdvices, error } = await supabase
          .from('advice')
          .select('content');
        
        if (error) throw error;
        
        if (allAdvices && allAdvices.length > 0) {
          const randomIndex = Math.floor(Math.random() * allAdvices.length);
          setRandomAdvice(allAdvices[randomIndex].content);
        }
      } catch (err) {
        console.error('Error fetching advice:', err);
      }
    };
    
    fetchRandomAdvice();
  }, []);

  const chartData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Candidatures',
        data: weeklyData,
        borderColor: '#4e8d60',
        backgroundColor: '#4e8d60',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Bonjour {userName}
          </h2>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900">Cette semaine :</h2>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <MinimalistLogo />
              </div>
              <h3 className="hidden sm:block text-lg font-medium text-gray-900">Candidatures</h3>
              <span className="sm:hidden text-black text-lg sm:text-2xl font-bold">{currentWeekStats.candidatures}</span>
            </div>
            <p className="mt-2 text-black text-lg sm:text-2xl font-bold hidden sm:block">{currentWeekStats.candidatures}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <EntretiensIcon />
              </div>
              <h3 className="hidden sm:block text-lg font-medium text-gray-900">Entretiens</h3>
              <span className="sm:hidden text-black text-lg sm:text-2xl font-bold">{currentWeekStats.entretiens}</span>
            </div>
            <p className="mt-2 text-black text-lg sm:text-2xl font-bold hidden sm:block">{currentWeekStats.entretiens}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <ProcedureIcon />
              </div>
              <h3 className="hidden sm:block text-lg font-medium text-gray-900">Procédures</h3>
              <span className="sm:hidden text-black text-lg sm:text-2xl font-bold">{currentWeekStats.procedures}</span>
            </div>
            <p className="mt-2 text-black text-lg sm:text-2xl font-bold hidden sm:block">{currentWeekStats.procedures}</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications :</h2>
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">Chargement des notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notif, index) => (
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
        </div>

        {/* Graph */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ce mois-ci :</h2>
          <p className="text-gray-600 mb-4">Évolution des candidatures sur les 4 dernières semaines :</p>
          <div className="bg-white rounded-lg shadow p-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conseils :</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-gray-700">{randomAdvice}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}