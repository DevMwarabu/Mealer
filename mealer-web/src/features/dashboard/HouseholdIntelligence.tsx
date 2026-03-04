import React from 'react';
import { Users, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const HouseholdIntelligence: React.FC<{ data: any }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="p-8 border-b border-slate-50">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl border border-secondary/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg tracking-tight">Household Coordination</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Family Intelligence Hub</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold uppercase tracking-widest border border-success/20 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        Sync Active
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Collective Remaining</p>
                        <p className="text-xl font-black text-slate-900 leading-none">KES {data.collective_remaining}</p>
                    </div>
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Portion Scaling</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{data.family_portions}x <span className="text-[10px] text-slate-400">Yield</span></p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-900 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[12px] font-medium text-slate-200">{data.shared_grocery_alert}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 group-hover/item:translate-x-1 transition-transform inline-flex items-center gap-1">
                            View Shared List <ArrowRight className="w-3 h-3" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseholdIntelligence;
