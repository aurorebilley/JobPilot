import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import CandidatureModif from './pages/CandidatureModif';
import Entretiens from './pages/Entretiens';
import Procedures from './pages/Procedures';
import Candidatures from './pages/Candidatures';
import NewCandidature from './pages/NewCandidature';
import NewEntretien from './pages/NewEntretien';
import NewProcedureRecrutement from './pages/NewProcedureRecrutement';
import SelectProcedure from './pages/SelectProcedure';
import Contact from './pages/Contact';
import CandidatureDetails from './pages/CandidatureDetails';
import Account from './pages/Account';
import MentionLegal from './pages/MentionLegal';
import ProcedureDetails from './pages/ProcedureDetails';
import EntretienDetails from './pages/EntretienDetails';
import SelectEntretiens from './pages/SelectEntretiens';
import EntretienModif from './pages/EntretienModif';
import Statistics from './pages/Statistics';
import ProcedureModif from './pages/ProcedureModif';
import StatisticsCandidature from './pages/StatisticsCandidature';
import StatisticsEntretien from './pages/StatisticsEntretien';
import StatisticsProcedure from './pages/StatisticsProcedure';
import StatisticsRefuse from './pages/StatisticsRefuse';
import StatisticsValide from './pages/StatisticsValide';
import Notif from './pages/notif';
import NotifHistorique from './pages/notifhistorique';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>;
  }

  return (
    <BrowserRouter>
      <div className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Inscription />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entretiens" element={<Entretiens />} />
        <Route path="/procedures" element={<Procedures />} />
        <Route path="/candidatures" element={<Candidatures />} />
        <Route path="/candidatures/new" element={<NewCandidature />} />
        <Route path="/candidatures/modif/:id" element={<CandidatureModif />} />
        <Route path="/candidatures/:id" element={<CandidatureDetails />} />
        <Route path="/entretiens/select" element={<SelectEntretiens />} />
        <Route path="/entretiens/:id" element={<EntretienDetails />} />
        <Route path="/entretiens/modif/:id" element={<EntretienModif />} />
        <Route path="/procedures/:id" element={<ProcedureDetails />} />
        <Route path="/procedureModif/:id" element={<ProcedureModif />} />
        <Route path="/procedures/select" element={<SelectProcedure />} />
        <Route path="/statistics/candidature" element={<StatisticsCandidature />} />
        <Route path="/statistics/entretien" element={<StatisticsEntretien />} />
        <Route path="/statistics/procedure" element={<StatisticsProcedure />} />
        <Route path="/statistics/refuse" element={<StatisticsRefuse />} />
        <Route path="/statistics/valide" element={<StatisticsValide />} />
        <Route path="/candidatures/entretien/new" element={<NewEntretien />} />
        <Route path="/candidatures/procedure/new" element={<NewProcedureRecrutement />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentionlegal" element={<MentionLegal />} />
        <Route path="/notif" element={<Notif />} />
        <Route path="/notifhistorique" element={<NotifHistorique />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;