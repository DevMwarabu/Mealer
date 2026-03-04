import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard,
    Utensils,
    Calendar,
    ShoppingCart,
    Settings,
    LogOut,
    Sparkles,
    PieChart,
    Users,
    Archive,
    Award,
    Zap
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Utensils, label: 'Log Meal', path: '/meals/log' },
        { icon: Calendar, label: 'AI Planner', path: '/planner' },
        { icon: ShoppingCart, label: 'Groceries', path: '/groceries' },
        { icon: Archive, label: 'Pantry', path: '/pantry' },
        { icon: Zap, label: 'Simulations', path: '/simulations' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Users, label: 'Community', path: '/community' },
        { icon: Award, label: 'Rewards', path: '/rewards' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 overflow-y-auto">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-xl font-black text-white">M</span>
                </div>
                <div>
                    <h2 className="font-bold text-lg leading-none text-slate-900 tracking-tight">Mealer</h2>
                    <span className="text-[10px] text-primary font-bold tracking-tighter uppercase">Intelligence Layer</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-slate-50 text-primary font-bold shadow-sm border border-slate-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-primary' : 'text-slate-400'}`} strokeWidth={2} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 group cursor-pointer relative overflow-hidden">
                    <Sparkles className="w-4 h-4 text-primary absolute top-3 right-3 animate-pulse" />
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Country Aware</p>
                    <p className="text-sm font-bold text-slate-900">{user?.country || 'Kenya'} mode</p>
                </div>

                <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold shadow-sm">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="max-w-[120px]">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
