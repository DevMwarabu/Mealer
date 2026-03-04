import React, { useState, useEffect } from 'react';
import { Archive, Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const PantryInventory: React.FC = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPantry = async () => {
            try {
                const res = await api.get('/pantry');
                setInventory(res.data.inventory);
                setMetrics(res.data.metrics);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPantry();
    }, []);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Archive className="w-8 h-8 text-primary" />
                        Pantry Intelligence
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Real-time inventory tracking and expiration alerts.</p>
                </div>
                <button className="bg-primary text-white flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus className="w-6 h-6" />
                </button>
            </header>

            {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Items', value: metrics.total_items },
                        { label: 'Low Stock', value: metrics.low_stock, alert: true },
                        { label: 'Expiring Soon', value: metrics.expiring_soon, warning: true },
                        { label: 'Waste Prevented', value: metrics.waste_prevented_value, success: true },
                    ].map((stat, i) => (
                        <div key={i} className={`p-6 bg-white rounded-3xl border ${stat.alert ? 'border-danger/30 bg-danger/5' : stat.warning ? 'border-warning/30 bg-warning/5' : stat.success ? 'border-success/30 bg-success/5' : 'border-slate-100'} shadow-sm`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${stat.alert ? 'text-danger' : stat.warning ? 'text-warning' : stat.success ? 'text-success' : 'text-slate-400'}`}>{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {inventory.map((item) => (
                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm border ${item.status === 'Low' ? 'bg-danger/10 text-danger border-danger/20' : item.status === 'Warning' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                                    {item.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{item.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">Expires: {new Date(item.expiry_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {item.status !== 'Good' && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/50 border border-slate-200/50">
                                        <AlertCircle className={`w-3.5 h-3.5 ${item.status === 'Low' ? 'text-danger' : 'text-warning'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.status}</span>
                                    </div>
                                )}
                                <div className="text-right w-24">
                                    <p className="font-black text-slate-900 text-lg">{item.quantity}<span className="text-xs ml-1 opacity-50 font-bold">{item.unit}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PantryInventory;
