import React, { useState } from 'react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, GraduationCap, Key, Mail, Hash, User as UserIcon } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Roll Number or Employee ID

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
        // Simulating login with just email/pass
        if (email && password) {
             // For mock purposes, we assign a default name/ID if not provided during simplified login
             login(
                 email, 
                 role, 
                 identifier || (role === UserRole.TEACHER ? 'T-999' : 'S-000'), 
                 name || (role === UserRole.TEACHER ? 'Teacher' : 'Student')
             );
        }
    } else {
        // Registration requires all fields
        if (email && password && identifier && name) {
            login(email, role, identifier, name);
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className={`p-8 text-center ${role === UserRole.TEACHER ? 'bg-indigo-600' : 'bg-emerald-600'} transition-colors duration-300`}>
          <h1 className="text-2xl font-bold text-white mb-2">ITS Engineering College</h1>
          <p className="text-white/80 text-sm">Student Timetable & Class Notifications</p>
        </div>

        {/* Role Toggle */}
        <div className="flex border-b">
          <button
            onClick={() => setRole(UserRole.STUDENT)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              role === UserRole.STUDENT 
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap size={18} />
            Student
          </button>
          <button
            onClick={() => setRole(UserRole.TEACHER)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              role === UserRole.TEACHER 
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck size={18} />
            Teacher
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            {isLogin ? `Login as ${role === UserRole.TEACHER ? 'Teacher' : 'Student'}` : 'Create New Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
               <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-1 outline-none transition-all ${role === UserRole.TEACHER ? 'focus:ring-indigo-500' : 'focus:ring-emerald-500'}`}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-1 outline-none transition-all ${
                  role === UserRole.TEACHER ? 'focus:ring-indigo-500' : 'focus:ring-emerald-500'
                }`}
              />
            </div>

            {!isLogin && (
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder={role === UserRole.TEACHER ? "Employee ID" : "Roll Number"}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-1 outline-none transition-all ${
                      role === UserRole.TEACHER ? 'focus:ring-indigo-500' : 'focus:ring-emerald-500'
                    }`}
                  />
                </div>
            )}

            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-1 outline-none transition-all ${
                  role === UserRole.TEACHER ? 'focus:ring-indigo-500' : 'focus:ring-emerald-500'
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 ${
                role === UserRole.TEACHER 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-500 hover:text-slate-800 hover:underline"
            >
              {isLogin ? "New user? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};