import React from "react";
import { Mail } from "lucide-react";

function XIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.6 4H5.7l12 15.9Z" />
        </svg>
    );
}

function LinkedinIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.4 0h4v1.9h.1c.56-1.05 1.94-2.16 3.99-2.16 4.27 0 5.06 2.81 5.06 6.47V22h-4.2v-7c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V22h-4.2V8Z" />
        </svg>
    );
}

function InstagramIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

export default function Footer() {
    const footerSections = [
        {
            title: "PRODUCT",
            links: [
                { label: "Features", href: "#features" },
                { label: "3D Builder", href: "#3d-builder" },
                { label: "Presets", href: "#presets" },
                { label: "Pricing", href: "#pricing" },
                { label: "Changelog", href: "#changelog" },
            ],
        },
        {
            title: "COMPANY",
            links: [
                { label: "About", href: "#about" },
                { label: "Blog", href: "#blog" },
                { label: "Affiliate", href: "#affiliate" },
                { label: "Contact", href: "#contact" },
            ],
        },
        {
            title: "RESOURCES",
            links: [
                { label: "Docs", href: "#docs" },
                { label: "Customization Guide", href: "#guide" },
                { label: "SEO Best Practices", href: "#seo" },
                { label: "API Reference", href: "#api" },
                { label: "Help Center", href: "#help" },
                { label: "3D Engine", href: "#engine" },
            ],
        },
        {
            title: "LEGAL",
            links: [
                { label: "Privacy", href: "#privacy" },
                { label: "Terms", href: "#terms" },
                { label: "Cancellation & Refund", href: "#refund" },
                { label: "Cookies", href: "#cookies" },
                { label: "DPA", href: "#dpa" },
            ],
        },
    ];

    return (
        <footer className="w-full bg-black text-white border-t border-zinc-900/60 font-sans tracking-normal selection:bg-zinc-800">
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4">

                {/* Brand Column (Spans 4 grid units on desktop) */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        {/* Square Icon Logo */}
                        <div className="h-6 w-6 rounded-md bg-zinc-800 border border-white/20 flex items-center justify-center shadow-inner">
                            <div className="h-2 w-2 rounded-sm bg-white" />
                        </div>
                        <span className="font-black text-sm tracking-widest uppercase text-white">
                            Ornitech
                        </span>
                    </div>

                    <p className="text-zinc-500 text-xs leading-relaxed max-w-[260px] font-medium">
                        3D Website Builder for cinematic scroll experiences — generated from a single prompt.
                    </p>

                    {/* Social Icons Array */}
                    <div className="flex items-center gap-2 mt-2">
                        {[
                            { icon: <XIcon className="h-3.5 w-3.5" />, href: "#twitter" },
                            { icon: <LinkedinIcon className="h-3.5 w-3.5" />, href: "#linkedin" },
                            { icon: <InstagramIcon className="h-3.5 w-3.5" />, href: "#instagram" },
                            { icon: <Mail className="h-3.5 w-3.5" />, href: "#mail" },
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                className="h-8 w-8 rounded-lg border border-zinc-900 bg-zinc-950 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-200"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Dynamic Directory Columns (Spans 8 grid units collectively) */}
                <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-4">
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex flex-col gap-3.5">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-white">
                                {section.title}
                            </h4>
                            <ul className="flex flex-col gap-2.5">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors duration-200 font-medium"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        </footer>
    );
}
