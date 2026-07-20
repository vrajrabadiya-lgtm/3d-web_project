import React, { useState } from "react";
import {
  Sparkles,
  Terminal,
  Image,
  Video,
  Layers,
  Download,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PipelineSection() {
  const pipelineSteps = [
    {
      number: "01",
      title: "Pick a preset",
      desc: "Start from production-ready UI — customize copy and media in minutes.",
      icon: Sparkles,
      borderColor: "border-blue-500/30 bg-zinc-950/70",
      iconColor: "text-blue-400"
    },
    {
      number: "02",
      title: "Describe",
      desc: "Tell us the visual atmosphere you want.",
      icon: Terminal,
      borderColor: "border-zinc-800/60 bg-zinc-950",
      iconColor: "text-zinc-400"
    },
    {
      number: "03",
      title: "Generate",
      desc: "AI creates a cinematic keyframe.",
      icon: Image,
      borderColor: "border-zinc-800/60 bg-zinc-950",
      iconColor: "text-zinc-400"
    },
    {
      number: "04",
      title: "Animate",
      desc: "The image becomes a smooth 8s video.",
      icon: Video,
      borderColor: "border-zinc-800/60 bg-zinc-950",
      iconColor: "text-zinc-400"
    },
    {
      number: "05",
      title: "Build",
      desc: "AI extracts frames for a 3D scroll.",
      icon: Layers,
      borderColor: "border-zinc-800/60 bg-zinc-950",
      iconColor: "text-zinc-400"
    },
    {
      number: "06",
      title: "Deploy",
      desc: "Download a ZIP with HTML, CSS, JS.",
      icon: Download,
      borderColor: "border-zinc-800/60 bg-zinc-950",
      iconColor: "text-zinc-400"
    }
  ];

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: null, text: "" });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, text: "" });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5051"}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to send message.");
      }

      const data = await response.json();
      setFormStatus({
        type: "success",
        text: data.emailSent
          ? `Thanks ${data.name || contactName}! Message saved and email sent.`
          : `Thanks ${data.name || contactName}! Message saved to MongoDB. Email could not be sent — check EMAIL_USER / EMAIL_PASS in server/.env.`
      });
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err) {
      console.error(err);
      const isNetworkError =
        err instanceof TypeError ||
        (typeof err.message === "string" && err.message.toLowerCase().includes("fetch"));
      setFormStatus({
        type: "error",
        text: isNetworkError
          ? "Failed to connect to the backend server. Make sure it is running on port 5051."
          : err.message || "Failed to submit message."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pipeline" className="w-full bg-black text-white py-24 px-6 border-t border-zinc-900 select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Micro Category Tag */}
        <div className="inline-flex items-center gap-1.5 mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20 bg-blue-500/5 px-3 py-1 rounded-full">
          <span className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
          The Pipeline
        </div>

        {/* Typography Heading Set */}
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 max-w-4xl text-zinc-100">
          From prompt to <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">production</span>
        </h2>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mb-16 font-medium opacity-80">
          Use a stunning preset and edit in place — or describe a 3D scroll site from scratch.
          AI generates motion, extracts frames, and ships production HTML without a long prompt.
        </p>

        {/* Grid Deck */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative mb-28">

          {/* The Background Connecting Track line (visible behind cards on large layouts) */}
          <div className="absolute top-[48px] left-8 right-8 h-[1px] bg-zinc-900 hidden lg:block z-0" />

          {pipelineSteps.map((step, index) => {
            const StepIcon = step.icon;

            return (
              <div
                key={index}
                className={`relative z-10 p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 group hover:border-zinc-700 hover:bg-zinc-950 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] ${step.borderColor}`}
              >
                {/* Squared Soft Icon Node */}
                <div className="h-11 w-11 rounded-xl bg-zinc-900/50 border border-zinc-800/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <StepIcon className={`h-4 w-4 ${step.iconColor} group-hover:text-white transition-colors`} />
                </div>

                {/* Index Number */}
                <span className="text-[10px] font-bold tracking-widest text-zinc-600 font-mono mb-2 block">
                  {step.number}
                </span>

                {/* Card Header */}
                <h3 className="text-sm font-bold text-zinc-100 mb-2 tracking-tight group-hover:text-white">
                  {step.title}
                </h3>

                {/* Card Body Narrative */}
                <p className="text-zinc-500 text-[11px] leading-relaxed max-w-[170px] mt-1 group-hover:text-zinc-400 transition-colors">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* NEW SECTION: PREMIUM GLASSMORPHIC CONTACT FORM */}
        <div className="w-full max-w-4xl text-left border border-white/[0.06] rounded-[2.5rem] bg-gradient-to-b from-zinc-950 to-black p-8 md:p-14 relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block mb-2">
                  Have Questions?
                </span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3">
                  Let's Connect
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Have customization inquiries or questions about our WebGL engine? Fill out the form, and your query will compile directly into our MongoDB Atlas database feed.
                </p>
              </div>

              <div className="space-y-4 pt-4 text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>support@ornitech.space</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-purple-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span>24/7 MERN Stack Support Enabled</span>
                </div>
              </div>
            </div>

            {/* Contact HTML Form */}
            <div className="lg:col-span-7 bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              
              {formStatus.text && (
                <div
                  className={`p-4 mb-6 rounded-xl border flex items-start gap-2.5 text-xs ${
                    formStatus.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-red-500/10 border-red-500/20 text-red-300"
                  }`}
                >
                  {formStatus.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{formStatus.text}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full h-10 px-3 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-700 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-700 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how we can help you configure your 3D workflow..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-3 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-700 outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-500/10"
                >
                  {isSubmitting ? (
                    <span>Sending Submission...</span>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}