import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek, UserRole } from '../types';
import { Clock, MapPin, AlertCircle, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, timetable, notifications } = useApp();
  
  // Determine current day and time
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
  const currentHour = new Date().getHours();
  
  // Find next class
  const upcomingClass = useMemo(() => {
    const todaysClasses = timetable
      .filter(s => s.dayOfWeek === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    return todaysClasses.find(c => parseInt(c.startTime.split(':')[0]) >= currentHour);
  }, [timetable, today, currentHour]);

  const unreadAlerts = notifications.filter(n => !n.read).length;

  const isTeacher = user?.role === UserRole.TEACHER;
  const themeColor = isTeacher ? 'indigo' : 'emerald';

  return (
    <div className="pb-20 p-4 max-w-4xl mx-auto space-y-6">
      
      {/* Welcome Card */}
      <div className={`rounded-2xl p-6 text-white shadow-lg ${isTeacher ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
        <p className="text-white/80 text-sm mb-1">{today}</p>
        <h2 className="text-2xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="mt-2 opacity-90 text-sm">
          {unreadAlerts > 0 ? `You have ${unreadAlerts} unread notifications.` : 'You are all caught up!'}
        </p>
      </div>

      {/* Next Class Widget */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Up Next</h3>
        {upcomingClass ? (
          <div className={`bg-white p-5 rounded-2xl shadow-sm border border-l-4 ${upcomingClass.isCancelled ? 'border-l-rose-500 border-slate-100' : `border-l-${themeColor}-500 border-slate-100`}`}>
             <div className="flex justify-between items-start">
                <div>
                    <h4 className={`text-xl font-bold ${upcomingClass.isCancelled ? 'text-rose-600 line-through' : 'text-slate-800'}`}>
                        {upcomingClass.subject}
                    </h4>
                    {upcomingClass.isCancelled && <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded mt-1 inline-block">CANCELLED</span>}
                     {!upcomingClass.isCancelled && upcomingClass.substituteTeacher && (
                         <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded mt-1 inline-block">SUB: {upcomingClass.substituteTeacher}</span>
                     )}
                    <p className="text-slate-500 text-sm mt-1">{isTeacher ? 'You are teaching' : `By ${upcomingClass.teacherName}`}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${upcomingClass.isCancelled ? 'bg-rose-50 text-rose-500' : `bg-${themeColor}-50 text-${themeColor}-600`}`}>
                    <Clock size={24} />
                </div>
             </div>
             <div className="mt-4 flex gap-4 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-slate-400"/>
                    {upcomingClass.startTime} - {upcomingClass.endTime}
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400"/>
                    {upcomingClass.room}
                </div>
             </div>
          </div>
        ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No more classes today!</p>
            </div>
        )}
      </div>

      {/* Quick Stats / Actions */}
      <div className="grid grid-cols-2 gap-4">
          <Link to="/timetable" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 text-center">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <CalendarIcon size={20} />
             </div>
             <span className="font-semibold text-slate-700 text-sm">Full Schedule</span>
          </Link>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
             <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                <AlertCircle size={20} />
             </div>
             <span className="font-semibold text-slate-700 text-sm">
                {isTeacher ? 'Absence Mode' : 'Report Issue'}
             </span>
          </div>
      </div>
    </div>
  );
};