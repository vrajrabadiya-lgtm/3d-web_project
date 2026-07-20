import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float, OrbitControls } from "@react-three/drei";
import {
  Palette,
  Layers,
  Sliders,
  CloudLightning,
  ChevronLeft,
  Loader2,
  Trash2,
  FolderOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  Share2
} from "lucide-react";

// Interactive 3D Model that dynamically reflects state variables
function BuilderMesh({ config, rotateSpeed }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && rotateSpeed > 0) {
      const t = state.clock.getElapsedTime() * rotateSpeed;
      meshRef.current.rotation.x = Math.sin(t / 4) * 0.3;
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.rotation.z = Math.cos(t / 5) * 0.15;
    }
  });

  const getMaterialProps = () => {
    switch (config.materialType) {
      case "metal":
        return {
          roughness: 0.15,
          metalness: 0.95,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          transmission: 0,
          wireframe: false,
        };
      case "glass":
        return {
          roughness: 0.05,
          metalness: 0.05,
          clearcoat: 1.0,
          transmission: 0.9,
          thickness: 1.8,
          ior: 1.5,
          wireframe: false,
        };
      case "wireframe":
        return {
          roughness: 0.5,
          metalness: 0.5,
          clearcoat: 0,
          transmission: 0,
          wireframe: true,
        };
      case "holographic":
        return {
          roughness: 0.2,
          metalness: 0.8,
          clearcoat: 1.0,
          transmission: 0.3,
          wireframe: false,
          color: config.color,
          emissive: config.color,
          emissiveIntensity: 0.2,
        };
      case "matte":
      default:
        return {
          roughness: 0.85,
          metalness: 0.05,
          clearcoat: 0,
          transmission: 0,
          wireframe: false,
        };
    }
  };

  const matProps = getMaterialProps();
  const segments = Math.floor(config.complexity);

  // Render correct geometry based on shape state
  const renderGeometry = () => {
    switch (config.shape) {
      case "Box":
        return <boxGeometry args={[1.5, 1.5, 1.5, segments, segments, segments]} />;
      case "Sphere":
        return <sphereGeometry args={[1, segments, segments]} />;
      case "Cylinder":
        return <cylinderGeometry args={[0.8, 0.8, 1.8, segments]} />;
      case "Torus":
        return <torusGeometry args={[0.9, 0.3, segments, segments]} />;
      case "TorusKnot":
      default:
        return <torusKnotGeometry args={[0.8, 0.28, segments * 2, segments, 3, 4]} />;
    }
  };

  return (
    <mesh ref={meshRef} scale={[config.scale, config.scale, config.scale]}>
      {renderGeometry()}
      <meshPhysicalMaterial
        color={config.color}
        {...matProps}
      />
    </mesh>
  );
}

