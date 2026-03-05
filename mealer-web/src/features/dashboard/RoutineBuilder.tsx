import React from 'react';
import { Clock, Droplets, CheckCircle2, Bell } from 'lucide-react';

const RoutineBuilder: React.FC = () => {
    const routines = [
        { time: '07:30 AM', label: 'Metabolic Breakfast', type: 'Meal', completed: true },
        { time: '10:00 AM', label: 'Hydration Window', type: 'Water', completed: false },
        { time: '01:00 PM', label: 'Anti-Inflammatory Lunch', type: 'Meal', completed: false },
        { time: '04:00 PM', label: 'High-Protein Snack', type: 'Snack', completed: false },
    ];

    return (
        <div className="bg-white/90 backdrop-blur-3xl rounded-[32px] ring-1 inset-ring ring-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group transition-all duration-500 hover:shadow-slate-300/50 hover:-translate-y-1">
            <div className="p-8 pb-6 border-b border-slate-50/50 bg-gradient-to-br from-white to-slate-50/30">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-500 rounded-[18px] border border-rose-100 shadow-sm">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Daily Routine</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Habit Reinforcement</p>
                        </div>
                    </div>
                    <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    {routines.map((routine, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-[20px] transition-all group/item ${routine.completed ? 'bg-gradient-to-r from-emerald-50/50 to-transparent border border-emerald-100/50 shadow-sm' : 'bg-white border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-black text-[11px] shadow-inner transition-colors ${routine.type === 'Water' ? 'bg-blue-50/80 text-blue-500 group-hover/item:bg-blue-100/80' : 'bg-slate-50 text-slate-500 group-hover/item:bg-rose-50 group-hover/item:text-rose-500'
                                    }`}>
                                    {routine.type === 'Water' ? <Droplets className="w-5 h-5" /> : routine.time.split(' ')[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{routine.label}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{routine.time}</p>
                                </div>
                            </div>
                            <button className={`p-2.5 rounded-xl transition-all ${routine.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:shadow-sm'
                                }`}>
                                <CheckCircle2 className="w-5 h-5" strokeWidth={routine.completed ? 3 : 2} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-gradient-to-t from-slate-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hydration Matrix</p>
                        <p className="text-[15px] font-black text-slate-800 mt-1 tracking-tight">1,200ml <span className="text-sm font-bold text-slate-400 ml-1/2">/ 2.5L</span></p>
                    </div>
                    <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all relative" style={{ width: '48%' }}>
                            <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutineBuilder;
