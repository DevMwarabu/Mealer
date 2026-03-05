import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Calendar, Store } from 'lucide-react';
import api from '../../api/axios';

interface AddPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [storeName, setStoreName] = useState('');
    const [purchasedAt, setPurchasedAt] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<any[]>([
        { ingredient_id: '', quantity: 1, price: 0, expiry_date: '' }
    ]);

    useEffect(() => {
        if (isOpen) {
            const fetchIngredients = async () => {
                try {
                    const response = await api.get('/groceries/ingredients');
                    setIngredients(response.data);
                } catch (err) {
                    console.error("Failed to fetch ingredients:", err);
                }
            };
            fetchIngredients();
        }
    }, [isOpen]);

    const addItem = () => {
        setItems([...items, { ingredient_id: '', quantity: 1, price: 0, expiry_date: '' }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/groceries', {
                store_name: storeName,
                purchased_at: purchasedAt,
                items: items.filter(i => i.ingredient_id && i.price > 0)
            });
            onSuccess();
            onClose();
            // Reset form
            setStoreName('');
            setItems([{ ingredient_id: '', quantity: 1, price: 0, expiry_date: '' }]);
        } catch (err) {
            console.error("Failed to save purchase:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Log Purchase</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1 italic">Fiscal Inventory Entry</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Establishment Name</label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="e.g. Carrefour, Local Mama Mboga"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Transaction Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="date"
                                    value={purchasedAt}
                                    onChange={(e) => setPurchasedAt(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900">Inventory Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 uppercase tracking-widest transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 items-end animate-in slide-in-from-right-2 duration-300">
                                    <div className="col-span-12 md:col-span-5 space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Ingredient</label>
                                        <select
                                            value={item.ingredient_id}
                                            onChange={(e) => updateItem(index, 'ingredient_id', e.target.value)}
                                            required
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-4 md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Qty</label>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                                        />
                                    </div>
                                    <div className="col-span-4 md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Price (KES)</label>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium font-mono"
                                        />
                                    </div>
                                    <div className="col-span-3 md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Expiry</label>
                                        <input
                                            type="date"
                                            value={item.expiry_date}
                                            onChange={(e) => updateItem(index, 'expiry_date', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center pb-1">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                            className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || items.some(i => !i.ingredient_id)}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Submit Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPurchaseModal;