export default function Builder() {
  // 1. Control State Variables
  const [activeSidebarTab, setActiveSidebarTab] = useState("colors");
  const [userId, setUserId] = useState("user_demo");
  const [designName, setDesignName] = useState("Cyber Torus");
  
  // Customization variables
  const [color, setColor] = useState("#3b82f6");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [materialType, setMaterialType] = useState("metal");
  const [shape, setShape] = useState("TorusKnot");
  const [scale, setScale] = useState(1.2);
  const [rotateSpeed, setRotateSpeed] = useState(1.0);
  const [complexity, setComplexity] = useState(64);

  // 2. Saved Projects State
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [apiStatus, setApiStatus] = useState({ type: null, message: "" });

  const BACKEND_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5051"}/api/designs`;

  // Fetch designs for the current user
  const fetchUserDesigns = async (targetUid = userId) => {
    if (!targetUid.trim()) return;
    setIsLoadingDesigns(true);
    try {
      const response = await fetch(`${BACKEND_URL}/${targetUid}`);
      if (!response.ok) throw new Error("Failed to fetch designs.");
      const data = await response.json();
      setSavedDesigns(data);
    } catch (error) {
      console.error(error);
      setApiStatus({ type: "error", message: "Failed to load projects from server." });
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  // Handle save project submission
  const handleSaveDesign = async (e) => {
    e.preventDefault();
    if (!designName.trim()) {
      setApiStatus({ type: "error", message: "Please provide a project name." });
      return;
    }
    setIsSaving(true);
    setApiStatus({ type: null, message: "" });

    const payload = {
      userId,
      designName,
      config: {
        color,
        lightColor,
        materialType,
        shape,
        scale,
        rotateSpeed,
        complexity,
      },
    };

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not save to MongoDB Atlas.");
      }

      const savedData = await response.json();
      setApiStatus({ type: "success", message: `Successfully saved "${designName}"!` });
      
      // Refresh design feed
      fetchUserDesigns(userId);
    } catch (err) {
      console.error(err);
      setApiStatus({ type: "error", message: "Failed to save project. Ensure backend is running." });
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved project configuration into active state
  const handleLoadDesign = (design) => {
    const config = design.config;
    setColor(config.color || "#3b82f6");
    setLightColor(config.lightColor || "#ffffff");
    setMaterialType(config.materialType || "metal");
    setShape(config.shape || "TorusKnot");
    setScale(config.scale || 1.2);
    setRotateSpeed(config.rotateSpeed !== undefined ? config.rotateSpeed : 1.0);
    setComplexity(config.complexity || 64);
    setDesignName(design.designName);
    setApiStatus({ type: "success", message: `Loaded project "${design.designName}"` });
  };

  // Delete a project from backend
  const handleDeleteDesign = async (id) => {
    setIsDeletingId(id);
    setApiStatus({ type: null, message: "" });
    try {
      const response = await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed.");
      
      setSavedDesigns((prev) => prev.filter((d) => d._id !== id));
      setApiStatus({ type: "success", message: "Project deleted successfully." });
    } catch (error) {
      console.error(error);
      setApiStatus({ type: "error", message: "Could not delete project from database." });
    } finally {
      setIsDeletingId(null);
    }
  };

  // Fetch designs on mount and when userId changes
  useEffect(() => {
    fetchUserDesigns();
  }, [userId]);

  // Quick auto-clean message after 4 seconds
  useEffect(() => {
    if (apiStatus.message) {
      const timer = setTimeout(() => {
        setApiStatus({ type: null, message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [apiStatus]);

  const activeConfig = { color, lightColor, materialType, shape, scale, rotateSpeed, complexity };

  return (
    <div className="h-screen w-full bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Background visual ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#090d16,transparent_60%)] pointer-events-none" />

      {/* 1. LEFT SIDEBAR PANEL: Controls */}
      <aside className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl flex flex-col z-20 shrink-0 h-1/2 md:h-full">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="p-1.5 rounded-lg border border-white/10 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
              title="Return to Landing Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </a>
            <h1 className="font-extrabold text-sm uppercase tracking-wider text-zinc-200">
              3D Design Studio
            </h1>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Compiler
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 border-b border-white/10 text-zinc-400 text-xs font-semibold">
          {[
            { id: "colors", label: "Colors", icon: Palette },
            { id: "textures", label: "Textures", icon: Layers },
            { id: "geometry", label: "Mesh", icon: Sliders },
            { id: "save", label: "Cloud", icon: CloudLightning },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`py-3.5 flex flex-col items-center gap-1 transition-all border-b-2 hover:text-zinc-200 cursor-pointer ${
                  isActive
                    ? "border-blue-500 text-white bg-zinc-900/40"
                    : "border-transparent text-zinc-400 hover:bg-zinc-900/10"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Content Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tab View: COLORS */}
          {activeSidebarTab === "colors" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Material Tint Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-12 bg-transparent border border-white/10 rounded-lg cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 h-10 px-3 bg-zinc-900 border border-white/10 rounded-lg text-xs font-mono text-zinc-200 uppercase outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {/* Custom Color Swatches */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {[
                    "#3b82f6", // Blue
                    "#a855f7", // Purple
                    "#ec4899", // Pink
                    "#10b981", // Green
                    "#f59e0b", // Amber
                    "#ef4444", // Red
                    "#06b6d4", // Cyan
                    "#e2e8f0", // White
                    "#71717a", // Zinc
                    "#090d16", // Deep space
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setColor(preset)}
                      className={`h-7 rounded-md border transition-all cursor-pointer ${
                        color.toLowerCase() === preset.toLowerCase()
                          ? "border-white scale-110 shadow-lg"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Directional Ambient Light Color
                </label>
                <div className="flex gap-2">
                  {[
                    { hex: "#ffffff", label: "Studio" },
                    { hex: "#3b82f6", label: "Neon Blue" },
                    { hex: "#a855f7", label: "Sunset Purple" },
                    { hex: "#ec4899", label: "Hot Pink" },
                    { hex: "#10b981", label: "Cyber Green" },
                  ].map((light) => (
                    <button
                      key={light.hex}
                      onClick={() => setLightColor(light.hex)}
                      className={`flex-1 py-2 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${
                        lightColor === light.hex
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/15"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full mx-auto mb-1 border border-white/10"
                        style={{ backgroundColor: light.hex }}
                      />
                      {light.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab View: TEXTURES / MATERIALS */}
          {activeSidebarTab === "textures" && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Select Physical Texture Finish
              </label>
              {[
                {
                  id: "metal",
                  title: "High-Gloss Metal",
                  desc: "Highly reflective chrome finish with metallic coating.",
                  color: "from-zinc-400 to-zinc-600",
                },
                {
                  id: "glass",
                  title: "Translucent Glass",
                  desc: "Clear physical refraction with light transmission depth.",
                  color: "from-sky-300/40 to-indigo-400/20",
                },
                {
                  id: "matte",
                  title: "Satin Matte",
                  desc: "Chalky smooth texture absorbing direct light scatter.",
                  color: "from-amber-600/30 to-amber-700/10",
                },
                {
                  id: "holographic",
                  title: "Space Hologram",
                  desc: "Faux iridescent glow mapping responsive colors.",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  id: "wireframe",
                  title: "Matrix Wireframe",
                  desc: "Visual skeleton showing triangular topology vectors.",
                  color: "from-emerald-600/30 to-zinc-900",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterialType(m.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer group ${
                    materialType === m.id
                      ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5"
                      : "border-white/5 bg-zinc-900/30 hover:border-white/10"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${m.color} border border-white/10 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center`}
                  >
                    {m.id === "wireframe" && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400">VERT</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">
                      {m.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tab View: GEOMETRY */}
          {activeSidebarTab === "geometry" && (
            <div className="space-y-6">
              
              {/* Shape Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Structural Topology Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "TorusKnot", name: "Torus Knot" },
                    { id: "Torus", name: "Torus Ring" },
                    { id: "Sphere", name: "Sphere" },
                    { id: "Box", name: "Box Cube" },
                    { id: "Cylinder", name: "Cylinder" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id)}
                      className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all cursor-pointer ${
                        shape === s.id
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/5 bg-zinc-900/30 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                {/* Scale Size */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400 uppercase tracking-wider">Dimension Scale</span>
                    <span className="text-blue-400 font-mono">{scale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Auto Rotate Speed */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400 uppercase tracking-wider">Orbit Velocity</span>
                    <span className="text-purple-400 font-mono">{rotateSpeed.toFixed(1)}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.2"
                    value={rotateSpeed}
                    onChange={(e) => setRotateSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Complexity/Rounding Segments */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400 uppercase tracking-wider">Mesh Subdivisions</span>
                    <span className="text-pink-400 font-mono">{Math.floor(complexity)} pts</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="128"
                    step="8"
                    value={complexity}
                    onChange={(e) => setComplexity(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab View: SAVE / SHARE */}
          {activeSidebarTab === "save" && (
            <div className="space-y-6">
              
              {/* Database Status Alert banner */}
              {apiStatus.message && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    apiStatus.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}
                >
                  {apiStatus.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{apiStatus.message}</span>
                </div>
              )}

              {/* Cloud Save Form */}
              <form onSubmit={handleSaveDesign} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Design Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter configuration title..."
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex justify-between">
                    <span>User Account Session ID</span>
                    <span className="text-zinc-600 font-mono">Simulates Auth</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-500/15"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving to Atlas...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Project</span>
                    </>
                  )}
                </button>
              </form>

              {/* Database Feed - My Saved Projects */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <FolderOpen className="h-3.5 w-3.5 text-zinc-500" />
                    <span>My Saved Projects ({savedDesigns.length})</span>
                  </h3>
                  <button
                    onClick={() => fetchUserDesigns(userId)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>

                {isLoadingDesigns ? (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-[10px]">Querying MongoDB Atlas...</span>
                  </div>
                ) : savedDesigns.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl bg-zinc-900/10 text-zinc-600 text-xs">
                    No designs found for "{userId}".<br />Customize and save one above!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {savedDesigns.map((design) => (
                      <div
                        key={design._id}
                        className="p-3 bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 rounded-xl flex items-center justify-between gap-3 group/item transition-colors"
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleLoadDesign(design)}
                          title="Click to load config"
                        >
                          <div className="text-xs font-bold text-zinc-200 group-hover/item:text-white transition-colors truncate">
                            {design.designName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-zinc-500 font-medium">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              {design.config?.shape || "Shape"}
                            </span>
                            <span className="capitalize">{design.config?.materialType || "Finish"}</span>
                            <span>•</span>
                            <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDesign(design._id)}
                          disabled={isDeletingId === design._id}
                          className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                          title="Delete from DB"
                        >
                          {isDeletingId === design._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-950 text-center text-[10px] text-zinc-600 font-medium">
          MERN Connected · ORNITECH WebGL Engine v2.0.4
        </div>
      </aside>

      {/* 2. RIGHT VIEWPORT: 3D Render Canvas */}
      <main className="flex-1 h-1/2 md:h-full relative select-none">
        
        {/* Render status overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-bold text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>WebGL Render Target: Active</span>
          </div>
          
          {/* Real-time AST readout */}
          <div className="px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-[9px] font-mono text-zinc-500 leading-normal hidden sm:block">
            <div className="text-zinc-300 font-semibold mb-1">AST Data:</div>
            <div>SHAPE: <span className="text-blue-400">{shape}</span></div>
            <div>MATERIAL: <span className="text-purple-400">{materialType}</span></div>
            <div>COLOR: <span className="text-emerald-400">{color}</span></div>
            <div>SCALE: <span className="text-amber-400">{scale}</span></div>
          </div>
        </div>

        {/* Interactive Floating Canvas HUD */}
        <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/#3d-builder`;
              navigator.clipboard.writeText(url);
              setApiStatus({ type: "success", message: "Builder link copied to clipboard!" });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xl transition-all cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Share Design</span>
          </button>
        </div>

        {/* The 3D Canvas */}
        <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.7} />
          
          {/* Main directional light reacting to customization */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            color={lightColor}
          />
          
          {/* Fill lights */}
          <directionalLight
            position={[-5, 3, 2]}
            intensity={0.6}
            color="#ffffff"
          />
          <directionalLight
            position={[0, -5, -2]}
            intensity={0.4}
            color="#3b82f6"
          />

          {/* Model container with subtle float animation */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <Center>
              <BuilderMesh config={activeConfig} rotateSpeed={rotateSpeed} />
            </Center>
          </Float>

          {/* Orbit controls allows free orbital camera movement */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={2.5}
            maxDistance={7}
            makeDefault
          />
        </Canvas>
      </main>

    </div>
  );
}
