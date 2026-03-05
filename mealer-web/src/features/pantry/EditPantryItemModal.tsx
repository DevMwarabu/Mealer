import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar } from 'lucide-react';
import api from '../../api/axios';

interface EditPantryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
}

const EditPantryItemModal: React.FC<EditPantryItemModalProps> = ({ isOpen, onClose, onSuccess, item }) => {
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        ingredient_id: '',
        quantity: 1,
        unit: 'kg',
        expiry_date: '',
        min_threshold: 0
    });

    useEffect(() => {
        if (isOpen && item) {
            setFormData({
                ingredient_id: item.ingredient_id,
                quantity: parseFloat(item.quantity),
                unit: item.unit,
                expiry_date: item.expiry_date || '',
                min_threshold: parseFloat(item.min_threshold || 0)
            });

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
    }, [isOpen, item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/pantry/${item.id}`, formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to update pantry item:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Adjust Inventory</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Item ID: #{item.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ingredient</label>
                        <select
                            value={formData.ingredient_id}
                            onChange={(e) => setFormData({ ...formData, ingredient_id: e.target.value })}
                            required
                            className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        >
                            <option value="">Select Ingredient</option>
                            {ingredients.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                                required
                                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            >
                                <option value="kg">Kilograms (kg)</option>
                                <option value="g">Grams (g)</option>
                                <option value="L">Liters (L)</option>
                                <option value="ml">Milliliters (ml)</option>
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="bunch">Bunch</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Min Threshold</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.min_threshold}
                                onChange={(e) => setFormData({ ...formData, min_threshold: parseFloat(e.target.value) })}
                                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="date"
                                    value={formData.expiry_date}
                                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Update Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPantryItemModal;
