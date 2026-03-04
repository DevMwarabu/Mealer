import React, { useState, useEffect } from 'react';
import { Target, Flame, Trophy, Award, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const Rewards: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGamification = async () => {
            try {
                const res = await api.get('/gamification/dashboard');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGamification();
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
            <header className="bg-slate-900 text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/20">
                        <Trophy className="w-3.5 h-3.5 text-accent" />
                        Level {data.level}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">{data.title}</h1>
                    <p className="text-slate-400 font-medium">{data.next_level_points - data.points} points to next rank</p>
                </div>
                <div className="mt-8 md:mt-0 relative z-10 text-center md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-80">Total Score</p>
                    <p className="text-6xl font-black text-accent tracking-tighter drop-shadow-md">{data.points.toLocaleString()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 ml-2">
                        <Award className="w-4 h-4 text-primary" />
                        Earned Badges
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {data.badges.map((badge: any) => (
                            <div key={badge.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center group hover:border-primary/20 hover:shadow-md transition-all cursor-default">
                                <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    {badge.icon === 'Flame' && <Flame className="w-8 h-8 text-danger" />}
                                    {badge.icon === 'Target' && <Target className="w-8 h-8 text-primary" />}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1 leading-tight">{badge.name}</h4>
                                <p className="text-[10px] text-slate-400 font-medium px-2">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 ml-2">
                        <Target className="w-4 h-4 text-secondary" />
                        Active Challenges
                    </h3>
                    <div className="space-y-4">
                        {data.active_challenges.map((challenge: any) => (
                            <div key={challenge.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{challenge.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{challenge.description}</p>
                                    </div>
                                    <span className="bg-accent/10 font-black text-accent text-xs px-3 py-1 rounded-full border border-accent/20">+{challenge.reward}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{challenge.progress}% Complete</span>
                                        <span>{challenge.days_left} Days Left</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full" style={{ width: `${challenge.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
