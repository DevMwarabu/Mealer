import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import {
    Activity, Utensils, Plus, Loader2, CheckCircle2,
    RefreshCw, Info, Award, TrendingDown, X,
    ChefHat, Zap, Flame, ChevronRight, Target, Wallet
} from 'lucide-react';
import HealthScore from '../../components/HealthScore';
import HouseholdIntelligence from './HouseholdIntelligence';
import PredictiveInsights from './PredictiveInsights';
import AIAssistant from './AIAssistant';
import RoutineBuilder from './RoutineBuilder';

/* ─── Small stat pill ───────────────────────────────────── */
const KpiCard = ({ label, value, sub, icon: Icon, accent, bg }: any) => (
    <div className={`relative overflow-hidden rounded-[24px] p-6 flex flex-col justify-between min-h-[140px] group transition-all duration-300 hover:-translate-y-1 ${bg}`}>
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Icon className="w-24 h-24" />
        </div>
        <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500/80 group-hover:text-slate-600 transition-colors">{label}</span>
            <div className={`p-2.5 rounded-xl ${accent} backdrop-blur-sm`}>
                <Icon className="w-4 h-4" strokeWidth={2.5} />
            </div>
        </div>
        <div className="relative z-10 mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">{sub}</p>
        </div>
    </div>
);

