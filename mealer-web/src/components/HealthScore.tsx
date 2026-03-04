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

    return (
        <div className={`p-8 rounded-[32px] border ${getBg(score)} flex flex-col items-center justify-center text-center space-y-2 transition-all duration-500`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neural Health Index</span>
            <div className={`text-6xl font-black tracking-tighter ${getColor(score)}`}>
                {score}
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${getColor(score).replace('text', 'bg')} animate-pulse`} />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{status}</span>
            </div>
        </div>
    );
};

export default HealthScore;
