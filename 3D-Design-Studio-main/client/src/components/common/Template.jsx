import React from "react";
import { Layers2, ArrowUpRight, Terminal, Globe, Flame, Sparkles } from "lucide-react";

export default function TemplatesShowcase() {
    const templates = [
        {
            title: "Meridian",
            subtitle: "Cinematic scroll",
            subdomain: "meridian.draftly.space",
            tags: ["Scroll Theatre", "Volume dash", "Textures"],
            color: "from-blue-500 to-indigo-600",
            glow: "group-hover:border-blue-500/30 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070"
        },
        {
            title: "TripVault",
            subtitle: "Travel Experience",
            subdomain: "tripvault.draftly.space",
            tags: ["Travel", "SaaS", "Glass Sky"],
            color: "from-cyan-400 to-blue-500",
            glow: "group-hover:border-cyan-500/30 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"
        },
        {
            title: "Shopnest",
            subtitle: "Ecommerce Platform",
            subdomain: "shopnest.draftly.space",
            tags: ["Ecommerce", "Framer", "3D Objects"],
            color: "from-pink-500 to-rose-600",
            glow: "group-hover:border-pink-500/30 group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070"
        },
        {
            title: "OrbitCRM",
            subtitle: "Agency CRM",
            subdomain: "orbitcrm.draftly.space",
            tags: ["Agency", "Glass UI", "Nebula V2"],
            color: "from-purple-500 to-indigo-500",
            glow: "group-hover:border-purple-500/30 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070"
        },
        {
            title: "SyncBase",
            subtitle: "Team Collaboration",
            subdomain: "syncbase.draftly.space",
            tags: ["Productivity", "SaaS", "Light UI"],
            color: "from-emerald-400 to-teal-500",
            glow: "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_40px_rgba(52,211,153,0.15)]",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
        },
        {
            title: "StackForge",
            subtitle: "Dev Platform",
            subdomain: "stackforge.draftly.space",
            tags: ["Dev Tools", "Dark", "Bold World"],
            color: "from-violet-500 to-fuchsia-500",
            glow: "group-hover:border-violet-500/30 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
            image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=2070"
        },
        {
            title: "VisionForge",
            subtitle: "AI Video Studio",
            subdomain: "visionforge.draftly.space",
            tags: ["AI", "Video", "Cinematic"],
            color: "from-amber-500 to-orange-600",
            glow: "group-hover:border-amber-500/30 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
            image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2070"
        }
    ];

    return (
        <section id="templates" className="w-full bg-black text-white py-32 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="max-w-3xl mb-24">
                    <div className="inline-flex items-center gap-1.5 mb-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
                        <Layers2 className="h-3 w-3 text-zinc-600" />
                        PRODUCTION BLUEPRINTS
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Immersive scroll-reactive templates
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-xl">
                        Seven cinematic 3D starters. AI generates motion, extracts frames, and ships deployment-ready sites instantly.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((tmpl, index) => (
                        <div
                            key={index}
                            className={`group rounded-3xl border border-zinc-900 bg-zinc-950/30 overflow-hidden flex flex-col transition-all duration-500 ${tmpl.glow} ${index % 3 === 1 ? "lg:translate-y-8" : index % 3 === 2 ? "lg:translate-y-16" : ""}`}
                        >
                            {/* Website Preview Image */}
                            <div className="relative h-64 bg-zinc-950 overflow-hidden border-b border-zinc-800">
                                <img
                                    src={tmpl.image}
                                    alt={`${tmpl.title} website preview`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                
                                {/* Browser-like top bar */}
                                <div className="absolute top-0 left-0 right-0 h-6 bg-black/70 flex items-center px-3 gap-1.5">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-[10px] font-mono rounded-full flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    LIVE
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-7 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-white transition-colors">
                                            {tmpl.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm mt-1">{tmpl.subtitle}</p>
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
                                        v1.0.4
                                    </div>
                                </div>

                                <div className="font-mono text-xs text-zinc-500 flex items-center gap-2 mb-6 bg-black/50 p-3 rounded-2xl border border-zinc-900">
                                    <Terminal className="h-3.5 w-3.5" />
                                    {tmpl.subdomain}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {tmpl.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="mt-auto w-full relative overflow-hidden group/btn rounded-2xl bg-zinc-900 border border-zinc-700 p-4 flex items-center justify-between text-sm font-semibold hover:border-zinc-500 transition-all">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${tmpl.color} opacity-10 group-hover/btn:opacity-20`} />
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Flame className="h-4 w-4" />
                                        Launch Blueprint
                                    </span>
                                    <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all relative z-10" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="flex flex-col items-center mt-28 text-center">
                    <a href="#3d-builder">
                        <button className="flex items-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-2xl hover:bg-zinc-100 transition-all group shadow-2xl">
                            <Sparkles className="h-5 w-5" />
                            Open Interactive 3D Builder
                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </a>
                    <p className="text-zinc-600 text-xs font-mono mt-6 tracking-widest">
                        Click any template to load into the AI pipeline
                    </p>
                </div>
            </div>
        </section>
    );
}