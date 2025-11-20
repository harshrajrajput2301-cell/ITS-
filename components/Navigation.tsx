import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Home, Calendar, Bell, LogOut, User, Share2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { user, logout } = useApp();

  const handleShare = () => {
    const shareData = {
      title: 'ITS Engineering College',
      text: 'Join me on ITS Engineering College App - The best app for student schedules!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      alert("Share link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${user?.role === UserRole.TEACHER ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          ITS
        </div>
        <h1 className="font-bold text-slate-800 hidden sm:block">ITS Engineering College</h1>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleShare} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Share2 size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
          <User size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user?.name}</span>
        </div>
        <button 
          onClick={logout} 
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export const BottomNav: React.FC = () => {
  const { notifications } = useApp();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/notifications', icon: Bell, label: 'Alerts', badge: unreadCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-1 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label}
              to={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge ? (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};