import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingDown, RefreshCw, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const SimulationEngine: React.FC = () => {
    const [activeSim, setActiveSim] = useState<string | null>(null);
    const [activeMode, setActiveMode] = useState<string>('baseline');
    const [loading, setLoading] = useState(false);
    const [simResult, setSimResult] = useState<any>(null);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchActiveMode = async () => {
            try {
                const res = await api.get('/simulations/active');
                setActiveMode(res.data.active_mode);
            } catch (err) {
                console.error(err);
            }
        };
        fetchActiveMode();
    }, []);

    const simulations = [
        {
            id: 'fiscal',
            title: 'Aggressive Fiscal Mode',
            icon: TrendingDown,
            color: 'text-success',
            bg: 'bg-success/5 border-success/20',
            desc: 'Restructures your monthly plan using bulk pantry staples (lentils, beans, rice) to slash costs by 30% while retaining protein targets.'
        },
        {
            id: 'protein',
            title: 'Hyper-Anabolic Mode',
            icon: Zap,
            color: 'text-accent',
            bg: 'bg-accent/5 border-accent/20',
            desc: 'Re-routes budget towards high-yield protein sources (chicken breasts, eggs, whey) prioritizing muscle synthesis.'
        },
        {
            id: 'seasonal',
            title: 'Local Farm Matrix',
            icon: Activity,
            color: 'text-secondary',
            bg: 'bg-secondary/5 border-secondary/20',
            desc: 'Aligns your grocery pipeline with current regional harvests to maximize micronutrient density and lower produce costs.'
        }
    ];

    const runSimulation = async (id: string) => {
        setLoading(true);
        setActiveSim(id);
        setSimResult(null);

        try {
            const res = await api.post('/simulations/run', { mode: id });
            setSimResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplySimulation = async () => {
        if (!simResult) return;
        setApplying(true);
        try {
            await api.post('/simulations/apply', {
                mode: simResult.meta.mode,
                plan_data: simResult.days
            });
            setActiveMode(simResult.meta.mode);
            setSimResult(null);
        } catch (err) {
            console.error(err);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-primary/10">
                    <Sparkles className="w-3 h-3" />
                    Simulation Nodes
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Intelligence Alteration
                </h1>
                <p className="text-slate-500 mt-2 font-medium text-sm">
                    Deploy advanced modeling nodes to completely restructure your current 30-day baseline architecture.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simulations.map((sim) => {
                    const Icon = sim.icon;
                    const isPreviewing = activeSim === sim.id;
                    const isActive = activeMode === sim.id;

                    return (
                        <div key={sim.id} className={`p-8 rounded-[32px] border ${isPreviewing || isActive ? sim.bg + ' shadow-lg shadow-' + sim.color.split('-')[1] + '/10 scale-[1.02]' : 'bg-white border-slate-100 opacity-70'} transition-all cursor-pointer group relative overflow-hidden`} onClick={() => !loading && runSimulation(sim.id)}>
                            {isActive && (
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                                        <CheckCircle2 className={`w-5 h-5 ${sim.color}`} />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${isPreviewing || isActive ? 'bg-white shadow-sm' : sim.bg} transition-all`}>
                                    <Icon className={`w-8 h-8 ${sim.color}`} strokeWidth={2.5} />
                                </div>
                                {isPreviewing && !loading && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white rounded-lg shadow-sm">Previewing</span>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">{sim.title}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{sim.desc}</p>

                            <button disabled={loading} className={`w-full p-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all ${isPreviewing ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                {loading && isPreviewing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> EXECUTING...</>
                                ) : isPreviewing ? (
                                    <><RefreshCw className="w-5 h-5" /> RE-RUN SIMULATION</>
                                ) : (
                                    <><Zap className="w-5 h-5" /> DEPLOY NODE</>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Simulation Results & Telemetry */}
            {(loading || simResult) && (
                <div className="mt-12 bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden font-mono text-sm leading-relaxed">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="flex justify-between items-start mb-6">
                        <h4 className="font-bold flex items-center gap-3 text-sm relative z-10 font-sans">
                            <Activity className="w-5 h-5 text-primary" />
                            Simulation Telemetry
                        </h4>
                        {simResult && (
                            <button
                                onClick={handleApplySimulation}
                                disabled={applying}
                                className="relative z-20 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {applying ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Apply Node to 30-Day Plan
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 opacity-80 z-10 relative text-[11px] text-green-400">
                        <p>{'>'} STATUS: {loading ? 'COMPUTING...' : 'IDLE'}</p>
                        {loading && (
                            <>
                                <p className="text-yellow-400 mt-4 animate-pulse">{'>'} INITIATING PREDICTIVE MODELS...</p>
                                <p className="text-yellow-400 animate-pulse delay-75">{'>'} RE-ROUTING BUDGET PARAMETERS...</p>
                                <p className="text-yellow-400 animate-pulse delay-150">{'>'} SCANNING PANTRY INVENTORY...</p>
                            </>
                        )}
                        {simResult && (
                            <div className="mt-4 space-y-3">
                                <p className="text-cyan-400 font-bold">{'>'} SIMULATION '{simResult.meta.mode.toUpperCase()}' COMPLETE</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/5 font-sans my-4">
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1">Grade</p>
                                        <p className="text-2xl font-black text-white">{simResult.meta.optimization_grade}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1">Waste Min.</p>
                                        <p className="text-2xl font-black text-white">{simResult.meta.waste_minimization_score}%</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1">Diversity</p>
                                        <p className="text-2xl font-black text-white">{simResult.meta.diversity_index}%</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1">Impact</p>
                                        <p className="text-2xl font-black text-primary">
                                            {simResult.meta.mode === 'fiscal' ? simResult.meta.projected_savings : simResult.meta.protein_gain}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-cyan-400">{'>'} - 30 RECIPES RE-ARCHITECTURED</p>
                                <p className="text-cyan-400">{'>'} - BATCH COOKING OPTIMIZED FOR WEEKENDS</p>
                                <p className="text-cyan-400">{'>'} - NUTRITIONAL GAPS REMEDIATED</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationEngine;
