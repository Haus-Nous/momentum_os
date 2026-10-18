import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  KeyRound,
  Mail,
  User,
  Briefcase,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMomentumStore } from '../../store/useMomentumStore';

interface AuthViewProps {
  isAuthLoading?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ isAuthLoading = false }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [persona, setPersona] = useState<string>('professional');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, loginAsGuest } = useAuthStore();
  const { updateSettings, syncUserProfile } = useMomentumStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await register(name, email, password, role, persona);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
          setIsLoading(false);
          return;
        }

        updateSettings({
          theme: 'dark',
          persona: persona as any,
        });

        syncUserProfile(name, role || 'Systems Architect');
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password.');
          setIsLoading(false);
          return;
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090D16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px' 
        }} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {/* Brand / Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D85A2A] to-amber-500 flex items-center justify-center shadow-lg shadow-[#D85A2A]/25 mb-4 border border-[#D85A2A]/40">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            MOMENTUM <span className="text-[#D85A2A] font-black text-xs uppercase px-2 py-0.5 rounded-full bg-[#D85A2A]/10 border border-[#D85A2A]/30">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Autonomous Student-Developer & AI Operating System
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-6 relative">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 z-10 ${
              mode === 'login' 
                ? 'text-emerald-400 shadow-md shadow-emerald-950/50' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 z-10 ${
              mode === 'signup' 
                ? 'text-emerald-400 shadow-md shadow-emerald-950/50' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <motion.div 
            layout
            className="absolute top-1 bottom-1 bg-slate-800/90 rounded-xl border border-slate-700/50"
            style={{
              left: mode === 'login' ? '4px' : '50%',
              width: 'calc(50% - 4px)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Vaibhavi Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
                  Role / Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="AI Engineer / Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
                  Operating Persona
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition cursor-pointer"
                  >
                    <option value="professional" className="bg-slate-900 text-slate-100">Professional / Industry</option>
                    <option value="academic" className="bg-slate-900 text-slate-100">Student / Academic</option>
                    <option value="creative" className="bg-slate-900 text-slate-100">Creative / Freelancer</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isAuthLoading}
            className="w-full mt-2 bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#D85A2A]/20 active:scale-[0.99] transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {isLoading || isAuthLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to Workspace' : 'Initialize Personal OS'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => loginAsGuest()}
            className="w-full mt-3 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
          >
            <span>🐱 Enter as Guest (Cozy Desk)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Account Isolation & Persistent Workspace</span>
        </div>
      </motion.div>
    </div>
  );
};
