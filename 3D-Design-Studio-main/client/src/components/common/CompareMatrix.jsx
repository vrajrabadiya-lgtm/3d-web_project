import React from "react";
import { Check, Minus } from "lucide-react";

export default function CompareMatrix() {
    const rows = [
        { metric: "Website presets gallery", ornitech: "50+ templates", framework: "—" },
        { metric: "AI prompt-to-site", ornitech: "Full pipeline", framework: "Partial" },
        { metric: "3D motion architecture", ornitech: "Native scroll frames", framework: "WebGL (Heavy Tax)" },
        { metric: "Code asset export style", ornitech: "HTML / Tailwind / JS", framework: "Locked ecosystems" },
        { metric: "Hosting obligations", ornitech: "Completely Optional", framework: "Bundled mandatory" },
    ];

    return (
        <section className="w-full bg-black text-white py-24 px-6 border-t border-zinc-900">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-12 text-center">Where Ornitech fits in the stack</h3>

                <div className="w-full overflow-x-auto border border-zinc-900 rounded-xl bg-zinc-950/40">
                    <table className="w-full min-w-[600px] text-left border-collapse text-xs font-medium">
                        <thead>
                            <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] font-bold tracking-wider uppercase">
                                <th className="p-4">Capability Metric</th>
                                <th className="p-4 text-white font-black bg-zinc-900/30">Ornitech Core</th>
                                <th className="p-4">Traditional Builders</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-900/10 transition-colors">
                                    <td className="p-4 text-zinc-300">{row.metric}</td>
                                    <td className="p-4 text-zinc-100 font-semibold bg-zinc-900/20 border-x border-zinc-900/40">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-3.5 w-3.5 text-blue-500 stroke-[3]" />
                                            <span>{row.ornitech}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Minus className="h-3.5 w-3.5 text-zinc-700" />
                                            <span>{row.framework}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}