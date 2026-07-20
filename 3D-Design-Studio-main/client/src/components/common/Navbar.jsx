import React, { useState, useEffect } from "react";
import { Globe, ChevronDown, LogOut } from "lucide-react";
import Button from "../ui/button";

export default function Navbar() {
  const navItems = [
    { name: "3D Builder", href: "#3d-builder" },
    { name: "Features", href: "#features" },
    { name: "Presets", href: "#presets" },
    { name: "Blog", href: "#blog" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#";
      const matched = navItems.find((item) => item.href === hash);
      if (matched) {
        setActiveTab(matched.name);
      } else if (hash === "" || hash === "#") {
        setActiveTab("");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initialize on mount
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Logged In User Credentials:", { email, password });
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 px-4 py-2 rounded-full border border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-fit mix-blend-screen">

        {/* Logo Section */}
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
            <div className="h-2 w-2 rounded-sm bg-black" />
          </div>
          <span className="font-black text-xs tracking-widest text-white uppercase font-sans">
            Ornitech
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.name);
                }}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${isActive
                  ? "text-white bg-zinc-800/80 border border-white/10 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Right Side Controls (Language, Avatar & Logout) */}
        <div className="flex items-center gap-3 hidden sm:flex">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}

          {/* User Profile Avatar */}
          <div
            onClick={() => setIsModalOpen(true)}
            className={`h-7 w-7 rounded-full border overflow-hidden bg-zinc-800 cursor-pointer hover:opacity-80 transition-all ${
              isLoggedIn ? "border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "border-white/20"
            }`}
            title={isLoggedIn ? `Logged in as ${email} (Click to change session)` : "Open Sign In Menu"}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

      </nav>

      {/* Modern Glassmorphic Login Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          
          {/* Modal Container */}
          <div className="relative w-full max-w-sm p-8 bg-zinc-950/90 border border-white/10 rounded-3xl shadow-2xl mx-4 transform transition-all duration-300 animate-in zoom-in-95">
            
            {/* Close (X) Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              title="Close modal"
            >
              <span className="text-xs font-bold font-mono">X</span>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Account Sign In
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-normal">
                Enter your credentials to connect with your customized 3D design studio dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-650 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-650 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-white text-black hover:bg-zinc-200 transition-colors font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-white/5"
              >
                Sign In
              </button>
            </form>

            {/* Footer Notice */}
            <div className="mt-5 text-[10px] text-center text-zinc-500">
              Future database synchronization will authenticate via MongoDB Atlas.
            </div>

          </div>
        </div>
      )}
    </div>
  );
}