import React, { useState } from 'react';
import { Activity, Zap, TrendingDown, RefreshCw, Loader2, Sparkles } from 'lucide-react';

const SimulationEngine: React.FC = () => {
    const [activeSim, setActiveSim] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const simulations = [
        {
            id: 'cheaper_month',
            title: 'Aggressive Fiscal Mode',
            icon: TrendingDown,
            color: 'text-success',
            bg: 'bg-success/5 border-success/20',
            desc: 'Restructures your monthly plan using bulk pantry staples (lentils, beans, rice) to slash costs by 30% while retaining protein targets.'
        },
        {
            id: 'high_protein',
            title: 'Hyper-Anabolic Mode',
            icon: Zap,
            color: 'text-accent',
            bg: 'bg-accent/5 border-accent/20',
            desc: 'Re-routes budget towards high-yield protein sources (chicken breasts, eggs, whey) prioritizing muscle synthesis.'
        },
        {
            id: 'local_seasonal',
            title: 'Local Farm Matrix',
            icon: Activity,
            color: 'text-secondary',
            bg: 'bg-secondary/5 border-secondary/20',
            desc: 'Aligns your grocery pipeline with current regional harvests to maximize micronutrient density and lower produce costs.'
        }
    ];

    const runSimulation = (id: string) => {
        setLoading(true);
        setActiveSim(id);

        // Mock backend latency
        setTimeout(() => {
            setLoading(false);
            // Result handling would go here
        }, 1500);
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
                    const isActive = activeSim === sim.id;
                    return (
                        <div key={sim.id} className={`p-8 rounded-[32px] border ${isActive ? sim.bg + ' shadow-lg shadow-' + sim.color.split('-')[1] + '/10 scale-[1.02]' : 'bg-white border-slate-100 opacity-70'} transition-all cursor-pointer group`} onClick={() => !loading && runSimulation(sim.id)}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${isActive ? 'bg-white shadow-sm' : sim.bg} transition-all`}>
                                    <Icon className={`w-8 h-8 ${sim.color}`} strokeWidth={2.5} />
                                </div>
                                {isActive && !loading && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white rounded-lg shadow-sm">Active</span>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">{sim.title}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{sim.desc}</p>

                            <button disabled={loading} className={`w-full p-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                {loading && isActive ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> EXECUTING...</>
                                ) : isActive ? (
                                    <><RefreshCw className="w-5 h-5" /> RE-RUN SIMULATION</>
                                ) : (
                                    <><Zap className="w-5 h-5" /> DEPLOY NODE</>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Neural Log Terminal Simulation */}
            <div className="mt-12 bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden font-mono text-sm leading-relaxed">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <h4 className="font-bold flex items-center gap-3 text-sm relative z-10 mb-6 font-sans">
                    <Activity className="w-5 h-5 text-primary" />
                    Simulation Telemetry
                </h4>
                <div className="space-y-2 opacity-80 z-10 relative text-xs text-green-400">
                    <p>{'>'} STATUS: SYSTEM IDLE</p>
                    <p>{'>'} WAITING FOR SIMULATION INPUT...</p>
                    {loading && (
                        <>
                            <p className="text-yellow-400 mt-4">{'>'} INITIATING PREDICTIVE MODELS...</p>
                            <p className="text-yellow-400">{'>'} RE-ROUTING BUDGET PARAMETERS...</p>
                            <p className="text-yellow-400">{'>'} SCANNING PANTRY INVENTORY...</p>
                        </>
                    )}
                    {activeSim && !loading && (
                        <div className="mt-4 space-y-2 text-cyan-400">
                            <p>{'>'} NODE '{activeSim.toUpperCase()}' SUCCESSFULLY DEPLOYED</p>
                            <p>{'>'} - 38 RECIPES MODIFIED</p>
                            <p>{'>'} - BUDGET OPTIMIZED: KES 4,200 SAVED</p>
                            <p>{'>'} - GROCERY PIPELINE UPDATED</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimulationEngine;
