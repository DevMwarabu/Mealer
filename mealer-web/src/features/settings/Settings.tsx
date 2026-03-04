import React from 'react';
import { User, Bell, Shield, MapPin, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SettingItem = ({ icon: Icon, title, sub, color }: any) => (
    <div className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-all cursor-pointer group border-b border-slate-50 last:border-0 first:rounded-t-[32px] last:rounded-b-[32px]">
        <div className="flex items-center gap-5">
            <div className={`p-3 rounded-2xl border ${color || 'bg-primary/5 text-primary border-primary/10'}`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{sub}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
);

const Settings: React.FC = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center">System Configuration</h1>
                <p className="text-slate-400 mt-1 font-medium text-sm">Personalize your intelligence layer and health thresholds.</p>
            </header>

            <div className="bg-slate-900 p-8 rounded-[40px] text-white flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-3xl font-black text-primary border border-white/10 relative z-10 shadow-inner">
                    {user?.name?.[0] || 'U'}
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold tracking-tight">{user?.name || 'Administrator'}</h2>
                    <p className="text-slate-400 text-xs font-medium mb-3">{user?.email}</p>
                    <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 flex items-center gap-1.5 w-fit">
                        <Sparkles className="w-3 h-3" />
                        Premium Intelligence
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-6">Personal Matrix</h3>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <SettingItem
                            icon={User}
                            title="Biological Profile"
                            sub="Update height, metabolic baseline, and dietary goals."
                        />
                        <SettingItem
                            icon={MapPin}
                            title="Regional Intelligence"
                            sub={`Currently set to ${user?.country || 'Kenya'}. Syncs local food prices.`}
                        />
                        <SettingItem
                            icon={Shield}
                            title="Data & Privacy"
                            sub="Manage anonymized neural health tracking settings."
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-6">System Preferences</h3>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <SettingItem
                            icon={Bell}
                            title="Alert Thresholds"
                            sub="Configure risk notifications for sodium, sugar, and budget."
                            color="bg-secondary/5 text-secondary border-secondary/10"
                        />
                        <SettingItem
                            icon={CreditCard}
                            title="Subscription & Billing"
                            sub="Current plan: Intelligence Tier Annual."
                            color="bg-accent/5 text-accent border-accent/10"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Mealer Clinical Edition v1.2.4</p>
            </div>
        </div>
    );
};

export default Settings;
