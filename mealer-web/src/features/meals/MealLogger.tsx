import React, { useState } from 'react';
import api from '../../api/axios';
import {
    Sparkles,
    Scale,
    DollarSign,
    ChevronRight,
    Plus,
    ArrowRight,
    Loader2,
    CheckCircle2,
    XCircle,
    Mic,
    Camera,
    ScanBarcode
} from 'lucide-react';

const MealLogger: React.FC = () => {
    const [description, setDescription] = useState('');
    const [estimating, setEstimating] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleEstimate = async () => {
        if (!description) return;
        setEstimating(true);
        setStatus('idle');
        try {
            const response = await api.post('/ai/estimate-nutrition', { description });
            setPrediction(response.data);
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setEstimating(false);
        }
    };

    const handleCommit = async () => {
        if (!prediction) return;
        setEstimating(true);
        try {
            await api.post('/meals', {
                meal_type: 'lunch', // Should be dynamic in a full implementation
                consumed_at: new Date().toISOString(),
                items: prediction.items.map((item: any) => ({
                    ingredient_id: 1, // Mock: In real app, AI matches string to DB ID
                    quantity: item.quantity,
                    unit: item.unit,
                    cost: item.cost,
                    calories: item.calories
                })),
                notes: description
            });
            setStatus('success');
            setPrediction(null);
            setDescription('');
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setEstimating(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/10">
                    <Sparkles className="w-3 h-3" />
                    Intelligence Engine
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Meal Architect</h1>
                <p className="text-slate-500 mt-2 font-medium max-w-xl">Describe your dietary intake. The neural engine will decompose the data into nutritional and fiscal metrics.</p>
            </header>

            <div className="space-y-6">
                <div className="relative group">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-44 bg-white border border-slate-100 p-8 rounded-[32px] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-200 text-lg font-medium shadow-sm resize-none"
                        placeholder="e.g., Two eggs scrambled with one cup of spinach and a small avocado on whole wheat toast..."
                    />
                    <button
                        onClick={handleEstimate}
                        disabled={estimating || !description}
                        className="absolute bottom-6 right-6 bg-primary text-white px-8 py-4 rounded-[20px] font-bold shadow-lg shadow-primary/20 disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        {estimating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze Stream'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group">
                        <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Voice Log</span>
                    </button>
                    <button className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group">
                        <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Photo Scan</span>
                    </button>
                    <button className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group">
                        <ScanBarcode className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Barcode</span>
                    </button>
                </div>

                {status === 'success' && (
                    <div className="p-6 bg-success/5 border border-success/10 rounded-[28px] flex items-center justify-center gap-3 animate-in zoom-in-95 duration-300">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <p className="text-success font-bold text-sm">Meal successfully committed to neural database! 🧠✨</p>
                        <button onClick={() => setStatus('idle')} className="ml-4 text-xs font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-6 bg-danger/5 border border-danger/10 rounded-[28px] flex items-center justify-center gap-3 animate-in zoom-in-95 duration-300">
                        <XCircle className="w-5 h-5 text-danger" />
                        <p className="text-danger font-bold text-sm">System interruption. Check network or neural connectivity.</p>
                    </div>
                )}

                {prediction && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-6 duration-700">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-8 relative z-10 text-[10px] uppercase tracking-widest opacity-60">
                                <Scale className="w-4 h-4 text-primary" />
                                Nutritional Matrix
                            </h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {[
                                    { label: 'Calories', val: prediction.calories, unit: 'kcal' },
                                    { label: 'Protein', val: prediction.protein, unit: 'g' },
                                    { label: 'Carbs', val: prediction.carbs, unit: 'g' },
                                    { label: 'Fat', val: prediction.fat, unit: 'g' }
                                ].map((item, i) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-primary/20">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight">{item.val}<span className="text-[10px] ml-1 opacity-40 font-bold">{item.unit}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[80px] -mr-16 -mt-16" />
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-8 relative z-10 text-[10px] uppercase tracking-widest opacity-60">
                                <DollarSign className="w-4 h-4 text-accent" />
                                Fiscal Intel
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[24px] text-white shadow-xl">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-70">Estimated Cost</p>
                                        <p className="text-3xl font-black tracking-tighter">{prediction.currency} {prediction.estimated_cost}</p>
                                    </div>
                                    <span className="bg-accent/20 text-accent text-[9px] font-black px-4 py-2 rounded-full tracking-widest uppercase border border-accent/20 shadow-inner">
                                        {prediction.glycemic_impact} GI
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-80">Optimization Suggestions</p>
                                    {prediction.suggestions.map((s: string, i: number) => (
                                        <div key={i} className="flex gap-3 text-[13px] text-slate-600 font-medium leading-normal p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 translate-y-0.5" />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm md:col-span-2 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest opacity-60">
                                <Scale className="w-4 h-4 text-primary" />
                                Ingredient Deconstruction
                            </h3>
                            <div className="space-y-3">
                                {prediction.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50/30 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-200 transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-primary shadow-sm border border-slate-100 group-hover/item:border-primary/30 group-hover/item:text-primary transition-all">
                                                {item.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">{item.quantity}{item.unit} • {item.calories} kcal</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{prediction.currency} {item.cost}</p>
                                            <span className="text-[9px] font-bold text-success uppercase tracking-widest">Calculated</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                onClick={handleCommit}
                                disabled={estimating}
                                className="w-full bg-primary text-white py-6 rounded-[28px] font-black shadow-2xl shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all text-base flex items-center justify-center gap-4 tracking-tight"
                            >
                                {estimating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" strokeWidth={3} />}
                                DEPLOY TO INTELLIGENCE LAYER
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealLogger;
