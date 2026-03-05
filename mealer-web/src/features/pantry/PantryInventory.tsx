import React, { useState, useEffect } from 'react';
import { Archive, Plus, Search, AlertCircle, Loader2, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import AddPantryItemModal from './AddPantryItemModal';
import EditPantryItemModal from './EditPantryItemModal';
import DeleteConfirmModal from '../groceries/DeleteConfirmModal';

const PantryInventory: React.FC = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

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

    useEffect(() => {
        fetchPantry();
    }, []);

    const handleSuccess = () => {
        fetchPantry();
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setDeletingId(itemToDelete.id);
        try {
            await api.delete(`/pantry/${itemToDelete.id}`);
            handleSuccess();
            setItemToDelete(null);
        } catch (err) {
            console.error('Failed to delete pantry item:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Stock Pantry
                </button>
            </header>

            <AddPantryItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <EditPantryItemModal
                isOpen={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSuccess={handleSuccess}
            />

            <DeleteConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                isDeleting={deletingId === itemToDelete?.id}
                title="Remove Stock"
                message={`Are you sure you want to remove ${itemToDelete?.name} from your pantry?`}
            />

            {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Items', value: metrics.total_items },
                        { label: 'Low Stock', value: metrics.low_stock, alert: metrics.low_stock > 0 },
                        { label: 'Expiring Soon', value: metrics.expiring_soon, warning: metrics.expiring_soon > 0 },
                        { label: 'Waste Prevented', value: metrics.waste_prevented_value, success: true },
                    ].map((stat, i) => (
                        <div key={i} className={`p-6 bg-white rounded-3xl border ${stat.alert ? 'border-danger/30 bg-danger/5' : stat.warning ? 'border-warning/30 bg-warning/5' : stat.success ? 'border-success/30 bg-success/5' : 'border-slate-100'} shadow-sm transition-all hover:shadow-md`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${stat.alert ? 'text-danger' : stat.warning ? 'text-warning' : stat.success ? 'text-success' : 'text-slate-400'}`}>{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Inventory</span>
                </div>
                <div className="divide-y divide-slate-50">
                    {filteredInventory.map((item) => (
                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm border transition-colors ${item.status === 'Low' ? 'bg-danger/10 text-danger border-danger/20' :
                                    item.status === 'Warning' ? 'bg-warning/10 text-warning border-warning/20' :
                                        'bg-primary/5 text-primary border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary'
                                    }`}>
                                    {item.name[0]}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        Expires: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Expiry'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                {item.status !== 'Good' && (
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${item.status === 'Low' ? 'bg-danger/5 border-danger/10' : 'bg-warning/5 border-warning/10'
                                        }`}>
                                        <AlertCircle className={`w-3.5 h-3.5 ${item.status === 'Low' ? 'text-danger' : 'text-warning'}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'Low' ? 'text-danger' : 'text-warning'
                                            }`}>{item.status}</span>
                                    </div>
                                )}
                                <div className="text-right w-24">
                                    <p className="font-black text-slate-900 text-lg tracking-tight">
                                        {item.quantity}
                                        <span className="text-xs ml-1 text-slate-400 font-bold uppercase">{item.unit}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                        title="Edit Item"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setItemToDelete(item)}
                                        disabled={deletingId === item.id}
                                        className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                        title="Remove Item"
                                    >
                                        {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredInventory.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                                <Archive className="w-8 h-8" />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">No inventory items found. Add some stock to your pantry.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PantryInventory;
