import React from 'react';

interface Props {
    score: number;
    status: string;
}

const HealthScore: React.FC<Props> = ({ score, status }) => {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-success';
        if (s >= 60) return 'text-accent';
        return 'text-danger';
    };

    const getBg = (s: number) => {
        if (s >= 80) return 'bg-success/5 border-success/10';
        if (s >= 60) return 'bg-accent/5 border-accent/10';
        return 'bg-danger/5 border-danger/10';
    };

    const getOuterRing = (s: number) => {
        if (s >= 80) return 'ring-success/20 shadow-success/10';
        if (s >= 60) return 'ring-accent/20 shadow-accent/10';
        return 'ring-danger/20 shadow-danger/10';
    }

    return (
        <div className={`relative overflow-hidden p-8 rounded-[32px] ring-1 inset-ring ${getBg(score)} ${getOuterRing(score)} shadow-2xl flex flex-col items-center justify-center text-center space-y-3 transition-all duration-700 hover:scale-[1.02]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -mr-10 -mt-10 ${getColor(score).replace('text-', 'bg-')}/30 pointer-events-none`} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">Neural Health Index</span>
            <div className={`text-7xl font-black tracking-tighter ${getColor(score)} drop-shadow-sm relative z-10`}>
                {score}
            </div>
            <div className="flex items-center gap-2 mt-1 relative z-10 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <div className={`w-1.5 h-1.5 rounded-full ${getColor(score).replace('text', 'bg')} animate-pulse shadow-[0_0_10px_currentColor]`} />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">{status}</span>
            </div>
        </div>
    );
};

export default HealthScore;
