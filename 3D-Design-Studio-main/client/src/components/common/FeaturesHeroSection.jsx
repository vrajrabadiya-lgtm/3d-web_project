import React from "react";
import { Layers, Video, Clock, Code2, Sparkles } from "lucide-react";

export default function FeaturesHeroSection() {
    const stats = [
        {
            icon: Layers,
            value: "400+",
            label: "Frames per Site",
        },
        {
            icon: Video,
            value: "~8s",
            label: "Video Duration",
        },
        {
            icon: Clock,
            value: "10–40",
            label: "Adjustable FPS",
        },
        {
            icon: Code2,
            value: "ZIP",
            label: "Ready to Deploy",
        },
    ];

    return (
        <section id="features-hero" className="w-full bg-black text-white py-24 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto">
                {/* Large Inner Card Container to match the rounded backdrop container look */}
                <div className="w-full rounded-[2.5rem] bg-gradient-to-b from-zinc-950 to-black border border-zinc-900/60 p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[2xl]">

                    {/* Subtle upper corner ambient glow effect */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

                    {/* Left Column: Typography & Actions */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-zinc-100">
                            Build 3D websites <br />
                            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">10x faster</span> with AI
                        </h2>

                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mb-10 font-medium opacity-80">
                            Describe what you want once. Draftly generates cinematic motion, extracts frames, and builds a scroll-driven 3D website in minutes — not days. Download the ZIP and ship.
                        </p>

                        {/* CTA Buttons Layout */}
                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 bg-white text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 w-full sm:w-auto">
                                <Sparkles className="h-4 w-4 fill-black" />
                                <span>Start Building Free</span>
                            </button>
                            <button className="flex items-center justify-center font-semibold text-xs sm:text-sm text-zinc-300 hover:text-white px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all w-full sm:w-auto">
                                View Pricing
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Mini Stats Grid */}
                    <div className="w-full lg:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
                        {stats.map((stat, index) => {
                            const StatIcon = stat.icon;

                            return (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl border border-zinc-900/80 bg-zinc-950/40 backdrop-blur-sm flex flex-col justify-between min-h-[140px] transition-all duration-300 group hover:border-zinc-800 hover:bg-zinc-950"
                                >
                                    {/* Icon */}
                                    <StatIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400 transition-colors mb-4" />

                                    {/* Numbers/Values */}
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors mb-1">
                                            {stat.value}
                                        </div>
                                        {/* Meta Label */}
                                        <span className="text-[10px] font-medium tracking-wide text-zinc-500 block">
                                            {stat.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}