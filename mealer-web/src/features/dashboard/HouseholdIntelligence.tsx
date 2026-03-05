import React from 'react';
import { Users, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const HouseholdIntelligence: React.FC<{ data: any }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white/90 backdrop-blur-3xl rounded-[32px] ring-1 inset-ring ring-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group transition-all duration-500 hover:shadow-slate-300/50 hover:-translate-y-1">
            <div className="p-8 border-b border-slate-50/50 bg-gradient-to-br from-white to-slate-50/30">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-[18px] border border-indigo-100 shadow-sm">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Household Matrix</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Family Coordination Hub</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-success/10 text-success rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-4 h-4" />
                        Sync Active
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group/item hover:border-indigo-100 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full blur-xl -mr-4 -mt-4 transition-colors duration-500 group-hover/item:bg-indigo-100/50" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Collective Buffer</p>
                        <p className="text-2xl font-black text-slate-800 leading-none relative z-10 tracking-tight"><span className="text-sm font-bold text-slate-400">KES</span> {data.collective_remaining}</p>
                    </div>
                    <div className="p-5 bg-white rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group/item hover:border-emerald-100 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full blur-xl -mr-4 -mt-4 transition-colors duration-500 group-hover/item:bg-emerald-100/50" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Portion Yield</p>
                        <p className="text-2xl font-black text-slate-800 leading-none relative z-10 tracking-tight">{data.family_portions}<span className="text-lg font-bold text-slate-400">x</span> <span className="text-[10px] text-slate-400 uppercase tracking-widest relative -top-1">Scale</span></p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 space-y-4 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item relative z-10">
                    <div className="p-2.5 bg-indigo-500/30 text-indigo-200 rounded-xl shadow-inner">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-200 leading-snug">{data.shared_grocery_alert}</p>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-2 group-hover/item:translate-x-1 transition-transform inline-flex items-center gap-1">
                            View Shared List <ArrowRight className="w-3 h-3" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseholdIntelligence;
