import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Activity, MapPin, DollarSign, Target } from 'lucide-react';
import api from '../../api/axios';

const OnboardingWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Mock user settings collection
    const [settings, setSettings] = useState({
        country: 'Kenya',
        budget: '20000',
        goal: 'balanced'
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Trigger baseline generation logic on backend
            await api.post('/plan/baseline', settings);

            // Advance to Dashboard
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">

                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 rotate-12">
                        <Activity className="w-8 h-8 text-white -rotate-12" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Initializing Neural Architecture</h1>
                    <p className="text-slate-500 font-medium">Configure your core parameters to generate your first 30-day intelligence matrix.</p>
                </div>

                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-500">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <MapPin className="text-primary w-6 h-6" />
                                Regional Context
                            </h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Select operating region</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={settings.country}
                                    onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                                >
                                    <option value="Kenya">Kenya (KES)</option>
                                    <option value="USA">United States (USD)</option>
                                    <option value="UK">United Kingdom (GBP)</option>
                                </select>
                                <p className="text-xs text-slate-400 font-medium">Affects pantry suggestions, pricing metrics, and cultural recipe models.</p>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                Establish Region <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <DollarSign className="text-accent w-6 h-6" />
                                Fiscal Boundaries
                            </h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">Monthly Food Budget</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                                    value={settings.budget}
                                    onChange={(e) => setSettings({ ...settings, budget: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 font-medium">The intelligence engine will optimize your recipes and bulk-buys to remain strictly under this threshold.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Back</button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                    Set Fiscal Rules <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Target className="text-secondary w-6 h-6" />
                                Biological Objective
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'cut', label: 'Deficit', desc: 'Caloric reduction for fat loss.' },
                                    { id: 'balanced', label: 'Sustain', desc: 'Metabolic equilibrium.' },
                                    { id: 'bulk', label: 'Surplus', desc: 'Protein-heavy muscle building.' },
                                ].map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => setSettings({ ...settings, goal: goal.id })}
                                        className={`p-4 rounded-2xl border text-left transition-all ${settings.goal === goal.id ? 'bg-secondary/10 border-secondary text-secondary shadow-inner' : 'bg-slate-50 border-slate-100 hover:border-secondary/30'}`}
                                    >
                                        <h3 className="font-bold text-sm mb-1">{goal.label}</h3>
                                        <p className="text-[10px] opacity-70 font-medium leading-tight">{goal.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                                <p className="text-sm font-bold text-slate-900 mb-2">Final Review</p>
                                <ul className="text-xs font-medium text-slate-600 space-y-1">
                                    <li>• Operating in <span className="text-primary font-bold">{settings.country}</span></li>
                                    <li>• Fiscal cap set at <span className="text-primary font-bold">{settings.budget}</span></li>
                                    <li>• Biological logic set to <span className="text-primary font-bold uppercase">{settings.goal}</span></li>
                                </ul>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all" disabled={loading}>Back</button>
                                <button onClick={handleGenerate} disabled={loading} className="flex-1 bg-primary text-white p-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6" />}
                                    {loading ? 'COMPUTING MATRICES...' : 'INITIALIZE NEURAL PLAN'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-primary w-8' : 'bg-slate-300 w-2'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
