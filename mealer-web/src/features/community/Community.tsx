import React, { useState, useEffect } from 'react';
import { Users, Heart, Share2, Eye, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const Community: React.FC = () => {
    const [feed, setFeed] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await api.get('/community/feed');
                setFeed(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
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
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/10">
                    <Users className="w-3 h-3" />
                    Global Knowledge Base
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Community Intelligence</h1>
                <p className="text-slate-500 mt-2 font-medium">Discover optimized meal architectures shared by the global network.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {feed.trending.map((recipe: any) => (
                        <div key={recipe.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900 text-white font-bold flex items-center justify-center rounded-full shadow-inner">
                                        {recipe.author[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{recipe.author}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shared Model</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {recipe.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-secondary/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">{recipe.name}</h3>

                            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Health Quality</p>
                                    <p className="font-black text-primary">{recipe.health_score}/100</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated Cost</p>
                                    <p className="font-black text-slate-900">{recipe.cost}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-danger font-bold text-sm transition-colors">
                                    <Heart className="w-4 h-4" /> {recipe.likes}
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary font-bold text-sm transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                        <h4 className="font-bold text-[10px] uppercase tracking-widest opacity-60 mb-6 relative z-10">Your Shared Modules</h4>
                        <div className="space-y-4 relative z-10">
                            {feed.user_shared.map((item: any) => (
                                <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
                                    <h5 className="font-bold text-white mb-2">{item.name}</h5>
                                    <div className="flex gap-4 text-xs font-bold opacity-60">
                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {item.likes}</span>
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors">
                            Publish New Architecture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
