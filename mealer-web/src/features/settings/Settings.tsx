import React, { useState } from 'react';
import { User, Bell, Shield, MapPin, CreditCard, ChevronRight, Sparkles, Loader2, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const SettingItem = ({ icon: Icon, title, sub, color, onClick }: any) => (
    <div
        onClick={onClick}
        className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-all cursor-pointer group border-b border-slate-50 last:border-0 first:rounded-t-[32px] last:rounded-b-[32px]"
    >
        <div className="flex items-center gap-5">
            <div className={`p-3 rounded-2xl border ${color || 'bg-primary/5 text-primary border-primary/10'}`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{sub}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
);

const EditProfileModal = ({ isOpen, onClose, user, onSave }: any) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        height: user?.height || '',
        weight: user?.weight || '',
        daily_calorie_target: user?.daily_calorie_target || '',
        country: user?.country || 'Kenya'
    });
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:8000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSave(res.data.user);
            onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Edit Biological Profile</h2>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Recalculate Metabolic Intelligence</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Regional Context</label>
                            <select
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                            >
                                <option value="Kenya">Kenya (KES)</option>
                                <option value="USA">USA (USD)</option>
                                <option value="UK">UK (GBP)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Height (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={e => setFormData({ ...formData, height: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Cap (kcal)</label>
                            <input
                                type="number"
                                value={formData.daily_calorie_target}
                                onChange={e => setFormData({ ...formData, daily_calorie_target: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        disabled={saving}
                        className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary transition-all flex items-center justify-center gap-3 group"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save & Recalibrate Matrix
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Settings: React.FC = () => {
    const { user, setUser } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center">System Configuration</h1>
                <p className="text-slate-400 mt-1 font-medium text-sm">Personalize your intelligence layer and health thresholds.</p>
            </header>

            <div className="bg-slate-900 p-8 rounded-[40px] text-white flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-3xl font-black text-primary border border-white/10 relative z-10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
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
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="ml-auto bg-white/5 hover:bg-white/10 p-4 rounded-3xl border border-white/5 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-6">Personal Matrix</h3>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <SettingItem
                            icon={User}
                            title="Biological Profile"
                            sub={`${user?.height || '--'}cm / ${user?.weight || '--'}kg. ${user?.daily_calorie_target || '--'} kcal cap.`}
                            onClick={() => setIsEditModalOpen(true)}
                        />
                        <SettingItem
                            icon={MapPin}
                            title="Regional Intelligence"
                            sub={`Currently set to ${user?.country || 'Kenya'}. Syncs local food prices.`}
                            onClick={() => setIsEditModalOpen(true)}
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

            <EditProfileModal
                isOpen={isEditModalOpen}
                user={user}
                onClose={() => setIsEditModalOpen(false)}
                onSave={(updatedUser: any) => setUser(updatedUser)}
            />
        </div>
    );
};

export default Settings;
