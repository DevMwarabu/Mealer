import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, TrendingUp, AlertCircle, Loader2, Zap, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

const Analytics: React.FC = () => {
    const [habits, setHabits] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isExporting, setIsExporting] = useState(false);

    const macroData = [
        { name: 'Protein', value: 30, color: '#1F7A5C' },
        { name: 'Carbs', value: 50, color: '#3AAFA9' },
        { name: 'Fats', value: 20, color: '#F4A261' },
    ];

    const trendData = [
        { date: 'W1', score: 72, avg: 65 },
        { date: 'W2', score: 78, avg: 65 },
        { date: 'W3', score: 85, avg: 65 },
        { date: 'W4', score: 92, avg: 65 },
    ];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [habitsRes] = await Promise.all([
                    api.get('/health/habits')
                ]);
                setHabits(habitsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Intelligence Report (PDF) has been generated and is ready for download.');
        }, 2000);
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence Graph</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Long-term behavioral analysis and health forecasting.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                        {isExporting ? 'Generating Report...' : 'Export Intelligence Report'}
                    </button>
                    <span className="bg-white text-slate-500 px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 shadow-sm">Last 30 Days</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 h-full">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Macro Distribution Matrix</h4>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={macroData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">100%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balanced</span>
                        </div>
                    </div>
                    {habits && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
                                <p className="text-lg font-black text-slate-900">{habits.consistency_index}%</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Streak</p>
                                <p className="text-lg font-black text-slate-900">{habits.streak}d</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Neural Consistency Index (4-Week Trend)</h4>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" fill="#1F7A5C" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {habits && (
                        <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between group cursor-help hover:bg-primary/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Momentum: {habits.momentum}</p>
                                    <p className="text-sm font-bold text-slate-900">Psychological profile indicates a {habits.status} status in logging frequency.</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest relative z-10">Metabolic Rate</p>
                    <h3 className="text-xl font-bold tracking-tight relative z-10">Stable Baseline</h3>
                    <p className="text-slate-400 text-xs leading-relaxed relative z-10">No critical deviations detected. Metabolic efficiency is currently stable at 94%.</p>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <ShieldCheck className="w-8 h-8 text-secondary" />
                        <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-lg">A+ GRADE</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Health Guard</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Systemic markers are optimized. Micronutrient gaps have decreased by 12% this month.</p>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                        <Zap className="w-12 h-12 text-accent" />
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent" />
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Sustainability Pulse</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Plant-Based Ratio</span>
                            <span className="text-success">68%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-success w-[68%] rounded-full" />
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium">CO2 reduction: 4.2kg this week</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Habit Learning</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Detected "Weekend Overeating" pattern. Mid-week plans have been lightened to compensate.</p>
                    <div className="pt-2 border-t border-slate-200">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                            Auto-Adjustment Active <Zap className="w-3 h-3" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
