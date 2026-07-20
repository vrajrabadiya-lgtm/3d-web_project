import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float } from "@react-three/drei";
import { Layers, Sliders, Code2, Sparkles, Check, Copy } from "lucide-react";
import * as THREE from "three";

// Fully dynamic interactive 3D model reacting directly to the zero-code control panel variables
function PreviewMesh({ depth, rounding, speed, color }) {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed;
        // Interactive dynamic rotations
        meshRef.current.rotation.x = Math.sin(t / 2) * 0.4;
        meshRef.current.rotation.y = t * 0.3;
        meshRef.current.rotation.z = Math.cos(t / 3) * 0.2;
    });

    return (
        <mesh ref={meshRef}>
            {/* Geometry shifts dynamically between a smooth torus knot and a sharp box based on structural settings */}
            {rounding > 50 ? (
                <torusKnotGeometry args={[1.2, 0.4, 150, 16, Math.floor(depth), 3]} />
            ) : (
                <boxGeometry args={[2, 2, 2 * (depth / 3)]} />
            )}
            <meshPhysicalMaterial
                color={color}
                roughness={0.1}
                metalness={0.6}
                clearcoat={1.0}
                transmission={0.4}
                thickness={1.5}
                wireframe={rounding < 20}
            />
        </mesh>
    );
}

export default function WorkflowSection() {
    // 1. Zero-Code Core Control States
    const [color, setColor] = useState("#3b82f6");
    const [depth, setDepth] = useState(4);
    const [rounding, setRounding] = useState(60);
    const [speed, setSpeed] = useState(1);
    const [copied, setCopied] = useState(false);

    // 2. Generated Blueprint Schema Export
    const generatedSchema = JSON.stringify(
        {
            theme: "Immersive-V4",
            geometry: rounding > 50 ? "TorusKnot" : "Box",
            wireframeMode: rounding < 20,
            variables: { color, depth, speed, complexity: rounding },
        },
        null,
        2
    );

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedSchema);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="workflow" className="w-full min-h-screen bg-black text-white py-24 px-4 md:px-8 font-sans relative overflow-hidden select-none">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,#1e1b4b,transparent_50%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">

                {/* LEFT COLUMN: Visual Control Matrix (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/60 border border-white/[0.06] rounded-3xl p-6 backdrop-blur-xl">
                    <div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider max-w-fit mb-4">
                            <Sparkles className="h-3 w-3" /> No-Code Studio Core
                        </div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Zero-Code Engine</h2>
                        <p className="text-zinc-400 text-xs leading-relaxed mb-8">
                            Adjust global layout dimensions, render depths, and material constants visually. Watch the platform compiler map parameters seamlessly.
                        </p>

                        <div className="space-y-6">
                            {/* Variable 1: Tint Pipeline */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-300">
                                    <span>Color Preset Tint</span>
                                    <span className="text-zinc-500 uppercase">{color}</span>
                                </div>
                                <div className="flex gap-2">
                                    {["#3b82f6", "#a855f7", "#ec4899", "#10b981", "#ffffff"].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`h-8 w-8 rounded-xl border transition-all cursor-pointer ${color === c ? "border-white scale-110 shadow-lg" : "border-white/10 hover:border-white/30"
                                                }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Variable 2: Depth Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-300">
                                    <span>Perspective Depth Matrix</span>
                                    <span className="text-blue-400 font-mono">{depth}D</span>
                                </div>
                                <input
                                    type="range" min="1" max="8" step="0.5"
                                    value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Variable 3: Structural Topology */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-300">
                                    <span>Topology Mesh Type</span>
                                    <span className="text-purple-400 font-mono">
                                        {rounding < 20 ? "Wireframe" : rounding > 50 ? "Organic" : "Geometric"}
                                    </span>
                                </div>
                                <input
                                    type="range" min="0" max="100"
                                    value={rounding} onChange={(e) => setRounding(parseInt(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            {/* Variable 4: Kinetic Speed */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold tracking-wide text-zinc-300">
                                    <span>Kinetic Orbit Velocity</span>
                                    <span className="text-pink-400 font-mono">{speed}Hz</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="3" step="0.1"
                                    value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/[0.06] text-[10px] text-zinc-500 font-medium tracking-wide">
                        Layout Engine Active · Compiling to Native React 19 Components
                    </div>
                </div>

                {/* CENTER COLUMN: Real-Time WebGL Spatial Viewport (4 Cols) */}
                <div className="lg:col-span-4 h-[450px] lg:h-auto bg-zinc-950/40 border border-white/[0.06] rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-sm text-[10px] font-bold text-zinc-400">
                        <Layers className="h-3 w-3 text-emerald-400" /> WebGL Render Target
                    </div>

                    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <directionalLight position={[-4, 3, 2]} intensity={1.5} color={color} />
                        <directionalLight position={[4, -3, 2]} intensity={1} color="#6366f1" />
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <Center>
                                <PreviewMesh color={color} depth={depth} rounding={rounding} speed={speed} />
                            </Center>
                        </Float>
                    </Canvas>
                </div>

                {/* RIGHT COLUMN: Dynamic Structural JSON Compiler (3 Cols) */}
                <div className="lg:col-span-3 flex flex-col bg-[#080b11] border border-white/[0.06] rounded-3xl p-5 font-mono text-xs relative">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                            <Code2 className="h-3.5 w-3.5 text-blue-500" /> Production AST
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto text-zinc-400 selection:bg-zinc-800 leading-relaxed pr-1 max-h-[350px] lg:max-h-none">
                        <pre className="text-[11px] whitespace-pre-wrap">{generatedSchema}</pre>
                    </div>
                </div>

            </div>
        </section>
    );
}