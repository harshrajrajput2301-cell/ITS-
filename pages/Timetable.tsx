import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClassSession, DayOfWeek, UserRole, TIME_SLOTS } from '../types';
import { Trash2, Edit2, Plus, Clock, MapPin, User, Check, X, AlertTriangle } from 'lucide-react';

export const Timetable: React.FC = () => {
  const { user, timetable, updateClassSession, deleteClassSession, addClassSession } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const days = Object.values(DayOfWeek);
  
  const filteredClasses = useMemo(() => {
    return timetable
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetable, selectedDay]);

  // Form State
  const [editForm, setEditForm] = useState<Partial<ClassSession>>({});

  const handleEditStart = (session: ClassSession) => {
    setEditForm(session);
    setIsEditing(session.id);
    setIsAdding(false);
  };

  const handleAddStart = () => {
    setEditForm({
      dayOfWeek: selectedDay,
      startTime: '09:00',
      endTime: '10:00',
      isCancelled: false,
      subject: '',
      room: '',
      teacherName: user?.name || '',
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleSave = () => {
    if (!editForm.subject || !editForm.startTime || !editForm.endTime) return;

    if (isAdding) {
      addClassSession({
        ...editForm,
        id: Math.random().toString(36).substr(2, 9),
      } as ClassSession);
    } else if (isEditing) {
      updateClassSession(editForm as ClassSession);
    }
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleCancelClass = (session: ClassSession) => {
    if(window.confirm(`Are you sure you want to ${session.isCancelled ? 'uncancel' : 'cancel'} this class?`)) {
        updateClassSession({ ...session, isCancelled: !session.isCancelled });
    }
  };

  const isTeacher = user?.role === UserRole.TEACHER;

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Timetable</h2>
        
        {/* Day Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          {days.map(day => (
            <button
              key={day}
              onClick={() => { setSelectedDay(day); setIsAdding(false); setIsEditing(null); }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedDay === day 
                  ? (isTeacher ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200')
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>

        {/* Timetable List */}
        <div className="space-y-4 mt-2">
          {filteredClasses.length === 0 && !isAdding && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400">No classes scheduled for {selectedDay}.</p>
              {isTeacher && (
                <button onClick={handleAddStart} className="mt-4 text-indigo-600 font-medium hover:underline">
                    Add a class
                </button>
              )}
            </div>
          )}

          {filteredClasses.map(session => (
            <div key={session.id} className={`relative bg-white rounded-2xl p-5 shadow-sm border transition-all ${session.isCancelled ? 'border-rose-200 bg-rose-50' : 'border-slate-100 hover:shadow-md'}`}>
              
              {isEditing === session.id ? (
                 <EditForm 
                    formData={editForm} 
                    setFormData={setEditForm} 
                    onSave={handleSave} 
                    onCancel={() => setIsEditing(null)} 
                 />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`text-lg font-bold ${session.isCancelled ? 'text-rose-700 line-through' : 'text-slate-800'}`}>
                        {session.subject}
                      </h3>
                      {session.isCancelled && <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Cancelled</span>}
                      {session.substituteTeacher && !session.isCancelled && (
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold mt-1">
                          <AlertTriangle size={12} />
                          Sub: {session.substituteTeacher}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.isCancelled ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User size={16} />
                      <span>{session.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{session.room}</span>
                    </div>
                  </div>

                  {isTeacher && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 justify-end">
                       <button 
                        onClick={() => handleCancelClass(session)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${session.isCancelled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                      >
                        {session.isCancelled ? 'Restore' : 'Cancel Class'}
                      </button>
                      <button 
                        onClick={() => handleEditStart(session)}
                        className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteClassSession(session.id)}
                        className="p-2 bg-slate-50 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {isAdding && (
             <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-indigo-100">
                <EditForm 
                    formData={editForm} 
                    setFormData={setEditForm} 
                    onSave={handleSave} 
                    onCancel={() => setIsAdding(false)} 
                 />
             </div>
          )}

          {isTeacher && !isAdding && (
            <button
              onClick={handleAddStart}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-medium flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition-all"
            >
              <Plus size={20} />
              Add Class
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Subcomponent for Form
const EditForm: React.FC<{
    formData: Partial<ClassSession>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<ClassSession>>>,
    onSave: () => void,
    onCancel: () => void
}> = ({ formData, setFormData, onSave, onCancel }) => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <input 
                    className="border p-2 rounded-lg text-sm w-full" 
                    placeholder="Subject" 
                    value={formData.subject} 
                    onChange={e => setFormData({...formData, subject: e.target.value})} 
                />
                 <input 
                    className="border p-2 rounded-lg text-sm w-full" 
                    placeholder="Room" 
                    value={formData.room} 
                    onChange={e => setFormData({...formData, room: e.target.value})} 
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                 <select 
                    className="border p-2 rounded-lg text-sm w-full"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                 >
                     {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
                  <input 
                    type="time"
                    className="border p-2 rounded-lg text-sm w-full" 
                    value={formData.endTime} 
                    onChange={e => setFormData({...formData, endTime: e.target.value})} 
                />
            </div>
            <input 
                className="border p-2 rounded-lg text-sm w-full" 
                placeholder="Substitute Teacher (Optional)" 
                value={formData.substituteTeacher || ''} 
                onChange={e => setFormData({...formData, substituteTeacher: e.target.value})} 
            />
            <div className="flex justify-end gap-2 mt-2">
                <button onClick={onCancel} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
                <button onClick={onSave} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Check size={20} /></button>
            </div>
        </div>
    )
}