import { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { adminApi } from '../../lib/api.ts';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await adminApi.login(usernameOrEmail, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setUsernameOrEmail('admin');
    setPassword('admin12345');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090b10] relative">
      <div className="absolute top-8 left-8">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors p-2 rounded-xl bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-400/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Administrator Portal</h1>
          <p className="text-xs text-slate-400">
            Secure management for Santosh Kumar Bheel's portfolio, content, media &amp; bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin or rahisantoshkumar843@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* First time credentials hint helper */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Initial Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-amber-400 hover:underline font-mono text-[11px]"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            User: <code className="text-slate-200">admin</code> · Password:{' '}
            <code className="text-slate-200">admin12345</code>
          </div>
          <div className="text-[10px] text-slate-500">
            You can change your password anytime in the Site Settings tab.
          </div>
        </div>
      </div>
    </div>
  );
}
