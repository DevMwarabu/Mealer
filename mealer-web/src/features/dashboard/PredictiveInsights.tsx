import React from 'react';
import { TrendingDown, ClipboardCheck, ArrowUpRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictiveInsights: React.FC<{ data: any }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-32 h-32 text-primary" />
            </div>

            <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-white font-bold text-xl tracking-tight">90-Day Trajectory</h3>
                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">AI Predictive Modeling</p>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                        <TrendingDown className="w-5 h-5" />
                    </div>
                </div>

                <div className="h-48 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.weight_trajectory}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1F7A5C" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#1F7A5C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="day" hide />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#1F7A5C', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#1F7A5C"
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <ClipboardCheck className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-white/60">Clinical Summary</p>
                        </div>
                        <p className="text-[13px] text-slate-300 font-medium leading-relaxed">
                            {data.clinical_summary.clinician_note}
                        </p>
                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-primary italic uppercase tracking-widest">
                            Metabolic Grade: {data.clinical_summary.metabolic_grade}
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveInsights;
