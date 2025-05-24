import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { Bell, Trash2, X } from 'lucide-react';
import { format, utcToZonedTime } from 'date-fns-tz';
import { fr } from 'date-fns/locale';
import MinimalistLogo from '../components/MinimalistLogo';
import EntretiensIcon from '../components/EntretiensIcon';
import ProcedureIcon from '../components/ProcedureIcon';

interface Notification {
  id: string;
  type: string;
  message: string;
  created_at: string;
  reference_id: string;
}

export default function NotifHistorique() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOldNotifications = async () => {
    if (!auth.currentUser) return;
    
    try {
      setIsDeleting(true);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', auth.currentUser.uid)
        .eq('read', true)
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;
      
      // Refresh notifications list
      const { data: updatedData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', auth.currentUser.uid)
        .eq('read', true)
        .order('created_at', { ascending: false });
        
      setNotifications(updatedData || []);
    } catch (err) {
      console.error('Error deleting old notifications:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', auth.currentUser.uid)
          .eq('read', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/notif')}
            className="hover:opacity-80 transition-opacity"
            aria-label="Retour"
          >
            <BackButton />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Historique des notifications</h1>
        </div>

        {/* Delete Old Notifications Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer les anciennes notifications</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDeleting ? 'Suppression en cours...' : 'Confirmer la suppression'}
                </h3>
                {!isDeleting && (
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {isDeleting ? (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full animate-pulse w-full"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Suppression des notifications...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Les notifications datant de plus de 30 jours seront supprimées. Cette action est irréversible.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteOldNotifications}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Chargement de l'historique...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              // Convert UTC to Paris time
              const parisDate = utcToZonedTime(new Date(notification.created_at), 'Europe/Paris');
              const formattedDate = format(parisDate, "'marqué comme lu le' dd MMMM yyyy 'à' HH:mm", { 
                locale: fr,
                timeZone: 'Europe/Paris'
              });
              
              return (
                <div
                  key={notification.id}
                  className="bg-white shadow rounded-lg p-6 w-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                  onClick={() => {
                    if (notification.type === 'entretien') {
                      navigate(`/entretiens/${notification.reference_id}`);
                    } else if (notification.type === 'procedure') {
                      navigate(`/procedures/${notification.reference_id}`);
                    } else if (notification.type === 'candidature') {
                      navigate(`/candidatures/${notification.reference_id}`);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      {notification.type === 'candidature' && <MinimalistLogo />}
                      {notification.type === 'entretien' && <EntretiensIcon />}
                      {notification.type === 'procedure' && <ProcedureIcon />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{formattedDate}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="w-12 h-12 mx-auto text-gray-400">
              <MinimalistLogo />
            </div>
            <p className="mt-4 text-gray-500">Aucune notification dans l'historique</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}