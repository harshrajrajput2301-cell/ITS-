import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { generateAnnouncement } from '../services/geminiService';
import { Bell, Send, Sparkles, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { user, notifications, addNotification, markAsRead } = useApp();
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  const isTeacher = user?.role === UserRole.TEACHER;

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="p-4">
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
            {isTeacher && (
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('inbox')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'inbox' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                    >
                        Inbox
                    </button>
                    <button 
                         onClick={() => setActiveTab('compose')}
                         className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'compose' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        Send
                    </button>
                </div>
            )}
        </div>

        {activeTab === 'inbox' ? (
          <div className="space-y-3">
            {sortedNotifications.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500">No notifications yet.</p>
              </div>
            )}
            {sortedNotifications.map(note => (
              <div 
                key={note.id} 
                onClick={() => markAsRead(note.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  note.read ? 'bg-white border-slate-100' : 'bg-white border-indigo-100 shadow-sm ring-1 ring-indigo-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                     <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${note.read ? 'bg-slate-300' : 'bg-rose-500'}`} />
                     <div>
                        <h4 className={`font-semibold ${note.read ? 'text-slate-700' : 'text-slate-900'}`}>{note.title}</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{note.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                            <span>{new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span>•</span>
                            <span>{note.senderName}</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <ComposeNotification />
        )}
      </div>
    </div>
  );
};

const ComposeNotification: React.FC = () => {
    const { addNotification, user } = useApp();
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleGenerate = async () => {
        if (!context) return;
        setIsGenerating(true);
        const result = await generateAnnouncement(context, 'friendly');
        setGeneratedMessage(result);
        setIsGenerating(false);
    };

    const handleSend = () => {
        if (!title || (!context && !generatedMessage)) return;
        
        addNotification({
            title,
            message: generatedMessage || context,
            senderName: user?.name || 'Teacher',
            type: 'info'
        });
        
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            setTitle('');
            setContext('');
            setGeneratedMessage('');
        }, 2000);
    };

    if (isSent) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Sent Successfully!</h3>
                <p className="text-slate-500 mt-2">Your notification has been broadcast.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Broadcast Message</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Class Delayed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message Context (or type full message)
                    </label>
                    <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                        placeholder="e.g. I will be 10 minutes late due to traffic."
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !context}
                        className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        Enhance with AI
                    </button>
                </div>

                {generatedMessage && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">AI Draft</span>
                            <button onClick={() => setGeneratedMessage('')} className="text-indigo-400 hover:text-indigo-600"><Trash2 size={14}/></button>
                        </div>
                        <textarea 
                            value={generatedMessage}
                            onChange={(e) => setGeneratedMessage(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-slate-700 focus:ring-0 resize-none"
                            rows={3}
                        />
                    </div>
                )}

                <button 
                    onClick={handleSend}
                    disabled={!title}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    Send Notification
                </button>
            </div>
        </div>
    );
};