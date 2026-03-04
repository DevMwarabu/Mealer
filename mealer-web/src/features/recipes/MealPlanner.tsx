import React, { useState } from 'react';
import api from '../../api/axios';
import {
    Calendar,
    Sparkles,
    DollarSign,
    Loader2,
    TrendingDown
} from 'lucide-react';

const MealPlanner: React.FC = () => {
    const [generating, setGenerating] = useState(false);
    const [plan, setPlan] = useState<any>(null);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const response = await api.post('/ai/plan-month');
            setPlan(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header className="flex justify-between items-start">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/5 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-secondary/10">
                        <Calendar className="w-3 h-3" />
                        Full-Month AI Orchestration
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Predictive Nutrition Plan</h1>
                    <p className="text-slate-400 mt-2 font-medium italic opacity-70">Constraint-aware optimization for metabolic health and fiscal balance.</p>
                </div>
                {!plan && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        Execute Planning Engine
                    </button>
                )}
            </header>

            {plan ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-900 p-8 rounded-2xl relative overflow-hidden text-white shadow-xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                            <h3 className="font-bold flex items-center gap-2 mb-8 relative z-10 text-sm opacity-80 uppercase tracking-widest italic">
                                <DollarSign className="w-4 h-4 text-accent" />
                                Fiscal Strategy
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-70">Projected Budget</p>
                                    <p className="text-2xl font-bold tracking-tight">KES {plan.total_estimated_cost.toLocaleString()}</p>
                                </div>
                                <div className="p-5 bg-secondary/10 rounded-2xl border border-secondary/20 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-80">Neural Savings</p>
                                        <p className="text-2xl font-bold text-secondary tracking-tight">12.4%</p>
                                    </div>
                                    <TrendingDown className="w-6 h-6 text-secondary opacity-50" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <h3 className="font-bold flex items-center gap-2 mb-6 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                Global Grocery Matrix
                            </h3>
                            <div className="space-y-2">
                                {plan.weekly_grocery_list.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-[13px] py-2.5 px-3 bg-slate-50 rounded-xl hover:bg-white hover:border-slate-100 border border-transparent transition-all cursor-pointer group">
                                        <span className="text-slate-700 font-semibold group-hover:text-primary transition-colors">{item.item}</span>
                                        <span className="text-[10px] font-bold bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-400 shadow-sm">{item.qty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        <div className="overflow-y-auto max-h-[600px] pr-4 space-y-6">
                            {plan.days.map((dayPlan: any) => (
                                <div key={dayPlan.day} className="bg-white group hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer p-8 rounded-[32px] border border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h4 className="font-bold text-xl text-slate-900 tracking-tight">Day {dayPlan.day}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dayPlan.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-right">
                                            <p className="text-sm font-black text-slate-900 leading-none">KES {dayPlan.daily_cost}</p>
                                            <p className="text-[10px] font-bold text-primary tracking-widest uppercase opacity-80">{dayPlan.daily_calories} kcal</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {dayPlan.meals.map((meal: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group/meal">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-bold group-hover/meal:scale-110 transition-transform">
                                                    {meal.type[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{meal.type}</p>
                                                    <p className="text-[14px] font-bold text-slate-800 tracking-tight">{meal.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-900">{meal.calories} kcal</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[450px] bg-white rounded-3xl flex flex-col items-center justify-center text-center p-16 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-32 -mt-32" />
                    <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-10 rotate-6 shadow-xl shadow-primary/5 group-hover:rotate-0 transition-transform duration-500">
                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Active Decision Strategy</h2>
                    <p className="text-slate-400 max-w-sm font-medium text-sm leading-relaxed opacity-80">Engage the AI orchestrator to compute a personalized 30-day nutrition and budget-synchronized roadmap.</p>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
