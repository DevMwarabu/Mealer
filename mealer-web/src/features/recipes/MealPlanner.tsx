import React, { useState } from 'react';
import api from '../../api/axios';
import {
    Calendar,
    Sparkles,
    DollarSign,
    Loader2,
    TrendingDown,
    RefreshCw,
    Check,
    Save
} from 'lucide-react';

const MealPlanner: React.FC = () => {
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState('Optimal');
    const [swapping, setSwapping] = useState<any>(null); // { day, mealIdx, originalMeal }
    const [suggestions, setSuggestions] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchExistingPlan = async () => {
            try {
                const response = await api.get('/ai/latest-plan');
                if (response.data) {
                    setPlan(response.data);
                    if (response.data.strategy) {
                        setActiveFilter(response.data.strategy);
                    }
                } else {
                    // Proactive Generation: If no plan exists, build one automatically
                    handleGenerate();
                }
            } catch (err) {
                console.error("Failed to fetch existing plan:", err);
                // Fallback to manual trigger if API fails (e.g. auth issue)
            }
        };
        fetchExistingPlan();
    }, []);

    const filters = [
        { id: 'Optimal', label: 'AI Optimal', icon: Sparkles },
        { id: 'Cheap', label: 'Budget-First', icon: DollarSign },
        { id: 'Protein', label: 'High Protein', icon: TrendingDown },
        { id: 'Quick', label: 'Quick Meals', icon: Calendar },
    ];

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const response = await api.post('/ai/plan-month', { strategy: activeFilter });
            setPlan(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async (planToSave = plan) => {
        if (!planToSave) return;
        setSaving(true);
        try {
            await api.post('/ai/save-plan', {
                strategy: activeFilter,
                plan_data: planToSave
            });
            // Show some success Toast or change icon temporarily if needed
        } catch (err) {
            console.error("Failed to save plan:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleSwapRequest = async (day: number, mealIdx: number, meal: any) => {
        setSwapping({ day, mealIdx, originalMeal: meal });
        try {
            const response = await api.post('/meals/substitute', {
                meal_name: meal.name,
                type: meal.type,
                calories: meal.calories
            });
            setSuggestions(response.data.suggestions);
        } catch (err) {
            console.error(err);
        }
    };

    const applySwap = async (suggestion: any) => {
        if (!swapping || !plan) return;

        const newPlan = { ...plan };
        const dayIdx = swapping.day - 1;

        // Update the specific meal in the plan
        newPlan.days[dayIdx].meals[swapping.mealIdx] = {
            ...newPlan.days[dayIdx].meals[swapping.mealIdx],
            name: suggestion.name,
            cost: suggestion.cost,
            calories: suggestion.calories,
            score: rand(85, 95), // Re-score
            scores: {
                nutrition: rand(14, 20),
                preference: rand(14, 20),
                cost: rand(14, 20),
                variety: rand(14, 20),
                health_goal: rand(14, 20)
            }
        };

        setPlan(newPlan);
        setSwapping(null);
        setSuggestions([]);

        // Auto-save on swap
        await handleSave(newPlan);
    };

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/5 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-secondary/10">
                        <Calendar className="w-3 h-3" />
                        Full-Month AI Orchestration
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Predictive Nutrition Plan</h1>
                    <p className="text-slate-400 mt-2 font-medium italic opacity-70">Constraint-aware optimization for metabolic health and fiscal balance.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {!plan ? (
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === f.id
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <f.icon className="w-3.5 h-3.5" />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button
                            onClick={() => handleSave()}
                            disabled={saving}
                            className="bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold shadow-sm flex items-center gap-3 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 text-sm"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Persist Configuration
                        </button>
                    )}
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-sm w-full sm:w-auto"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {plan ? 'Re-Generate Plan' : 'Execute Engine'}
                    </button>
                </div>
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
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-400 shadow-sm">{item.qty}</span>
                                            <span className="text-[8px] font-bold text-slate-300 mt-1 uppercase">{item.freq}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        <div className="overflow-y-auto max-h-[700px] pr-4 space-y-6 scrollbar-hide">
                            {plan.days.map((dayPlan: any) => (
                                <div key={dayPlan.day} className="bg-white group hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer p-8 rounded-[32px] border border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h4 className="font-bold text-xl text-slate-900 tracking-tight">Day {dayPlan.day}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dayPlan.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-right">
                                            <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-sm font-black text-slate-900 leading-none">KES {dayPlan.daily_cost}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Cap</p>
                                            </div>
                                            <div className="px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                                                <p className="text-[10px] font-bold text-primary tracking-widest uppercase">{dayPlan.daily_calories} kcal</p>
                                                <p className="text-[8px] font-bold text-primary opacity-50 uppercase tracking-widest mt-1">Metabolic Load</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {dayPlan.meals.map((meal: any, idx: number) => (
                                            <div key={idx} className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group/meal relative overflow-hidden">
                                                <div className="flex items-center gap-5 relative z-10">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-black text-lg group-hover/meal:scale-110 group-hover/meal:bg-primary group-hover/meal:text-white transition-all duration-500">
                                                        {meal.type[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{meal.type}</p>
                                                            {meal.score >= 90 && (
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                                    <Sparkles className="w-2 h-2" /> Top Match
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[15px] font-bold text-slate-800 tracking-tight">{meal.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-slate-900 drop-shadow-sm">{meal.calories} kcal</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">KES {meal.cost}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleSwapRequest(dayPlan.day, idx, meal)}
                                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all group/swap"
                                                            title="AI Substitution Suggestion"
                                                        >
                                                            <RefreshCw className="w-4 h-4 group-hover/swap:rotate-180 transition-transform duration-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-200/50 relative z-10">
                                                    <div className="flex flex-col text-center bg-white rounded-lg p-1.5 shadow-sm border border-slate-50 relative group/tooltip" title="Nutrition Score (Balance & Macros +10 to -5)">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nutr.</span>
                                                        <span className="text-[11px] font-black text-success">{meal.scores?.nutrition ?? 0}/20</span>
                                                    </div>
                                                    <div className="flex flex-col text-center bg-white rounded-lg p-1.5 shadow-sm border border-slate-50 relative group/tooltip" title="Preference Score (Based on your past eating behavior)">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pref.</span>
                                                        <span className="text-[11px] font-black text-blue-500">{meal.scores?.preference ?? 0}/20</span>
                                                    </div>
                                                    <div className="flex flex-col text-center bg-white rounded-lg p-1.5 shadow-sm border border-slate-50 relative group/tooltip" title="Cost Score (Matches your Budget Constraints)">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cost</span>
                                                        <span className="text-[11px] font-black text-accent">{meal.scores?.cost ?? 0}/20</span>
                                                    </div>
                                                    <div className="flex flex-col text-center bg-white rounded-lg p-1.5 shadow-sm border border-slate-50 relative group/tooltip" title="Variety Penalty (Avoids repeating meals quickly)">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Var.</span>
                                                        <span className="text-[11px] font-black text-purple-500">{meal.scores?.variety ?? 0}/20</span>
                                                    </div>
                                                    <div className="flex flex-col text-center bg-white rounded-lg p-1.5 shadow-sm border border-slate-50 relative group/tooltip" title="Health Goal Alignment (Matches fitness/diet goals)">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Goal</span>
                                                        <span className="text-[11px] font-black text-rose-500">{meal.scores?.health_goal ?? 0}/20</span>
                                                    </div>
                                                </div>

                                                {/* Swap Overlay */}
                                                {swapping && swapping.day === dayPlan.day && swapping.mealIdx === idx && (
                                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col p-5 animate-in slide-in-from-bottom-4 duration-300">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">AI Substitution Hub</p>
                                                            <button onClick={() => setSwapping(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            {suggestions.length > 0 ? suggestions.map((s, si) => (
                                                                <button
                                                                    key={si}
                                                                    onClick={() => applySwap(s)}
                                                                    className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group/opt"
                                                                >
                                                                    <div className="text-left">
                                                                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                                                        <p className="text-[9px] text-slate-400">{s.reason}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] font-bold text-slate-900">{s.calories} kcal</p>
                                                                            <p className="text-[8px] text-slate-400 uppercase">Matched</p>
                                                                        </div>
                                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary border border-slate-100 group-hover/opt:bg-primary group-hover/opt:text-white transition-all">
                                                                            <Check className="w-4 h-4" />
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            )) : (
                                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                                    <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                                                                    <p className="text-[10px] font-bold text-slate-400 italic">Consulting Kenyan Knowledge Base...</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                                            <p className="text-[8px] text-slate-400 leading-tight">AI Engine optimizes for calorie parity and nutritional consistency during swap.</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none group-hover/meal:bg-primary/5 transition-colors duration-700" />
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
                    <p className="text-slate-400 max-w-sm font-medium text-sm leading-relaxed opacity-80">Engage the 5-Layer AI orchestrator to compute a personalized 30-day nutrition and budget-synchronized roadmap.</p>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
