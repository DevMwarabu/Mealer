import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<any[]>([
        { text: "Hello! I'm your Mealer Assistant. Ask me anything about your nutrition, budget, or today's plan.", isBot: true }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!query.trim() || loading) return;

        const userMsg = query;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setQuery('');
        setLoading(true);

        try {
            const res = await api.post('/ai/assistant/ask', { query: userMsg });
            setMessages(prev => [...prev, { text: res.data.response, isBot: true, suggestion: res.data.suggestion }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my neural core right now.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="bg-white w-96 h-[500px] rounded-[32px] border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <header className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">Mealer Intelligence</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Neural Core Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </header>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.isBot
                                        ? 'bg-white border border-slate-100 text-slate-700 shadow-sm'
                                        : 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                                    }`}>
                                    {msg.text}
                                    {msg.suggestion && (
                                        <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">AI Recommendation</p>
                                            <p className="font-bold text-slate-900">{msg.suggestion.name}</p>
                                            <button className="mt-2 w-full py-2 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-primary/90 transition-all">
                                                Add to Plan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="p-4 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your nutrition..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </footer>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-5 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-all relative group"
                >
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                    <MessageSquare className="w-6 h-6 relative z-10" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-bounce" />
                </button>
            )}
        </div>
    );
};

export default AIAssistant;
