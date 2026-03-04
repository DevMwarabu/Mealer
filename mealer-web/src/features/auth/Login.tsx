import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { LogIn, Mail, Lock, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/login', { email, password });
            setAuth(response.data.user, response.data.access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome</h1>
                <div className="flex items-center justify-center gap-2 text-primary">
                    <ShieldCheck className="w-4 h-4" />
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-80">Nutrition & Finance Intelligence</p>
                </div>
            </div>

            {error && (
                <div className="bg-danger/5 border border-danger/10 text-danger text-[13px] p-4 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm shadow-danger/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Analytical Identity</label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-all duration-300" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/40 outline-none transition-all duration-300 font-medium text-slate-900 placeholder:text-slate-200 shadow-sm"
                            placeholder="admin@mealer.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Access</label>
                        <a href="#" className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors tracking-widest uppercase">Forgotten?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-all duration-300" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-12 focus:bg-white focus:ring-[12px] focus:ring-primary/5 focus:border-primary/40 outline-none transition-all duration-300 font-medium text-slate-900 placeholder:text-slate-200 shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-slate-500 transition-colors bg-white/50 rounded-lg hover:bg-white"
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4.5 rounded-2xl transition-all shadow-[0_20px_40px_-12px_rgba(31,122,92,0.3)] hover:shadow-[0_24px_48px_-12px_rgba(31,122,92,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98] mt-4 transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <LogIn className="w-5 h-5" />
                            <span className="text-base tracking-tight font-bold">Initialize Session</span>
                        </>
                    )}
                </button>
            </form>

            <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400 font-medium">
                    By accessing, you agree to the <span className="text-slate-900 font-bold cursor-pointer hover:underline">Neural Terms</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
