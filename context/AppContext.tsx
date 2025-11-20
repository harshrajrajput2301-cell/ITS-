import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, ClassSession, NotificationItem, DayOfWeek } from '../types';

// Mock Initial Data
const INITIAL_TIMETABLE: ClassSession[] = [
  {
    id: '1',
    subject: 'Computer Science',
    teacherName: 'Mr. Anderson',
    room: 'Lab 301',
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00',
    endTime: '10:00',
    isCancelled: false,
  },
  {
    id: '2',
    subject: 'Physics',
    teacherName: 'Ms. Curie',
    room: 'Hall B',
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '10:00',
    endTime: '11:00',
    isCancelled: true,
  },
  {
    id: '3',
    subject: 'Mathematics',
    teacherName: 'Mr. Euler',
    room: 'Room 102',
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: '09:00',
    endTime: '10:30',
    isCancelled: false,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Welcome to ITS Engineering College',
    message: 'Welcome to the new semester! Check your timetable for updates.',
    timestamp: Date.now(),
    senderName: 'Admin',
    type: 'info',
    read: false,
  }
];

interface AppContextType {
  user: User | null;
  login: (email: string, role: UserRole, identifier: string, name: string) => void;
  logout: () => void;
  timetable: ClassSession[];
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  updateClassSession: (session: ClassSession) => void;
  addClassSession: (session: ClassSession) => void;
  deleteClassSession: (id: string) => void;
  markAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persist user to localStorage to survive refreshes
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('edusync_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [timetable, setTimetable] = useState<ClassSession[]>(INITIAL_TIMETABLE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    if (user) {
      localStorage.setItem('edusync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edusync_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole, identifier: string, name: string) => {
    // Mock login logic
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      identifier,
      name,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNote: NotificationItem = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNote, ...prev]);
    
    // Browser Notification API Simulation
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNote.title, { body: newNote.message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(newNote.title, { body: newNote.message });
        }
      });
    }
  }, []);

  const updateClassSession = (updatedSession: ClassSession) => {
    setTimetable(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    
    // Auto-notify students if class status changes
    const oldSession = timetable.find(s => s.id === updatedSession.id);
    if (oldSession) {
      if (updatedSession.isCancelled && !oldSession.isCancelled) {
        addNotification({
          title: `Class Cancelled: ${updatedSession.subject}`,
          message: `${updatedSession.subject} on ${updatedSession.dayOfWeek} at ${updatedSession.startTime} has been cancelled by ${user?.name || 'Teacher'}.`,
          senderName: user?.name || 'System',
          type: 'alert',
        });
      } else if (updatedSession.substituteTeacher && updatedSession.substituteTeacher !== oldSession.substituteTeacher) {
         addNotification({
          title: `Substitute Alert: ${updatedSession.subject}`,
          message: `${updatedSession.substituteTeacher} will cover ${updatedSession.subject} today.`,
          senderName: user?.name || 'System',
          type: 'warning',
        });
      }
    }
  };

  const addClassSession = (session: ClassSession) => {
    setTimetable(prev => [...prev, session]);
  };

  const deleteClassSession = (id: string) => {
    setTimetable(prev => prev.filter(s => s.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, 
      timetable, notifications, 
      addNotification, updateClassSession, addClassSession, deleteClassSession, markAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};