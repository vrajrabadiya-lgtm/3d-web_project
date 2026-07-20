import React, { useState } from "react";
import { Play, Mic, ChevronDown, Send, Box, Layers, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HeroSection() {
    const [prompt, setPrompt] = useState("");

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans select-none">

            {/* Background Media Container (Replace the src with your own video/image asset path later) */}
            <div className="absolute inset-0 w-full h-full z-0">
                <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
                    alt="Cinematic Background"
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                />
                {/* Subtle overlay matching the original depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            {/* Main Content Workspace Layer */}
            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center mt-20">

                {/* 1. Watch Demo Floating Pill */}
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/60 hover:bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide shadow-lg transition-all duration-200 mb-6 group transform hover:scale-[1.02]">
                    <Play className="h-3.5 w-3.5 fill-white text-white group-hover:scale-110 transition-transform" />
                    <span>Watch demo</span>
                </button>

                {/* 2. Central Specialized AI Prompt Panel */}
                <div className="w-full max-w-2xl bg-[#0d111c]/90 backdrop-blur-xl border border-zinc-800/60 rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] p-3 text-left mb-6">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your website..."
                        className="w-full min-h-[70px] bg-transparent text-white text-sm placeholder-zinc-500 resize-none border-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 pt-1 shadow-none"
                    />

                    {/* Action Toolbar Inside Prompt Box */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 mt-2">
                        <div className="flex items-center gap-2">
                            {/* Voice Prompt Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                            >
                                <Mic className="h-4 w-4" />
                            </Button>

                            {/* Build Dropdown Pill */}
                            <Button
                                variant="outline"
                                className="h-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors shadow-none"
                            >
                                <span>Build</span>
                                <ChevronDown className="h-3 w-3 text-zinc-500" />
                            </Button>

                            {/* Asset Mode Dropdown Pill */}
                            <Button
                                variant="outline"
                                className="h-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors shadow-none"
                            >
                                <span>Image and Video</span>
                                <ChevronDown className="h-3 w-3 text-zinc-500" />
                            </Button>
                        </div>

                        {/* Submit Start Button */}
                        <Button
                            disabled={!prompt.trim()}
                            className="h-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-40 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 disabled:text-zinc-400 transition-all shadow-none"
                        >
                            <Send className="h-3 w-3" />
                            <span>Start</span>
                        </Button>
                    </div>
                </div>

                {/* Small Notice Label Beneath input block */}
                <p className="text-[10px] font-medium text-zinc-400/80 tracking-wide mb-8">
                    One hero image · One motion video · Scroll-sync prototype (Sign out required)
                </p>

                {/* 3. Bottom Dual Execution Links */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    {/* White Builder Button */}
                    <a href="#3d-builder" className="w-full sm:w-auto">
                        <Button className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] h-auto px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 shadow-xl transition-all duration-200">
                            <Box className="h-4 w-4 stroke-[2.5]" />
                            <span>3D Website Builder</span>
                            <span className="text-xs font-bold ml-0.5">→</span>
                        </Button>
                    </a>

                    {/* Blue Preset Button */}
                    <Button className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] h-auto px-6 py-3 rounded-full bg-[#3b82f6] text-white font-semibold text-sm hover:bg-blue-600 shadow-xl shadow-blue-600/10 transition-all duration-200">
                        <Layers className="h-4 w-4" />
                        <span>Build from Preset</span>
                    </Button>
                </div>

            </div>

            {/* 4. Scroll Helper Text Target Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 pointer-events-none">
                <span className="text-[10px] font-bold text-white tracking-[0.25em] uppercase">Scroll</span>
            </div>

            {/* 5. Floating Bottom Right Guide Button */}
            <Button className="fixed bottom-6 right-6 z-50 h-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black text-xs font-bold shadow-2xl hover:bg-zinc-100 transition-all">
                <HelpCircle className="h-4 w-4 text-purple-600 stroke-[2.5]" />
                <span>Guide</span>
            </Button>

        </section>
    );
}