import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] relative overflow-hidden">
            {/* Intelligent Data Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#1F7A5C 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Clinical Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse duration-[10s]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] animate-pulse duration-[8s]" />

            <div className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(31,122,92,0.1)] border border-slate-100/80 z-10 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary opacity-80" />

                <div className="p-10">
                    <div className="flex justify-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500 group">
                            <span className="text-3xl font-black text-white group-hover:scale-110 transition-transform">M</span>
                        </div>
                    </div>
                    <Outlet />

                    {/* Trust Footer */}
                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                            Mealer Intelligence Layer • Secure Access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
