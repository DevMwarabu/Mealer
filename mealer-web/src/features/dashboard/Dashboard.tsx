import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import {
    Activity,
    Utensils,
    Plus,
    Loader2,
    CheckCircle2,
    RefreshCw,
    Info,
    Award,
    TrendingDown,
    ArrowRight
} from 'lucide-react';
import HealthScore from '../../components/HealthScore';
import HouseholdIntelligence from './HouseholdIntelligence';
import PredictiveInsights from './PredictiveInsights';

// Analytical data for charts moved to PredictiveInsights component or served via API.

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => {
    const colorClasses: any = {
        primary: 'bg-primary/5 text-primary border-primary/10',
        secondary: 'bg-secondary/5 text-secondary border-secondary/10',
        accent: 'bg-accent/5 text-accent border-accent/10',
        success: 'bg-success/5 text-success border-success/10',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border ${colorClasses[color] || colorClasses.primary}`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</h3>
                <div className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                    {sub}
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [dailyPlan, setDailyPlan] = useState<any>(null);
    const [healthData, setHealthData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [healthRes, planRes] = await Promise.all([
                    api.get('/health/daily-score'),
                    api.get('/plan/today')
                ]);
                setHealthData(healthRes.data);
                setDailyPlan(planRes.data);
                console.log('V2 Dashboard Payload:', planRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                            <Activity className="w-3 h-3" />
                            Neural State: {healthData?.status || 'Optimized'}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-success/5 text-success rounded-full text-[10px] font-bold uppercase tracking-widest border border-current/10`}>
                            <Award className="w-3 h-3" />
                            Discipline: {dailyPlan?.context?.discipline_score || '98.2'}
                        </div>
                        {dailyPlan?.context?.behavioral_load === 'High Load Detected' && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/10 animate-pulse">
                                <Info className="w-3 h-3" />
                                Cognitive Load: High
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        Today's Intelligence
                        <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded uppercase tracking-tighter animate-pulse">V2 Active</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium text-sm">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}. Your plan is <span className="text-primary font-bold">{dailyPlan?.v2_metrics?.metabolic_impact}</span> more efficient today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/meals/log')}
                        className="bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 group transition-all active:scale-95 text-sm"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Manual Override
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all active:scale-95 text-sm">
                        <Award className="w-4 h-4" />
                        Improve Today
                    </button>
                </div>
            </header>

            {/* V2 Intelligence Grid - Moved to Top for Visibility */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <HealthScore
                        score={healthData?.health_score || 0}
                        status={healthData?.status || 'Active'}
                    />
                </div>
                <div className="lg:col-span-1">
                    <HouseholdIntelligence data={dailyPlan?.household} />
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-6">
                    <StatCard
                        title="Metabolic Pulse"
                        value={dailyPlan?.v2_metrics?.metabolic_impact || '0%'}
                        sub={<><span className="text-success font-bold">+12%</span> efficiency gains</>}
                        icon={Activity}
                        color="success"
                    />
                    <StatCard
                        title="Budget Stability"
                        value={dailyPlan?.v2_metrics?.budget_stability || 'Stable'}
                        sub="Inflation sensitivity active"
                        icon={TrendingDown}
                        color="primary"
                    />
                    <StatCard
                        title="Sustainability Score"
                        value={`${dailyPlan?.v2_metrics?.sustainability_score || 0}%`}
                        sub="Low carbon sourcing"
                        icon={TrendingDown}
                        color="secondary"
                    />
                    <StatCard
                        title="Behavioral Index"
                        value={dailyPlan?.context?.discipline_score || '98.2'}
                        sub={dailyPlan?.context?.behavioral_load || 'Normal Load'}
                        icon={Award}
                        color="accent"
                    />
                </div>
            </div>

            {/* Smart Daily Plan - PHASE 5 CORE */}
            {dailyPlan && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Meals List */}
                            <div className="flex-1 p-8 space-y-6 lg:border-r border-slate-100">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
                                    <Utensils className="w-4 h-4 text-primary" />
                                    Recommended Sequence
                                </h2>
                                <div className="space-y-4">
                                    {dailyPlan.meals.map((meal: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                                    {meal.type[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{meal.type}</p>
                                                    <p className="font-bold text-slate-900 text-lg tracking-tight leading-tight">{meal.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-sm font-black text-slate-900">{meal.calories} <span className="text-[10px] text-slate-400 font-bold">kcal</span></p>
                                                    <p className="text-xs font-bold text-accent">{meal.cost}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Swap Meal">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-all" title="Mark Consumed">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Metrics */}
                            <div className="w-full lg:w-80 bg-slate-50/50 p-8 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Target Calories</p>
                                        <p className="text-3xl font-black text-slate-900">{dailyPlan.metrics.planned_calories}<span className="text-sm text-slate-400 font-bold tracking-normal ml-1">/ {dailyPlan.metrics.target_calories}</span></p>
                                        <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(dailyPlan.metrics.planned_calories / dailyPlan.metrics.target_calories) * 100}%` }} />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Fiscal Projection</p>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">KES {dailyPlan.metrics.planned_cost}</p>
                                        <p className="text-xs font-bold text-success mt-1">{(dailyPlan.metrics.target_cost - dailyPlan.metrics.planned_cost)} KES under budget</p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-secondary shrink-0" />
                                        <p className="text-[11px] font-medium text-slate-600 leading-snug">
                                            Optimization mode: <span className="font-bold text-slate-900">Zero-Waste Engine</span>.
                                            Utilizing bulk pantry items to minimize environmental footprint.
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Nutrient Gap Heatmap</p>
                                        <div className="flex gap-2">
                                            <div className="flex-1 h-8 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center text-[9px] font-black text-success">IRON</div>
                                            <div className="flex-1 h-8 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center text-[9px] font-black text-success">CALCIUM</div>
                                            <div className="flex-1 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-black text-accent animate-pulse">POTASSIUM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-1">
                        <PredictiveInsights data={dailyPlan?.predictive} />
                    </div>
                </div>
            )}



            <div className="bg-slate-900 p-8 rounded-[32px] space-y-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-[5s]" />
                <h4 className="font-bold flex items-center justify-between text-sm relative z-10">
                    Neural Engine Insights
                    <ArrowRight className="w-4 h-4 text-primary" />
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {[
                        { text: `Seasonal Availability: ${dailyPlan?.context?.season}. Primary focus: ${dailyPlan?.context?.abundant_items?.join(', ')}.`, color: "border-primary" },
                        { text: `Cultural/Traditional Mapping: ${dailyPlan?.context?.cultural_focus}. High local alignment.`, color: "border-secondary" },
                        { text: `Behavioral State: ${dailyPlan?.context?.behavioral_load}. Adaptive response active.`, color: "border-accent" }
                    ].map((insight, i) => (
                        <div key={i} className={`p-6 bg-white/5 rounded-2xl border-l-4 ${insight.color} text-[13px] font-medium text-slate-300 hover:bg-white/10 transition-all cursor-default leading-relaxed`}>
                            {insight.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
