import React, { useState, useEffect, useCallback } from "react";
import { LogOut, CheckCircle, XCircle, Loader2, User } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5051";

// ─── Toast Notification Component ────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-6 right-4 z-[2000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-medium shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-auto
            ${t.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/90 border-red-500/40 text-red-300"
            }`}
        >
          {t.type === "success"
            ? <CheckCircle className="h-4 w-4 shrink-0" />
            : <XCircle className="h-4 w-4 shrink-0" />
          }
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const navItems = [
    { name: "3D Builder", href: "#3d-builder" },
    { name: "Features",   href: "#features"   },
    { name: "Presets",    href: "#presets"     },
    { name: "Blog",       href: "#blog"        },
    { name: "Pricing",    href: "#pricing"     },
    { name: "Contact",    href: "#contact"     },
  ];

  const [activeTab,    setActiveTab]    = useState("");
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [authMode,     setAuthMode]     = useState("login"); // "login" | "signup"
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [toasts,       setToasts]       = useState([]);

  // ── Persisted auth state ──
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth_user")) || null; }
    catch { return null; }
  });

  // ── Toast helper ──
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // ── Hash tracking ──
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash || "#";
      const matched = navItems.find((i) => i.href === hash);
      setActiveTab(matched ? matched.name : "");
    };
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // ── Verify stored token on mount ──
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token || user) return;
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(({ user: u }) => {
        setUser(u);
        localStorage.setItem("auth_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser(null);
      });
  }, []);

  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = authMode === "login"
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        addToast(data.message || "Something went wrong.", "error");
        return;
      }

      // Save token + user
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsModalOpen(false);
      setEmail(""); setPassword(""); setName("");

      addToast(
        authMode === "login"
          ? `Welcome back, ${data.user.name}! 👋`
          : `Account created! Welcome, ${data.user.name}! 🎉`,
        "success"
      );
    } catch {
      addToast("Cannot connect to server. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    addToast("Signed out successfully.", "success");
  };

  const switchMode = () => {
    setAuthMode((m) => (m === "login" ? "signup" : "login"));
    setName(""); setEmail(""); setPassword("");
  };

  return (
    <>
      <Toast toasts={toasts} />

      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 px-4 py-2 rounded-full border border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-fit mix-blend-screen">

          {/* Logo */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-sm bg-black" />
            </div>
            <span className="font-black text-xs tracking-widest text-white uppercase font-sans">
              Ornitech
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-white bg-zinc-800/80 border border-white/10 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Right controls */}
          <div className="flex items-center gap-3 hidden sm:flex">
            {user && (
              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}

            {/* Avatar / login trigger */}
            <div
              onClick={() => !user && setIsModalOpen(true)}
              className={`h-7 w-7 rounded-full border overflow-hidden bg-zinc-800 transition-all ${
                user
                  ? "border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] cursor-default"
                  : "border-white/20 cursor-pointer hover:opacity-80"
              }`}
              title={user ? `Logged in as ${user.name}` : "Sign In"}
            >
              {user ? (
                <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* User name pill */}
            {user && (
              <span className="text-[10px] text-emerald-400 font-semibold hidden md:block max-w-[80px] truncate">
                {user.name}
              </span>
            )}
          </div>
        </nav>

        {/* ── Auth Modal ───────────────────────────────────────────────────── */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <div className="relative w-full max-w-sm p-8 bg-zinc-950/95 border border-white/10 rounded-3xl shadow-2xl mx-4 animate-in zoom-in-95 duration-200">

              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <span className="text-xs font-bold font-mono">✕</span>
              </button>

              {/* Icon */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-zinc-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {authMode === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="text-[10px] text-zinc-500">
                    {authMode === "login"
                      ? "Sign in to your 3D studio"
                      : "Join Ornitech 3D Studio"}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}

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
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-1"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {loading
                    ? "Please wait..."
                    : authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              {/* Switch mode */}
              <p className="mt-4 text-[11px] text-center text-zinc-500">
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  {authMode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