/* ─── Meal row ───────────────────────────────────────────── */
const MealRow = ({ meal, onSwap }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20 bg-white transition-all group relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-[18px] bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
            {meal.type?.[0] ?? '?'}
        </div>
        <div className="flex-1 min-w-0 py-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{meal.type}</p>
            <p className="font-bold text-slate-800 leading-tight truncate text-sm md:text-base group-hover:text-slate-900">{meal.name}</p>
        </div>
        <div className="text-right shrink-0 hidden sm:block pe-2">
            <p className="text-sm font-black text-slate-800">{meal.calories} <span className="text-[10px] font-extrabold text-slate-400 uppercase">kcal</span></p>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5">{meal.cost}</p>
        </div>
        <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onSwap(meal)} className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all" title="Request Alternative">
                <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-success hover:shadow-md transition-all" title="Mark Eaten">
                <CheckCircle2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [dailyPlan, setDailyPlan] = useState<any>(null);
    const [healthData, setHealthData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [substituting, setSubstituting] = useState<any>(null);
    const [substitutionOptions, setSubstitutionOptions] = useState<any>(null);

    const handleSwap = async (meal: any) => {
        setSubstituting(meal);
        try {
            const res = await api.post('/meals/substitute', { meal_name: meal.name, type: meal.type });
            setSubstitutionOptions(res.data);
        } catch (err) {
            console.error('Substitution failed', err);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const [h, p] = await Promise.all([api.get('/health/daily-score'), api.get('/plan/today')]);
                setHealthData(h.data);
                setDailyPlan(p.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    const metrics = dailyPlan?.metrics ?? {};
    const v2 = dailyPlan?.v2_metrics ?? {};
    const ctx = dailyPlan?.context ?? {};
    const calPct = metrics.target_calories ? Math.min(100, Math.round((metrics.planned_calories / metrics.target_calories) * 100)) : 0;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                            <Activity className="w-3 h-3" />
                            {healthData?.status ?? 'Active'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/5 text-success rounded-full text-[10px] font-black uppercase tracking-widest border border-success/10">
                            <Award className="w-3 h-3" />
                            {ctx.discipline_score ?? '98.2'} discipline
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] ?? 'there'} 👋
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5 font-medium">
                        Here's your nutrition intelligence for today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/meals/log')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary font-bold text-sm transition-all shadow-sm">
                        <Plus className="w-4 h-4" /> Log Meal
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        <Zap className="w-4 h-4" /> Optimise
                    </button>
                </div>
            </div>

            {/* ── KPI row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Health Score" value={healthData?.health_score ?? '—'} sub="vs 65 avg" icon={Activity} accent="bg-primary/10 text-primary" />
                <KpiCard label="Budget Used" value={`KES ${metrics.planned_cost ?? 0}`} sub={`of KES ${metrics.target_cost ?? 0}`} icon={Wallet} accent="bg-accent/10 text-accent" />
                <KpiCard label="Calories" value={`${metrics.planned_calories ?? 0}`} sub={`of ${metrics.target_calories ?? 0} target`} icon={Target} accent="bg-success/10 text-success" />
                <KpiCard label="Metabolic Gain" value={v2.metabolic_impact ?? '+0%'} sub="efficiency vs baseline" icon={TrendingDown} accent="bg-secondary/10 text-secondary" />
            </div>

            {/* ── Main content: 3-col grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left col: Health + Household */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                    <HealthScore score={healthData?.health_score ?? 0} status={healthData?.status ?? 'Active'} />
                    <HouseholdIntelligence data={dailyPlan?.household} />
                </div>

                {/* Centre col: Today's meals + calorie progress */}
                {/* Centre col: Today's meals + calorie progress */}
                <div className="xl:col-span-5 bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <div className="p-7 relative z-10">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-primary" />
                            Today's Optimization
                        </h2>
                    </div>

                    <div className="px-7 pb-2 space-y-3 relative z-10">
                        {dailyPlan?.meals?.length ? dailyPlan.meals.map((meal: any, i: number) => (
                            <MealRow key={i} meal={meal} onSwap={handleSwap} />
                        )) : (
                            <p className="text-slate-400 text-sm text-center py-6">No meals planned yet.</p>
                        )}
                    </div>

                    {/* Calorie & budget progress */}
                    <div className="p-7 space-y-5 relative z-10 mt-2">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Target</span>
                                <span className="text-sm font-black text-slate-800">{calPct}%</span>
                            </div>
                            <div className="h-3 bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${calPct}%` }}>
                                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100/60 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-100/50 rounded-full blur-xl group-hover:bg-success/10 transition-colors" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Nutrient Gaps</p>
                                <div className="flex gap-2 relative z-10">
                                    {['Fe', 'Ca', 'K+'].map((n, i) => (
                                        <span key={n} className={`flex-1 text-center py-2 rounded-xl text-[10px] font-black tracking-wider transition-colors ${i < 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>{n}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100/60 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-100/50 rounded-full blur-xl group-hover:bg-primary/5 transition-colors" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Active Mode</p>
                                <p className="text-sm font-black text-slate-800 mt-1 relative z-10">Zero-Waste</p>
                                <p className="text-[10px] text-primary/80 font-bold mt-0.5 flex items-center gap-1 relative z-10"><Zap className="w-3 h-3" /> Engine Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right col: Predictive + Routine */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <PredictiveInsights data={dailyPlan?.predictive} />
                    <RoutineBuilder />
                </div>
            </div>

            {/* ── Bottom row: Insights + extras ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Neural insights */}
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-10 -mt-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Active Neurals
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-5 mt-auto">
                            {[
                                { label: 'Seasonal Alignment', text: `${ctx.season} — ${ctx.abundant_items?.slice(0, 2).join(', ')}`, border: 'from-primary/20 to-primary/5', ring: 'ring-primary/20' },
                                { label: 'Cultural Matrix', text: ctx.cultural_focus ?? 'Local cuisine alignment active', border: 'from-secondary/20 to-secondary/5', ring: 'ring-secondary/20' },
                                { label: 'Cognitive Load', text: ctx.behavioral_load ?? 'Normal threshold', border: 'from-accent/20 to-accent/5', ring: 'ring-accent/20' },
                                { label: 'Fiscal Health', text: v2.budget_stability ?? 'Stable — inflation guards engaged', border: 'from-emerald-500/20 to-emerald-500/5', ring: 'ring-emerald-500/20' },
                            ].map((it, i) => (
                                <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${it.border} ring-1 inset-ring backdrop-blur-md ${it.ring} hover:bg-white/10 transition-colors`}>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{it.label}</p>
                                    <p className="text-[13px] font-bold text-slate-100 leading-snug">{it.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Meal of the week + batch cooking */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-7 text-white flex-1 relative overflow-hidden shadow-xl shadow-slate-900/10 group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />
                        <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Flame className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5"><Flame className="w-3 h-3" /> Experimental</p>
                            <p className="font-black text-xl leading-tight mb-2 tracking-tight">Swahili Coconut Bean Stew</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Meal of the week</p>
                            <button className="w-full py-3.5 text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm shadow-inner group-hover:border-primary/30">
                                Try Recipe <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {dailyPlan?.batch_cooking_advice && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/50 rounded-[32px] p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-4 right-4 opacity-10">
                                <ChefHat className="w-16 h-16 text-amber-600" />
                            </div>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 relative z-10">
                                <Zap className="w-3 h-3" /> Batch Strategy
                            </p>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed relative z-10 pr-6">{dailyPlan.batch_cooking_advice}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Swap modal ── */}
            {substituting && substitutionOptions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-7 border-b border-slate-50 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Swap Meal</h3>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">AI Suggestions</p>
                            </div>
                            <button onClick={() => { setSubstituting(null); setSubstitutionOptions(null); }} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-7 space-y-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Replacing</p>
                                <p className="font-bold text-slate-900 mt-0.5">{substituting.name}</p>
                            </div>
                            {substitutionOptions.suggestions?.map((opt: any, i: number) => (
                                <button key={i} className="w-full p-5 text-left border border-slate-100 hover:border-primary/30 hover:shadow-md rounded-2xl transition-all group">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{opt.name}</p>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-1">{opt.reason}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <AIAssistant />
        </div>
    );
};

export default Dashboard;
