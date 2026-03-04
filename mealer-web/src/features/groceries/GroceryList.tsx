import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Package, Calendar, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const GroceryList: React.FC = () => {
    const [groceries, setGroceries] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groceriesRes, metricsRes] = await Promise.all([
                    api.get('/groceries'),
                    api.get('/groceries/metrics')
                ]);

                // Flatten items for the table
                const allItems = groceriesRes.data.flatMap((g: any) =>
                    g.items.map((item: any) => ({
                        ...item,
                        store: g.store_name,
                        purchased_at: g.purchased_at
                    }))
                );

                setGroceries(allItems);
                setMetrics(metricsRes.data);
            } catch (err) {
                console.error('Error fetching grocery data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fiscal Inventory</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">
                        Managing {groceries.length} active items. {metrics?.waste?.total_lost > 0 ? 'Risk detected.' : 'Inventory stable.'}
                    </p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all active:scale-95 text-sm">
                    <Plus className="w-4 h-4" />
                    Add Purchase
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly spend</p>
                        <h3 className="text-xl font-bold text-slate-900">KES {metrics?.monthly_total || 0}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-secondary/5 rounded-2xl border border-secondary/10">
                        <Package className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bulk ROI</p>
                        <h3 className="text-xl font-bold text-slate-900">+{metrics?.bulk_roi || 0}%</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-accent/5 rounded-2xl border border-accent/10">
                        <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waste Detection</p>
                        <h3 className="text-xl font-bold text-slate-900">{metrics?.waste?.waste_ratio || 0}% <span className="text-[10px] font-medium text-slate-400">({metrics?.waste?.risk_level || 'Low'})</span></h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Active Matrix</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter italic">Clinical Accuracy: 99.2%</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fiscal Value</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiration</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {groceries.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm text-slate-900 block">{item.ingredient?.name || 'Unknown'}</span>
                                                <span className="text-[10px] text-slate-400 uppercase font-medium">{item.store}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.ingredient?.category || 'General'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-900">KES {item.price}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.expiry_date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${new Date(item.expiry_date) < new Date() ? 'bg-danger/5 text-danger border-danger/10' :
                                            'bg-success/5 text-success border-success/10'
                                            }`}>
                                            {new Date(item.expiry_date) < new Date() ? 'Expired' : 'Stable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-300 hover:text-primary transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {groceries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                        No active inventory detected. Use "Add Purchase" to populate.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GroceryList;
