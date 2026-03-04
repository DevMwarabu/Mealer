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
    DollarSign,
    ArrowRight
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import HealthScore from '../../components/HealthScore';

const data = [
    { name: 'Mon', calories: 1800, cost: 450 },
    { name: 'Tue', calories: 2100, cost: 550 },
    { name: 'Wed', parseInt: 1950, cost: 400 },
    { name: 'Thu', calories: 2300, cost: 700 },
    { name: 'Fri', calories: 1850, cost: 480 },
    { name: 'Sat', calories: 2000, cost: 600 },
    { name: 'Sun', calories: 1900, cost: 520 },
];

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-primary/10">
                        <Activity className="w-3 h-3" />
                        Neural State: {healthData?.status || 'Optimized'}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Today's Intelligence
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium text-sm">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}. Here is your dynamically generated plan for the day.
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

            {/* Smart Daily Plan - PHASE 5 CORE */}
            {dailyPlan && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-8">
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

                            <div className="mt-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                                <Info className="w-5 h-5 text-secondary shrink-0" />
                                <p className="text-[11px] font-medium text-slate-600 leading-snug">
                                    This plan optimizes for high protein while utilizing the <span className="font-bold text-slate-900">lentils</span> from your pantry to hit budget targets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <HealthScore
                        score={healthData?.health_score || 0}
                        status={healthData?.status || 'N/A'}
                    />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        title="Fiscal Efficiency"
                        value={`${healthData?.budget_efficiency || 0}%`}
                        sub={<><span className="text-success font-bold">+5.2%</span> vs last month</>}
                        icon={DollarSign}
                        color="accent"
                    />
                    <StatCard
                        title="Nutritional Diversity"
                        value="High"
                        sub="24 unique ingredients this week"
                        icon={Utensils}
                        color="secondary"
                    />
                    <StatCard
                        title="Fiscal Pulse"
                        value="KES 12,450"
                        sub="Estimated monthly spend"
                        icon={Activity}
                        color="primary"
                    />
                    <StatCard
                        title="Optimization Target"
                        value="14.2%"
                        sub="Potential savings detected"
                        icon={TrendingDown}
                        color="success"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
                    <h4 className="font-bold text-slate-900 mb-8 flex items-center justify-between text-sm">
                        Analytical Pulse
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-primary" /> Caloric
                            </span>
                        </div>
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1F7A5C" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#1F7A5C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                            <YAxis stroke="#cbd5e1" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 'bold', fontSize: '13px' }}
                                cursor={{ stroke: '#1F7A5C', strokeWidth: 1.5 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="calories"
                                stroke="#1F7A5C"
                                fillOpacity={1}
                                fill="url(#colorCal)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-900 p-8 rounded-[32px] space-y-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-[5s]" />
                    <h4 className="font-bold flex items-center justify-between text-sm relative z-10">
                        Neural Insights
                        <ArrowRight className="w-4 h-4 text-primary" />
                    </h4>
                    <div className="space-y-4 relative z-10">
                        {[
                            { text: "Protein absorption optimal window detected. Follow lunch suggestion for maximum ROI.", color: "border-primary" },
                            { text: "Local inflation trend: Vegetable prices up 4% this week. Adjusting grocery matrix.", color: "border-secondary" },
                            { text: "Hypertension risk low. Sodium consistency score: 98/100.", color: "border-accent" }
                        ].map((insight, i) => (
                            <div key={i} className={`p-4 bg-white/5 rounded-2xl border-l-4 ${insight.color} text-[13px] font-medium text-slate-300 hover:bg-white/10 transition-all cursor-default leading-relaxed`}>
                                {insight.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
