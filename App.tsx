import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Auth } from './components/Auth';
import { TopBar, BottomNav } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Timetable } from './pages/Timetable';
import { Notifications } from './pages/Notifications';

const AppContent: React.FC = () => {
  const { user } = useApp();

  if (!user) {
    return <Auth />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <TopBar />
        <div className="pt-2">
           <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}